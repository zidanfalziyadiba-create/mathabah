// @ts-nocheck
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB: any;
  ADMIN_PASSWORD?: string;
}

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Content-Type-Options": "nosniff",
};

const RATE_WINDOW_MS = 10 * 60 * 1000;
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_RATE_BACKOFF_MS = 15 * 60 * 1000;
const BODY_TOO_LARGE = "BODY_TOO_LARGE";
let publicSiteCache: { data: Record<string, any> | null; expiresAt: number } | null = null;

function jsonResponse(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });
}

async function ensureSchema(env: Env): Promise<void> {
  if (!env.DB) throw new Error("D1 binding DB is missing");
  // Provision tables and indexes through worker/migrations/*.sql, never in a request.
}

function requestIsTooLarge(request: Request, maxBytes: number): boolean {
  const length = request.headers.get("Content-Length");
  if (!length) return false;
  const bytes = Number(length);
  return Number.isFinite(bytes) && bytes > maxBytes;
}

async function readBodyWithinLimit(request: Request, maxBytes: number): Promise<any> {
  if (requestIsTooLarge(request, maxBytes)) throw new Error(BODY_TOO_LARGE);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > maxBytes) throw new Error(BODY_TOO_LARGE);
  return JSON.parse(raw);
}

function isJsonRequest(request: Request): boolean {
  return (request.headers.get("Content-Type") || "").toLowerCase().split(";")[0].trim() === "application/json";
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBoundedJson(value: any, depth = 0): boolean {
  if (depth > 8) return false;
  if (value === null || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.length <= 2_800_000;
  if (Array.isArray(value)) return value.length <= 100 && value.every((item) => isBoundedJson(item, depth + 1));
  if (!isPlainObject(value)) return false;
  const entries = Object.entries(value);
  return entries.length <= 60 && entries.every(([key, item]) => key.length <= 80 && isBoundedJson(item, depth + 1));
}

function validateSiteData(data: unknown): boolean {
  if (!isPlainObject(data) || !isBoundedJson(data)) return false;
  const topLevel = new Set(["announcement", "promotionalPopup", "branding", "hero", "contact", "socials", "gallery", "services", "stats", "adminAuth", "updatedAt"]);
  if (Object.keys(data).some((key) => !topLevel.has(key))) return false;
  if (data.updatedAt !== undefined && (typeof data.updatedAt !== "string" || data.updatedAt.length > 48)) return false;
  for (const key of ["announcement", "promotionalPopup", "branding", "hero", "contact", "socials", "adminAuth"]) {
    if (data[key] !== undefined && !isPlainObject(data[key])) return false;
  }
  for (const key of ["gallery", "services", "stats"]) {
    if (data[key] !== undefined && !Array.isArray(data[key])) return false;
  }
  if (data.adminAuth?.username !== undefined && (typeof data.adminAuth.username !== "string" || data.adminAuth.username.trim().length > 80)) return false;
  if (data.adminAuth?.newPassword !== undefined && (typeof data.adminAuth.newPassword !== "string" || data.adminAuth.newPassword.length > 256)) return false;
  if (data.announcement?.enabled !== undefined && typeof data.announcement.enabled !== "boolean") return false;
  if (data.contact?.mapEnabled !== undefined && typeof data.contact.mapEnabled !== "boolean") return false;
  for (const key of ["gallery", "services", "stats"]) {
    const rows = data[key];
    if (!rows) continue;
    const maxRows = key === "gallery" ? 40 : key === "services" ? 20 : 10;
    if (rows.length > maxRows || rows.some((row: any) => !isPlainObject(row))) return false;
    const stringFields = key === "gallery"
      ? ["image", "kicker", "title", "category", "text"]
      : key === "services"
        ? ["no", "category", "image", "title", "label", "text", "href"]
        : ["value", "label"];
    if (rows.some((row: any) => stringFields.some((field) => row[field] !== undefined && (typeof row[field] !== "string" || row[field].length > (field === "image" ? 2_800_000 : 3_000))))) return false;
  }
  for (const value of Object.values(data)) {
    if (!isBoundedJson(value)) return false;
  }
  return true;
}

function clientAddress(request: Request): string {
  return request.headers.get("CF-Connecting-IP")?.trim() || "unknown";
}

async function rateBucketKey(env: Env, scope: string, value: string): Promise<string> {
  const secret = env.ADMIN_PASSWORD || "mathabah-rate-limit-fallback-v1";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${scope}\u0000${value}`));
  return `${scope}:${toHex(new Uint8Array(signature))}`;
}

async function consumeRateBucket(env: Env, bucketKey: string, windowMs: number, limit: number, now = Date.now()): Promise<number> {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const row = await env.DB.prepare(`
    INSERT INTO request_rate_limits (bucket_key, window_start, attempts, blocked_until)
    VALUES (?, ?, 1, 0)
    ON CONFLICT(bucket_key) DO UPDATE SET
      attempts = CASE WHEN request_rate_limits.window_start = excluded.window_start THEN request_rate_limits.attempts + 1 ELSE 1 END,
      blocked_until = CASE WHEN request_rate_limits.window_start = excluded.window_start OR request_rate_limits.blocked_until > ? THEN request_rate_limits.blocked_until ELSE 0 END,
      window_start = excluded.window_start
    RETURNING attempts, blocked_until
  `).bind(bucketKey, windowStart, now).first();
  const blockedUntil = Number(row?.blocked_until || 0);
  if (blockedUntil > now) return Math.max(1, Math.ceil((blockedUntil - now) / 1000));
  const attempts = Number(row?.attempts || 0);
  if (attempts <= limit) return 0;
  const excess = attempts - limit;
  const backoffMs = Math.min(MAX_RATE_BACKOFF_MS, 30_000 * (2 ** Math.min(excess - 1, 5)));
  await env.DB.prepare("UPDATE request_rate_limits SET blocked_until = MAX(blocked_until, ?) WHERE bucket_key = ?")
    .bind(now + backoffMs, bucketKey).run();
  return Math.ceil(backoffMs / 1000);
}

async function enforceRateLimits(env: Env, rules: Array<{ scope: string; value: string; windowMs: number; limit: number }>): Promise<number> {
  await ensureSchema(env);
  let retryAfter = 0;
  for (const rule of rules) {
    const key = await rateBucketKey(env, rule.scope, rule.value);
    retryAfter = Math.max(retryAfter, await consumeRateBucket(env, key, rule.windowMs, rule.limit));
  }
  return retryAfter;
}

async function clearRateLimits(env: Env, rules: Array<{ scope: string; value: string }>): Promise<void> {
  const statements = await Promise.all(rules.map(async (rule) => {
    const key = await rateBucketKey(env, rule.scope, rule.value);
    return env.DB.prepare("DELETE FROM request_rate_limits WHERE bucket_key = ?").bind(key);
  }));
  if (statements.length) await env.DB.batch(statements);
}

async function readRecord(env: Env, key: string): Promise<Record<string, any> | null> {
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT payload FROM mathabah_store WHERE id = ?").bind(key).first();
  return row?.payload ? JSON.parse(row.payload) : null;
}

async function writeRecord(env: Env, key: string, value: Record<string, any>): Promise<void> {
  await ensureSchema(env);
  await env.DB.prepare("INSERT INTO mathabah_store (id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at")
    .bind(key, JSON.stringify(value), new Date().toISOString()).run();
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i++) result |= left[i] ^ right[i];
  return result === 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const PASSWORD_HASH_ITERATIONS = 100_000;

async function hashPassword(password: string, saltHex: string, iterations = PASSWORD_HASH_ITERATIONS): Promise<string> {
  const salt = new Uint8Array(saltHex.match(/.{2}/g)?.map((part) => parseInt(part, 16)) || []);
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, material, 256);
  return toHex(new Uint8Array(bits));
}

function freshSalt(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

const SAFE_AUTH_ERROR_NAMES = new Set([
  "Error", "TypeError", "SyntaxError", "RangeError", "ReferenceError", "URIError", "EvalError", "AggregateError", "DOMException",
  "DataError", "OperationError", "NotSupportedError", "InvalidAccessError", "SecurityError", "AbortError", "NetworkError",
  "ConstraintError", "QuotaExceededError", "UnknownError",
]);

type AuthDiagnosticStage = "read_admin_record" | "validate_username" | "derive_password_hash" | "compare_password_hash" | "compare_legacy_password";

function safeAuthErrorType(error: unknown): string {
  const candidate = error && typeof error === "object" && "name" in error
    ? (error as { name?: unknown }).name
    : null;
  if (typeof candidate === "string" && SAFE_AUTH_ERROR_NAMES.has(candidate)) return candidate;
  if (error === null) return "ThrownNull";
  if (typeof error === "object") return "ThrownObject";
  if (typeof error === "string") return "ThrownString";
  return "ThrownPrimitive";
}

async function verifyAdmin(env: Env, userIn: string, passIn: string, onStage?: (stage: AuthDiagnosticStage) => void): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  onStage?.("read_admin_record");
  const stored = await readRecord(env, "site_data");
  const auth = stored?.adminAuth || {};
  const expectedUser = String(auth.username || "admin").trim().toLowerCase();
  const user = String(userIn || "").trim().toLowerCase();
  const password = String(passIn || "");
  onStage?.("validate_username");
  if (!user || !password || !constantTimeEqual(user, expectedUser)) return false;
  if (auth.passwordHash && auth.passwordSalt) {
    const iterations = Number(auth.passwordIterations ?? PASSWORD_HASH_ITERATIONS);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > PASSWORD_HASH_ITERATIONS) return false;
    onStage?.("derive_password_hash");
    const candidateHash = await hashPassword(password, auth.passwordSalt, iterations);
    onStage?.("compare_password_hash");
    return constantTimeEqual(candidateHash, auth.passwordHash);
  }
  onStage?.("compare_legacy_password");
  return constantTimeEqual(password, env.ADMIN_PASSWORD);
}

const ADMIN_SESSION_COOKIE = "mathabah_admin_session";
const ADMIN_SESSION_TTL = 8 * 60 * 60;

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - base64.length % 4) % 4));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function signSession(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  let binary = "";
  for (const byte of signature) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function createAdminSession(env: Env, username: string): Promise<string> {
  const stored = await readRecord(env, "site_data");
  const sessionVersion = Number(stored?.adminAuth?.sessionVersion || 0);
  const payload = base64UrlEncode(JSON.stringify({ username, sessionVersion, exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL }));
  return `${payload}.${await signSession(payload, env.ADMIN_PASSWORD || "")}`;
}

async function getAdminSession(request: Request, env: Env): Promise<string | null> {
  if (!env.ADMIN_PASSWORD) return null;
  const cookie = request.headers.get("Cookie") || "";
  const raw = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))?.slice(ADMIN_SESSION_COOKIE.length + 1);
  if (!raw) return null;
  const [payload, signature, extra] = raw.split(".");
  if (!payload || !signature || extra !== undefined) return null;
  const expected = await signSession(payload, env.ADMIN_PASSWORD);
  if (!constantTimeEqual(signature, expected)) return null;
  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session?.username || !Number.isFinite(session.exp) || session.exp <= Math.floor(Date.now() / 1000)) return null;
    const stored = await readRecord(env, "site_data");
    if (Number(session.sessionVersion || 0) !== Number(stored?.adminAuth?.sessionVersion || 0)) return null;
    return cleanText(session.username, 80) || null;
  } catch { return null; }
}

function sessionCookie(value: string, maxAge: number): string {
  return `${ADMIN_SESSION_COOKIE}=${value}; Path=/api; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

function cleanText(value: unknown, max: number): string {
  return String(value || "").trim().slice(0, max);
}

function isSameOrigin(request: Request, url: URL): boolean {
  return request.headers.get("Origin") === url.origin;
}

function isTrustedSameOrigin(request: Request, url: URL): boolean {
  return isSameOrigin(request, url) && request.headers.get("Sec-Fetch-Site") !== "cross-site";
}

function riyadhDayKey(value = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const values: Record<string, string> = {};
  for (const part of parts) if (part.type !== "literal") values[part.type] = part.value;
  return `${values.year}-${values.month}-${values.day}`;
}

function riyadhStartIso(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date) - 3 * 60 * 60 * 1000).toISOString();
}

async function analyticsVisitorHash(day: string, sessionId: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${day}:${sessionId}`));
  return toHex(new Uint8Array(digest));
}

async function trackAnalyticsEvent(env: Env, event: string, sessionId: string): Promise<void> {
  await ensureSchema(env);
  const now = Date.now();
  const day = riyadhDayKey(new Date(now));
  const visitorHash = await analyticsVisitorHash(day, sessionId);

  if (event === "page_view") {
    const inserted = await env.DB.prepare("INSERT OR IGNORE INTO analytics_daily_visitors (day, visitor_hash) VALUES (?, ?)").bind(day, visitorHash).run();
    const isNewVisitor = Number(inserted?.meta?.changes || 0) > 0 ? 1 : 0;
    await env.DB.prepare("INSERT INTO analytics_daily (day, page_views, unique_visitors) VALUES (?, 1, ?) ON CONFLICT(day) DO UPDATE SET page_views = page_views + 1, unique_visitors = unique_visitors + excluded.unique_visitors")
      .bind(day, isNewVisitor).run();
  }

  await env.DB.prepare("INSERT INTO analytics_live_sessions (visitor_hash, last_seen_at) VALUES (?, ?) ON CONFLICT(visitor_hash) DO UPDATE SET last_seen_at = excluded.last_seen_at")
    .bind(visitorHash, now).run();
}

async function readAnalytics(env: Env): Promise<Record<string, any>> {
  await ensureSchema(env);
  const now = Date.now();
  const today = riyadhDayKey(new Date(now));
  const todayStart = riyadhStartIso(today);
  const dayKeys = Array.from({ length: 7 }, (_, index) => riyadhDayKey(new Date(now - (6 - index) * 24 * 60 * 60 * 1000)));
  const firstDay = dayKeys[0];
  const [active, dailyRows, leadsTotalRow, leadsTodayRow, leadTrendRows] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM analytics_live_sessions WHERE last_seen_at >= ?").bind(now - 90_000).first(),
    env.DB.prepare("SELECT day, page_views AS pageViews, unique_visitors AS visitors FROM analytics_daily WHERE day >= ? ORDER BY day ASC").bind(firstDay).all(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM customer_leads").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM customer_leads WHERE created_at >= ?").bind(todayStart).first(),
    env.DB.prepare("SELECT date(created_at, '+3 hours') AS day, COUNT(*) AS leads FROM customer_leads WHERE created_at >= ? GROUP BY date(created_at, '+3 hours')").bind(riyadhStartIso(firstDay)).all(),
  ]);
  const dailyMap = new Map((dailyRows?.results || []).map((row: any) => [row.day, row]));
  const leadMap = new Map((leadTrendRows?.results || []).map((row: any) => [row.day, Number(row.leads || 0)]));
  const daily = dayKeys.map((day) => {
    const row: any = dailyMap.get(day) || {};
    return { day, visitors: Number(row.visitors || 0), pageViews: Number(row.pageViews || 0), leads: Number(leadMap.get(day) || 0) };
  });
  const todayRow: any = dailyMap.get(today) || {};

  return {
    summary: {
      activeVisitors: Number(active?.count || 0),
      visitorsToday: Number(todayRow.visitors || 0),
      pageViewsToday: Number(todayRow.pageViews || 0),
      leadsToday: Number(leadsTodayRow?.count || 0),
      leadsTotal: Number(leadsTotalRow?.count || 0),
    },
    daily,
    updatedAt: new Date(now).toISOString(),
  };
}

async function handleApi(request: Request, env: Env, url: URL, path: string): Promise<Response | null> {
  if (path === "/api/site-data" && request.method === "GET") {
    try {
      const now = Date.now();
      if (!publicSiteCache || publicSiteCache.expiresAt <= now) {
        const stored = await readRecord(env, "site_data");
        if (!stored) publicSiteCache = { data: null, expiresAt: now + 30_000 };
        else {
          const { adminAuth: _privateAuth, ...publicData } = stored;
          publicSiteCache = { data: publicData, expiresAt: now + 30_000 };
        }
      }
      return jsonResponse({ ok: true, data: publicSiteCache.data }, 200, {
        "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
      });
    } catch {
      return jsonResponse({ ok: false, error: "قاعدة البيانات غير متاحة حالياً" }, 503);
    }
  }

  if (path === "/api/admin/session" && request.method === "GET") {
    const username = await getAdminSession(request, env);
    return username ? jsonResponse({ ok: true, username }) : jsonResponse({ ok: false }, 401);
  }

  if (path === "/api/admin/logout" && request.method === "POST") {
    if (!isTrustedSameOrigin(request, url)) return jsonResponse({ ok: false, error: "طلب غير مسموح" }, 403);
    return jsonResponse({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
  }

  if (path === "/api/admin/login" && request.method === "POST") {
    if (!isTrustedSameOrigin(request, url)) return jsonResponse({ ok: false, error: "طلب غير مسموح" }, 403);
    if (!isJsonRequest(request)) return jsonResponse({ ok: false, error: "نوع المحتوى غير مدعوم" }, 415);
    const address = clientAddress(request);
    const ipRule = { scope: "admin-login-ip", value: address, windowMs: RATE_WINDOW_MS, limit: 8 };
    let failureStage: string = "request_body";
    try {
      const retryAfter = await enforceRateLimits(env, [ipRule]);
      if (retryAfter) return jsonResponse({ ok: false, error: "محاولات دخول كثيرة؛ أعد المحاولة بعد قليل" }, 429, { "Retry-After": String(retryAfter) });
      const body = await readBodyWithinLimit(request, 16 * 1024) as any;
      if (!isPlainObject(body) || typeof body.username !== "string" || typeof body.password !== "string" || body.username.length > 80 || body.password.length > 256) {
        return jsonResponse({ ok: false, error: "بيانات تسجيل الدخول غير صالحة" }, 400);
      }
      const identityRule = { scope: "admin-login-identity", value: `${address}\n${body.username.trim().toLowerCase()}`, windowMs: RATE_WINDOW_MS, limit: 6 };
      const identityRetry = await enforceRateLimits(env, [identityRule]);
      if (identityRetry) return jsonResponse({ ok: false, error: "محاولات دخول كثيرة؛ أعد المحاولة بعد قليل" }, 429, { "Retry-After": String(identityRetry) });
      failureStage = "verify_credentials";
      const ok = await verifyAdmin(env, body.username, body.password, (stage) => { failureStage = stage; });
      if (!ok) {
        console.warn("admin_login_failed", { reason: "invalid_credentials" });
        return jsonResponse({ ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, 401);
      }
      const username = cleanText(body.username, 80);
      failureStage = "create_session";
      const token = await createAdminSession(env, username);
      await clearRateLimits(env, [ipRule, identityRule]);
      return jsonResponse({ ok: true, username }, 200, { "Set-Cookie": sessionCookie(token, ADMIN_SESSION_TTL) });
    } catch (error) {
      if (error instanceof Error && error.message === BODY_TOO_LARGE) return jsonResponse({ ok: false, error: "حجم الطلب كبير" }, 413);
      if (error instanceof SyntaxError) return jsonResponse({ ok: false, error: "بيانات JSON غير صالحة" }, 400);
      const errorType = safeAuthErrorType(error);
      console.error("admin_login_error", { stage: failureStage, errorType });
      return jsonResponse({ ok: false, error: "تعذر التحقق من الدخول أو قاعدة البيانات" }, 503);
    }
  }

  if (path === "/api/site-data" && request.method === "POST") {
    if (!isTrustedSameOrigin(request, url)) return jsonResponse({ ok: false, error: "طلب غير مسموح" }, 403);
    if (!isJsonRequest(request)) return jsonResponse({ ok: false, error: "نوع المحتوى غير مدعوم" }, 415);
    let failureStage = "read_session";
    try {
      const sessionUsername = await getAdminSession(request, env);
      if (!sessionUsername) return jsonResponse({ ok: false, error: "انتهت جلسة الإدارة؛ سجّل الدخول مجدداً" }, 401);
      failureStage = "read_request_body";
      const body = await readBodyWithinLimit(request, 3 * 1024 * 1024) as any;
      if (!isPlainObject(body) || !validateSiteData(body.data)) return jsonResponse({ ok: false, error: "بيانات الموقع غير صالحة" }, 400);
      failureStage = "read_existing_record";
      const existing = (await readRecord(env, "site_data")) || {};
      const submittedAuth = body.data.adminAuth || {};
      const username = cleanText(submittedAuth.username || sessionUsername || existing.adminAuth?.username || "admin", 80);
      if (!username) return jsonResponse({ ok: false, error: "اسم المستخدم مطلوب" }, 400);
      const previousAdminAuth = existing.adminAuth || {};
      const previousUsername = String(previousAdminAuth.username || "admin").trim().toLowerCase();
      const credentialsChanged = username.toLowerCase() !== previousUsername || Boolean(submittedAuth.newPassword);
      const nextAdminAuth = {
        ...previousAdminAuth,
        username,
        sessionVersion: Number(previousAdminAuth.sessionVersion || 0) + (credentialsChanged ? 1 : 0),
      };
      delete nextAdminAuth.password;
      if (submittedAuth.newPassword) {
        failureStage = "derive_new_password_hash";
        const newPassword = String(submittedAuth.newPassword);
        if (newPassword.length < 12 || newPassword.length > 256) return jsonResponse({ ok: false, error: "كلمة المرور الجديدة يجب أن تكون بين 12 و256 حرفاً" }, 400);
        const salt = freshSalt();
        nextAdminAuth.passwordSalt = salt;
        nextAdminAuth.passwordIterations = PASSWORD_HASH_ITERATIONS;
        nextAdminAuth.passwordHash = await hashPassword(newPassword, salt);
      }
      const { adminAuth: _untrustedAuth, ...publicFields } = body.data;
      const payload = { ...existing, ...publicFields, adminAuth: nextAdminAuth, updatedAt: new Date().toISOString() };
      failureStage = "write_record";
      await writeRecord(env, "site_data", payload);
      publicSiteCache = null;
      const { adminAuth: _privateAuth, ...safeData } = payload;
      return jsonResponse({ ok: true, data: safeData, credentialsChanged }, 200, credentialsChanged ? { "Set-Cookie": sessionCookie("", 0) } : {});
    } catch (error) {
      if (error instanceof Error && error.message === BODY_TOO_LARGE) return jsonResponse({ ok: false, error: "حجم الطلب كبير" }, 413);
      if (error instanceof SyntaxError) return jsonResponse({ ok: false, error: "بيانات JSON غير صالحة" }, 400);
      console.error("admin_save_error", { stage: failureStage, errorType: safeAuthErrorType(error) });
      return jsonResponse({ ok: false, error: "فشل الحفظ في قاعدة البيانات؛ لم يتم تأكيد التغييرات" }, 503);
    }
  }

  if (path === "/api/analytics/event") {
    if (request.method !== "POST") return jsonResponse({ ok: false, error: "طريقة غير مدعومة" }, 405);
    if (!isTrustedSameOrigin(request, url)) return jsonResponse({ ok: false, error: "طلب غير مسموح" }, 403);
    if (!isJsonRequest(request)) return jsonResponse({ ok: false, error: "نوع المحتوى غير مدعوم" }, 415);
    let body: any;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > 1024) return jsonResponse({ ok: false, error: "حجم الطلب كبير" }, 413);
      body = JSON.parse(raw);
    } catch { return jsonResponse({ ok: false, error: "بيانات التحليلات غير صالحة" }, 400); }
    if (!body || !["page_view", "heartbeat"].includes(body.event) || !/^[0-9a-f-]{36}$/i.test(String(body.sessionId || ""))) {
      return jsonResponse({ ok: false, error: "حدث التحليلات غير صالح" }, 400);
    }
    try {
      await trackAnalyticsEvent(env, body.event, body.sessionId);
      return jsonResponse({ ok: true });
    } catch {
      return jsonResponse({ ok: false, error: "تعذر تسجيل إحصاءات الزيارة" }, 503);
    }
  }

  if (path === "/api/admin/analytics" && request.method === "GET") {
    if (!await getAdminSession(request, env)) return jsonResponse({ ok: false, error: "غير مصرح" }, 401);
    try {
      return jsonResponse({ ok: true, ...(await readAnalytics(env)) });
    } catch {
      return jsonResponse({ ok: false, error: "تعذر قراءة إحصاءات الموقع" }, 503);
    }
  }

  if (path === "/api/leads" && request.method === "POST") {
    if (!isTrustedSameOrigin(request, url)) return jsonResponse({ ok: false, error: "طلب غير مسموح" }, 403);
    if (!isJsonRequest(request)) return jsonResponse({ ok: false, error: "نوع المحتوى غير مدعوم" }, 415);
    const address = clientAddress(request);
    try {
      const retryAfter = await enforceRateLimits(env, [
        { scope: "lead-ip", value: address, windowMs: RATE_WINDOW_MS, limit: 5 },
        { scope: "lead-ip-day", value: address, windowMs: DAY_WINDOW_MS, limit: 25 },
      ]);
      if (retryAfter) return jsonResponse({ ok: false, error: "تم استلام طلبات كثيرة من هذا الاتصال؛ حاول لاحقاً" }, 429, { "Retry-After": String(retryAfter) });
      const body = await readBodyWithinLimit(request, 16 * 1024) as any;
      if (!isPlainObject(body)) return jsonResponse({ ok: false, error: "بيانات الطلب غير صالحة" }, 400);
      if (typeof body.website === "string" && body.website.trim()) return jsonResponse({ ok: true, saved: false }, 202);
      if ([body.name, body.project, body.location, body.details].some((value) => value !== undefined && typeof value !== "string")) return jsonResponse({ ok: false, error: "بيانات الطلب غير صالحة" }, 400);
      if ((body.name || "").trim().length > 120 || (body.project || "").trim().length > 180 || (body.location || "").trim().length > 180 || (body.details || "").trim().length > 3000) return jsonResponse({ ok: false, error: "تجاوز أحد الحقول الحد المسموح" }, 400);
      const name = String(body.name || "").trim();
      const project = String(body.project || "").trim();
      const location = String(body.location || "").trim();
      const details = String(body.details || "").trim();
      if (name.length < 2 || project.length < 2 || details.length < 10) return jsonResponse({ ok: false, error: "يرجى استكمال بيانات الطلب" }, 400);
      await ensureSchema(env);
      const lead = { id: crypto.randomUUID(), name, project, location, details, createdAt: new Date().toISOString() };
      await env.DB.prepare("INSERT INTO customer_leads (id, name, project, location, details, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(lead.id, name, project, location, details, lead.createdAt).run();
      return jsonResponse({ ok: true, saved: true }, 201);
    } catch (error) {
      if (error instanceof Error && error.message === BODY_TOO_LARGE) return jsonResponse({ ok: false, error: "حجم الطلب كبير" }, 413);
      if (error instanceof SyntaxError) return jsonResponse({ ok: false, error: "بيانات JSON غير صالحة" }, 400);
      return jsonResponse({ ok: false, error: "تعذر حفظ الطلب" }, 503);
    }
  }

  if (path === "/api/admin/leads") {
    if (request.method !== "GET" && request.method !== "DELETE") return jsonResponse({ ok: false, error: "طريقة غير مدعومة" }, 405);
    if (request.method === "DELETE" && !isTrustedSameOrigin(request, url)) return jsonResponse({ ok: false, error: "طلب غير مسموح" }, 403);
    try {
      if (!await getAdminSession(request, env)) return jsonResponse({ ok: false, error: "غير مصرح" }, 401);
      await ensureSchema(env);
      if (request.method === "DELETE") {
        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ ok: false, error: "معرّف الطلب مطلوب" }, 400);
        await env.DB.prepare("DELETE FROM customer_leads WHERE id = ?").bind(id).run();
      }
      const rows = await env.DB.prepare("SELECT id, name, project, location, details, created_at AS createdAt FROM customer_leads ORDER BY created_at DESC LIMIT 200").all();
      return jsonResponse({ ok: true, leads: rows.results || [] });
    } catch {
      return jsonResponse({ ok: false, error: "تعذر الوصول إلى قاعدة البيانات" }, 503);
    }
  }
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (path === "/robots.txt" && request.method === "GET") {
      return new Response("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: https://mathabahksa.com/sitemap.xml\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, max-age=0" },
      });
    }
    if (path.startsWith("/api/")) {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Allow": "GET, POST, DELETE, OPTIONS", "Cache-Control": "no-store" } });
      const response = await handleApi(request, env, url, path);
      if (response) {
        if (path === "/api/admin" || path.startsWith("/api/admin/")) {
          const headers = new Headers(response.headers);
          headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
          return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
        }
        return response;
      }
      if (request.method !== "GET") return jsonResponse({ ok: false, error: "طريقة غير مدعومة" }, 405);
    }

    const response = await env.ASSETS.fetch(request);
    const isAdminPage = path === "/admin" || path.startsWith("/admin/");
    if (isAdminPage && response.headers.get("content-type")?.includes("text/html")) {
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      headers.delete("Content-Length");
      headers.delete("ETag");
      if (typeof HTMLRewriter !== "undefined") {
        const rewritten = new HTMLRewriter().on("head", { element(element: any) {
          element.append('<meta name="robots" content="noindex,nofollow" />', { html: true });
        } }).transform(response);
        return new Response(rewritten.body, { status: rewritten.status, statusText: rewritten.statusText, headers });
      }
      const html = (await response.text()).replace("</head>", '<meta name="robots" content="noindex,nofollow" /></head>');
      return new Response(html, { status: response.status, statusText: response.statusText, headers });
    }
    const metadata: Record<string, { title: string; description: string }> = {
      "/services/glass": {
        title: "أعمال الزجاج والسيكوريت وكبائن الشاور في الرياض والسعودية",
        description: "تنفيذ الواجهات الزجاجية وزجاج السيكوريت، كبائن الشاور، قواطع الدبل جلاس، الدرابزينات وأعمال الاستركشر في الرياض.",
      },
      "/services/interior-decor": {
        title: "تصميم وتنفيذ الديكور الداخلي في الرياض | مؤسسة مثابة",
        description: "حلول الديكور الداخلي والخارجي للمنازل والمكاتب والمساحات التجارية في الرياض، من دراسة الاستخدام واختيار الخامات إلى التنفيذ.",
      },
      "/services/woodwork": {
        title: "أعمال النجارة والديكورات الخشبية في الرياض | مؤسسة مثابة",
        description: "تنفيذ أعمال النجارة والديكورات الخشبية والدواليب والكسوات والأثاث المخصص في الرياض.",
      },
      "/services/aluminum": {
        title: "أعمال الألمنيوم والواجهات الخارجية في الرياض | مؤسسة مثابة",
        description: "حلول الألمنيوم للنوافذ والأبواب والواجهات والتكسيات الخارجية والكلادينج في الرياض.",
      },
    };
    const service = metadata[path];
    if (!service || !response.headers.get("content-type")?.includes("text/html")) return response;
    const canonical = `https://mathabahksa.com${path}`;
    if (typeof HTMLRewriter !== "undefined") {
      const rewriter = new HTMLRewriter()
        .on("title", { element(element: any) { element.setInnerContent(service.title); } })
        .on('meta[name="description"]', { element(element: any) { element.setAttribute("content", service.description); } })
        .on('link[rel="canonical"]', { element(element: any) { element.setAttribute("href", canonical); } })
        .on('meta[property="og:title"]', { element(element: any) { element.setAttribute("content", service.title); } })
        .on('meta[property="og:description"]', { element(element: any) { element.setAttribute("content", service.description); } })
        .on('meta[property="og:url"]', { element(element: any) { element.setAttribute("content", canonical); } })
        .on('meta[name="twitter:title"]', { element(element: any) { element.setAttribute("content", service.title); } })
        .on('meta[name="twitter:description"]', { element(element: any) { element.setAttribute("content", service.description); } });
      const rewritten = rewriter.transform(response);
      const headers = new Headers(rewritten.headers);
      headers.delete("Content-Length");
      headers.delete("ETag");
      return new Response(rewritten.body, { status: rewritten.status, statusText: rewritten.statusText, headers });
    }
    const html = await response.text();
    const updated = html
      .replace(/<title>[^<]*<\/title>/, `<title>${service.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${service.description}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${service.title}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${service.description}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${service.title}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${service.description}" />`);
    const headers = new Headers(response.headers);
    headers.delete("Content-Length");
    headers.delete("ETag");
    return new Response(updated, { status: response.status, statusText: response.statusText, headers });
  },
  async scheduled(_controller: unknown, env: Env): Promise<void> {
    await ensureSchema(env);
    const now = Date.now();
    const liveCutoff = now - 48 * 60 * 60 * 1000;
    const visitorCutoff = riyadhDayKey(new Date(now - 365 * 24 * 60 * 60 * 1000));
    await env.DB.batch([
      env.DB.prepare("DELETE FROM analytics_live_sessions WHERE last_seen_at < ?").bind(liveCutoff),
      env.DB.prepare("DELETE FROM analytics_daily_visitors WHERE day < ?").bind(visitorCutoff),
      env.DB.prepare("DELETE FROM request_rate_limits WHERE window_start < ? AND blocked_until < ?").bind(now - 2 * DAY_WINDOW_MS, now),
    ]);
  },
};

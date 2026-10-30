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

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

let schemaPromise: Promise<void> | null = null;

async function ensureSchema(env: Env): Promise<void> {
  if (!env.DB) throw new Error("D1 binding DB is missing");
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS mathabah_store (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at TEXT NOT NULL)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS customer_leads (id TEXT PRIMARY KEY, name TEXT NOT NULL, project TEXT NOT NULL, location TEXT NOT NULL DEFAULT '', details TEXT NOT NULL, created_at TEXT NOT NULL)").run();
    })().catch((error) => { schemaPromise = null; throw error; });
  }
  await schemaPromise;
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

async function hashPassword(password: string, saltHex: string): Promise<string> {
  const salt = new Uint8Array(saltHex.match(/.{2}/g)?.map((part) => parseInt(part, 16)) || []);
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" }, material, 256);
  return toHex(new Uint8Array(bits));
}

function freshSalt(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

async function verifyAdmin(env: Env, userIn: string, passIn: string): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const stored = await readRecord(env, "site_data");
  const auth = stored?.adminAuth || {};
  const expectedUser = String(auth.username || "admin").trim().toLowerCase();
  const user = String(userIn || "").trim().toLowerCase();
  const password = String(passIn || "");
  if (!user || !password || !constantTimeEqual(user, expectedUser)) return false;
  if (auth.passwordHash && auth.passwordSalt) {
    return constantTimeEqual(await hashPassword(password, auth.passwordSalt), auth.passwordHash);
  }
  return constantTimeEqual(password, env.ADMIN_PASSWORD);
}

function cleanText(value: unknown, max: number): string {
  return String(value || "").trim().slice(0, max);
}

async function handleApi(request: Request, env: Env, url: URL, path: string): Promise<Response | null> {
  if (path === "/api/site-data" && request.method === "GET") {
    try {
      const stored = await readRecord(env, "site_data");
      if (!stored) return jsonResponse({ ok: true, data: null });
      const { adminAuth: _privateAuth, ...publicData } = stored;
      return jsonResponse({ ok: true, data: publicData });
    } catch {
      return jsonResponse({ ok: false, error: "قاعدة البيانات غير متاحة حالياً" }, 503);
    }
  }

  if (path === "/api/admin/login" && request.method === "POST") {
    try {
      const body = await request.json() as any;
      const ok = await verifyAdmin(env, body.username, body.password);
      if (!ok) return jsonResponse({ ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, 401);
      return jsonResponse({ ok: true, username: cleanText(body.username, 80) });
    } catch {
      return jsonResponse({ ok: false, error: "تعذر التحقق من الدخول أو قاعدة البيانات" }, 503);
    }
  }

  if (path === "/api/site-data" && request.method === "POST") {
    try {
      const body = await request.json() as any;
      if (!await verifyAdmin(env, body.username, body.password)) return jsonResponse({ ok: false, error: "غير مصرح لك بالحفظ" }, 401);
      if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return jsonResponse({ ok: false, error: "بيانات الموقع غير صالحة" }, 400);
      const existing = (await readRecord(env, "site_data")) || {};
      const submittedAuth = body.data.adminAuth || {};
      const username = cleanText(submittedAuth.username || body.username || existing.adminAuth?.username || "admin", 80);
      if (!username) return jsonResponse({ ok: false, error: "اسم المستخدم مطلوب" }, 400);
      const nextAdminAuth = { ...(existing.adminAuth || {}), username };
      delete nextAdminAuth.password;
      if (submittedAuth.newPassword) {
        const newPassword = String(submittedAuth.newPassword);
        if (newPassword.length < 12 || newPassword.length > 256) return jsonResponse({ ok: false, error: "كلمة المرور الجديدة يجب أن تكون بين 12 و256 حرفاً" }, 400);
        const salt = freshSalt();
        nextAdminAuth.passwordSalt = salt;
        nextAdminAuth.passwordHash = await hashPassword(newPassword, salt);
      }
      const { adminAuth: _untrustedAuth, ...publicFields } = body.data;
      const payload = { ...existing, ...publicFields, adminAuth: nextAdminAuth, updatedAt: new Date().toISOString() };
      await writeRecord(env, "site_data", payload);
      const { adminAuth: _privateAuth, ...safeData } = payload;
      return jsonResponse({ ok: true, data: safeData });
    } catch {
      return jsonResponse({ ok: false, error: "فشل الحفظ في قاعدة البيانات؛ لم يتم تأكيد التغييرات" }, 503);
    }
  }

  if (path === "/api/leads" && request.method === "POST") {
    try {
      const body = await request.json() as any;
      const name = cleanText(body.name, 120);
      const project = cleanText(body.project, 180);
      const location = cleanText(body.location, 180);
      const details = cleanText(body.details, 3000);
      if (name.length < 2 || project.length < 2 || details.length < 10) return jsonResponse({ ok: false, error: "يرجى استكمال بيانات الطلب" }, 400);
      await ensureSchema(env);
      const lead = { id: crypto.randomUUID(), name, project, location, details, createdAt: new Date().toISOString() };
      await env.DB.prepare("INSERT INTO customer_leads (id, name, project, location, details, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(lead.id, name, project, location, details, lead.createdAt).run();
      return jsonResponse({ ok: true, lead }, 201);
    } catch {
      return jsonResponse({ ok: false, error: "تعذر حفظ الطلب" }, 503);
    }
  }

  if (path === "/api/admin/leads") {
    if (request.method !== "GET" && request.method !== "DELETE") return jsonResponse({ ok: false, error: "طريقة غير مدعومة" }, 405);
    try {
      if (!await verifyAdmin(env, request.headers.get("X-Admin-User") || "", request.headers.get("X-Admin-Password") || "")) return jsonResponse({ ok: false, error: "غير مصرح" }, 401);
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
    if (path.startsWith("/api/")) {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Allow": "GET, POST, DELETE, OPTIONS", "Cache-Control": "no-store" } });
      const response = await handleApi(request, env, url, path);
      if (response) return response;
      if (request.method !== "GET") return jsonResponse({ ok: false, error: "طريقة غير مدعومة" }, 405);
    }

    const response = await env.ASSETS.fetch(request);
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
    const html = await response.text();
    const canonical = `https://mathabahksa.com${path}`;
    const updated = html
      .replace(/<title>[^<]*<\/title>/, `<title>${service.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${service.description}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${service.title}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${service.description}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${service.title}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${service.description}" />`);
    return new Response(updated, { status: response.status, statusText: response.statusText, headers: response.headers });
  },
};

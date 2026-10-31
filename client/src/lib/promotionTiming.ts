export type PromotionTimingInput = {
  enabled?: boolean;
  campaignId?: string;
  startedAt?: string;
  expiresAt?: string;
  durationValue?: number | string;
  durationUnit?: string;
};

export const MAX_BROWSER_TIMEOUT_MS = 2_147_000_000;

export function calculatePromotionWindow(
  promotion: PromotionTimingInput,
  now = Date.now(),
): { startedAt: string; expiresAt: string } | null {
  const unit = promotion.durationUnit === "hours" ? "hours" : "days";
  const duration = Number(promotion.durationValue);
  const maximum = unit === "hours" ? 8760 : 365;
  if (!Number.isInteger(duration) || duration < 1 || duration > maximum) return null;

  const parsedStart = Date.parse(promotion.startedAt || "");
  const start = Number.isFinite(parsedStart) && parsedStart > 0 ? parsedStart : now;
  const expires = start + duration * (unit === "hours" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
  if (!Number.isFinite(expires)) return null;
  return { startedAt: new Date(start).toISOString(), expiresAt: new Date(expires).toISOString() };
}

export function isPromotionActive(promotion: PromotionTimingInput, now = Date.now()): boolean {
  const expiry = Date.parse(promotion.expiresAt || "");
  return promotion.enabled === true && Boolean(String(promotion.campaignId || "").trim()) && Number.isFinite(expiry) && expiry > now;
}

export function promotionDelayMs(value: unknown): number {
  const seconds = Number(value);
  return (Number.isFinite(seconds) ? Math.max(0, Math.min(300, seconds)) : 0) * 1000;
}

export function promotionCooldownMs(value: unknown): number {
  const hours = Number(value);
  return (Number.isFinite(hours) ? Math.max(1, Math.min(720, hours)) : 24) * 60 * 60 * 1000;
}

export function promotionCloseDeadlineMs(expiresAt: string | undefined, visibleSeconds: unknown, openedAt = Date.now()): number {
  const expiry = Date.parse(expiresAt || "");
  if (!Number.isFinite(expiry)) return openedAt;
  const seconds = Number(visibleSeconds);
  const autoCloseAt = Number.isFinite(seconds) && seconds > 0
    ? openedAt + Math.min(300, seconds) * 1000
    : Number.POSITIVE_INFINITY;
  return Math.min(expiry, autoCloseAt);
}

export function promotionCloseDelayMs(expiresAt: string | undefined, visibleSeconds: unknown, now = Date.now()): number {
  return Math.max(0, promotionCloseDeadlineMs(expiresAt, visibleSeconds, now) - now);
}

export function nextPromotionTimerDelay(closeAt: number, now = Date.now()): number {
  return Math.max(0, Math.min(closeAt - now, MAX_BROWSER_TIMEOUT_MS));
}

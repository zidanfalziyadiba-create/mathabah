import { describe, expect, it } from "vitest";
import {
  calculatePromotionWindow,
  isPromotionActive,
  MAX_BROWSER_TIMEOUT_MS,
  nextPromotionTimerDelay,
  promotionCloseDelayMs,
  promotionCooldownMs,
  promotionDelayMs,
} from "./promotionTiming";

const now = Date.UTC(2026, 9, 31, 12, 0, 0);

describe("promotion timing", () => {
  it("sets an hourly offer expiry from activation time", () => {
    const window = calculatePromotionWindow({ durationValue: 1, durationUnit: "hours" }, now);
    expect(window?.startedAt).toBe(new Date(now).toISOString());
    expect(Date.parse(window?.expiresAt || "") - now).toBe(60 * 60 * 1000);
  });

  it("sets a daily offer expiry from its recorded start", () => {
    const startedAt = new Date(now - 2 * 60 * 60 * 1000).toISOString();
    const window = calculatePromotionWindow({ durationValue: 7, durationUnit: "days", startedAt }, now);
    expect(window?.startedAt).toBe(startedAt);
    expect(Date.parse(window?.expiresAt || "") - Date.parse(startedAt)).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("rejects fractional and out-of-range offer durations", () => {
    expect(calculatePromotionWindow({ durationValue: 1.5, durationUnit: "hours" }, now)).toBeNull();
    expect(calculatePromotionWindow({ durationValue: 8761, durationUnit: "hours" }, now)).toBeNull();
    expect(calculatePromotionWindow({ durationValue: 366, durationUnit: "days" }, now)).toBeNull();
  });

  it("considers an enabled offer active only before expiry", () => {
    const offer = { enabled: true, campaignId: "test-offer", expiresAt: new Date(now + 1000).toISOString() };
    expect(isPromotionActive(offer, now)).toBe(true);
    expect(isPromotionActive(offer, now + 1000)).toBe(false);
    expect(isPromotionActive({ ...offer, campaignId: "" }, now)).toBe(false);
  });

  it("maps delay and repeat settings to bounded milliseconds", () => {
    expect(promotionDelayMs(0)).toBe(0);
    expect(promotionDelayMs(3)).toBe(3000);
    expect(promotionDelayMs(900)).toBe(300000);
    expect(promotionCooldownMs(24)).toBe(24 * 60 * 60 * 1000);
    expect(promotionCooldownMs(0)).toBe(60 * 60 * 1000);
  });

  it("closes at the earlier of the display timer and offer expiry", () => {
    const expiry = new Date(now + 30_000).toISOString();
    expect(promotionCloseDelayMs(expiry, 5, now)).toBe(5000);
    expect(promotionCloseDelayMs(expiry, 0, now)).toBe(30_000);
    expect(promotionCloseDelayMs(new Date(now - 1).toISOString(), 0, now)).toBe(0);
    expect(promotionCloseDelayMs("invalid", 5, now)).toBe(0);
  });

  it("chunks long expiry waits below the browser timeout limit", () => {
    const longExpiry = now + 365 * 24 * 60 * 60 * 1000;
    expect(MAX_BROWSER_TIMEOUT_MS).toBeLessThan(2 ** 31 - 1);
    expect(nextPromotionTimerDelay(longExpiry, now)).toBe(MAX_BROWSER_TIMEOUT_MS);
    expect(nextPromotionTimerDelay(longExpiry, now + MAX_BROWSER_TIMEOUT_MS)).toBe(MAX_BROWSER_TIMEOUT_MS);
  });
});

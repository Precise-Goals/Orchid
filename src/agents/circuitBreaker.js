/**
 * Orchid Circuit Breaker
 *
 * Tracks Gemini API quota state for the current browser session.
 * When a DAILY quota is exhausted, all future calls are short-circuited
 * immediately — no retries, no 60-second waits.
 */

const DAILY_QUOTA_SIGNALS = [
  "PerDayPerProjectPerModel",
  "PerDay",
  "daily",
  "limit: 0",
];

const PER_MINUTE_QUOTA_SIGNALS = [
  "PerMinutePerProjectPerModel",
  "PerMinute",
];

let _dailyQuotaExhausted = false;
let _resetAt = null; // estimated reset time

export const circuitBreaker = {
  /** Returns true if the daily quota is known to be exhausted. */
  isOpen() {
    return _dailyQuotaExhausted;
  },

  /**
   * Inspect an error from the Gemini API.
   * Returns: 'daily' | 'minute' | null
   */
  classify(error) {
    const msg = error?.message ?? "";
    if (DAILY_QUOTA_SIGNALS.some((s) => msg.includes(s))) return "daily";
    if (PER_MINUTE_QUOTA_SIGNALS.some((s) => msg.includes(s))) return "minute";
    if (msg.includes("429")) return "minute"; // unknown 429 — treat as transient
    return null;
  },

  /**
   * Record a quota error. Opens the circuit permanently for daily limits.
   * Returns the retry delay in ms for per-minute limits, or 0 if circuit is open.
   */
  record(error) {
    const kind = this.classify(error);

    if (kind === "daily") {
      _dailyQuotaExhausted = true;
      // Estimate midnight PT reset (~UTC-7)
      const reset = new Date();
      reset.setUTCHours(7, 0, 0, 0); // midnight PT = 07:00 UTC
      if (reset < new Date()) reset.setUTCDate(reset.getUTCDate() + 1);
      _resetAt = reset;
      console.warn(
        `[Orchid Circuit Breaker] Daily quota exhausted. Circuit OPEN until ~${reset.toLocaleTimeString()}. Using demo fallback for this session.`
      );
      return 0; // don't retry
    }

    if (kind === "minute") {
      // Parse retry-after from the API message
      const secMatch = error.message?.match(/retry[^\d]*(\d+(?:\.\d+)?)s/i);
      const delaySec = secMatch ? Math.ceil(parseFloat(secMatch[1])) : 15;
      return delaySec * 1000;
    }

    return 0;
  },

  /** Human-readable status for logging. */
  status() {
    if (!_dailyQuotaExhausted) return "CLOSED (API available)";
    return `OPEN — daily quota exhausted${_resetAt ? `, resets ~${_resetAt.toLocaleTimeString()}` : ""}`;
  },
};

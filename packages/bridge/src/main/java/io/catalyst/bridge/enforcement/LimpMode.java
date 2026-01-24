package io.catalyst.bridge.enforcement;

/**
 * Limp mode status levels with Fibonacci-based delays.
 *
 * <p>Delays increase following a Fibonacci-inspired sequence: 3, 8, 21 seconds.
 * This creates noticeable "step changes" that prompt investigation while
 * still allowing the service to function during the grace period.</p>
 *
 * <p>Grace period progression:</p>
 * <ul>
 *   <li>Days 1-30: {@link #STATUS_1} - 3 second delay</li>
 *   <li>Days 31-60: {@link #STATUS_2} - 8 second delay</li>
 *   <li>Days 61-90: {@link #STATUS_3} - 21 second delay</li>
 *   <li>Days 91+: {@link #DISABLED} - service blocked entirely</li>
 * </ul>
 *
 * @see EnforcementEngine
 * @see LimpModeEvaluator
 */
public enum LimpMode {

    /**
     * Normal operation - no enforcement active.
     */
    NONE(0, 0, null),

    /**
     * Days 1-30: Service degraded, 3 second delay per execution.
     */
    STATUS_1(1, 3_000, "SERVICE DEGRADED"),

    /**
     * Days 31-60: Service impaired, 8 second delay per execution.
     */
    STATUS_2(2, 8_000, "SERVICE IMPAIRED"),

    /**
     * Days 61-90: Service critical, 21 second delay per execution.
     */
    STATUS_3(3, 21_000, "SERVICE CRITICAL"),

    /**
     * Days 91+: Service blocked entirely.
     */
    DISABLED(4, -1, "SERVICE UNAVAILABLE");

    private final int level;
    private final long delayMillis;
    private final String headline;

    LimpMode(int level, long delayMillis, String headline) {
        this.level = level;
        this.delayMillis = delayMillis;
        this.headline = headline;
    }

    /**
     * Returns the numeric level (0-4).
     *
     * @return the level number
     */
    public int getLevel() {
        return level;
    }

    /**
     * Returns the delay in milliseconds for this status.
     * Returns -1 for DISABLED (service is blocked, no delay applies).
     *
     * @return the delay in milliseconds
     */
    public long getDelayMillis() {
        return delayMillis;
    }

    /**
     * Returns the headline for log messages (e.g., "SERVICE DEGRADED").
     * Returns null for NONE.
     *
     * @return the headline string or null
     */
    public String getHeadline() {
        return headline;
    }

    /**
     * Returns true if the service is completely blocked.
     *
     * @return true if DISABLED
     */
    public boolean isBlocked() {
        return this == DISABLED;
    }

    /**
     * Returns true if a delay should be applied (STATUS_1, STATUS_2, or STATUS_3).
     *
     * @return true if delay applies
     */
    public boolean isDegraded() {
        return this == STATUS_1 || this == STATUS_2 || this == STATUS_3;
    }

    /**
     * Returns true if any enforcement is active (not NONE).
     *
     * @return true if enforcement is active
     */
    public boolean isEnforced() {
        return this != NONE;
    }

    /**
     * Determines the limp mode status based on days elapsed in the grace period.
     *
     * @param graceDays number of days since the enforcement trigger activated
     * @return the appropriate LimpMode for the grace period day
     */
    public static LimpMode fromGraceDays(int graceDays) {
        if (graceDays <= 0) {
            return NONE;
        } else if (graceDays <= 30) {
            return STATUS_1;
        } else if (graceDays <= 60) {
            return STATUS_2;
        } else if (graceDays <= 90) {
            return STATUS_3;
        } else {
            return DISABLED;
        }
    }
}

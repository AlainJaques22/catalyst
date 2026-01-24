package io.catalyst.bridge.config;

/**
 * Configuration constants for license enforcement thresholds.
 *
 * <p>Provides sensible defaults with ability to override for testing.
 * In production, these values are typically used as-is.</p>
 *
 * <p>Threshold categories:</p>
 * <ul>
 *   <li>License tiers and their execution limits</li>
 *   <li>Grace period day boundaries</li>
 *   <li>Expiry warning thresholds</li>
 *   <li>Run rate warning thresholds</li>
 * </ul>
 *
 * @see io.catalyst.bridge.enforcement.EnforcementEngine
 */
public final class EnforcementConfig {

    // ========== License Tier Limits ==========

    /** Micro tier: 1,200 executions per year */
    public static final int TIER_MICRO_LIMIT = 1_200;

    /** Starter tier: 10,000 executions per year */
    public static final int TIER_STARTER_LIMIT = 10_000;

    /** Professional tier: 50,000 executions per year */
    public static final int TIER_PROFESSIONAL_LIMIT = 50_000;

    /** Enterprise tier: 100,000 executions per year */
    public static final int TIER_ENTERPRISE_LIMIT = 100_000;

    // ========== Grace Period Thresholds ==========

    /** Total grace period duration in days */
    public static final int GRACE_TOTAL_DAYS = 90;

    /** End of STATUS_1 period (days 1-30) */
    public static final int GRACE_STEP_1_DAYS = 30;

    /** End of STATUS_2 period (days 31-60) */
    public static final int GRACE_STEP_2_DAYS = 60;

    /** End of STATUS_3 period (days 61-90) */
    public static final int GRACE_STEP_3_DAYS = 90;

    // ========== Expiry Warning Thresholds ==========

    /** Days before expiry to start weekly warnings */
    public static final int EXPIRY_WARN_WEEKLY_DAYS = 90;

    /** Days before expiry to start daily warnings */
    public static final int EXPIRY_WARN_DAILY_DAYS = 60;

    /** Days before expiry to warn on every execution */
    public static final int EXPIRY_WARN_EVERY_DAYS = 30;

    // ========== Run Rate Warning Thresholds ==========

    /** Percentage over annual pace for weekly warnings (20%) */
    public static final double RUN_RATE_WARN_WEEKLY_PERCENT = 0.20;

    /** Percentage over annual pace for daily warnings (50%) */
    public static final double RUN_RATE_WARN_DAILY_PERCENT = 0.50;

    // ========== Run Rate Calculation ==========

    /** Minimum days of data required for reliable run rate calculation */
    public static final int MIN_DAYS_FOR_RUN_RATE = 7;

    /** Days in a year for rate calculations */
    public static final int DAYS_IN_YEAR = 365;

    // ========== Instance Fields (for testing overrides) ==========

    private final double moderateOverPaceRatio;
    private final double severeOverPaceRatio;
    private final int expiryWarnWeeklyDays;
    private final int expiryWarnDailyDays;
    private final int expiryWarnEveryDays;
    private final int graceStep1Days;
    private final int graceStep2Days;
    private final int graceTotalDays;
    private final int minDaysForRunRate;

    private EnforcementConfig(Builder builder) {
        this.moderateOverPaceRatio = builder.moderateOverPaceRatio;
        this.severeOverPaceRatio = builder.severeOverPaceRatio;
        this.expiryWarnWeeklyDays = builder.expiryWarnWeeklyDays;
        this.expiryWarnDailyDays = builder.expiryWarnDailyDays;
        this.expiryWarnEveryDays = builder.expiryWarnEveryDays;
        this.graceStep1Days = builder.graceStep1Days;
        this.graceStep2Days = builder.graceStep2Days;
        this.graceTotalDays = builder.graceTotalDays;
        this.minDaysForRunRate = builder.minDaysForRunRate;
    }

    /**
     * Returns the default configuration with standard thresholds.
     *
     * @return default EnforcementConfig instance
     */
    public static EnforcementConfig defaults() {
        return builder().build();
    }

    /**
     * Returns a builder for creating custom configuration.
     *
     * @return a new Builder instance
     */
    public static Builder builder() {
        return new Builder();
    }

    // ========== Getters ==========

    public double getModerateOverPaceRatio() {
        return moderateOverPaceRatio;
    }

    public double getSevereOverPaceRatio() {
        return severeOverPaceRatio;
    }

    public int getExpiryWarnWeeklyDays() {
        return expiryWarnWeeklyDays;
    }

    public int getExpiryWarnDailyDays() {
        return expiryWarnDailyDays;
    }

    public int getExpiryWarnEveryDays() {
        return expiryWarnEveryDays;
    }

    public int getGraceStep1Days() {
        return graceStep1Days;
    }

    public int getGraceStep2Days() {
        return graceStep2Days;
    }

    public int getGraceTotalDays() {
        return graceTotalDays;
    }

    public int getMinDaysForRunRate() {
        return minDaysForRunRate;
    }

    /**
     * Builder for creating EnforcementConfig instances with custom values.
     */
    public static class Builder {
        private double moderateOverPaceRatio = 1.0 + RUN_RATE_WARN_WEEKLY_PERCENT;
        private double severeOverPaceRatio = 1.0 + RUN_RATE_WARN_DAILY_PERCENT;
        private int expiryWarnWeeklyDays = EXPIRY_WARN_WEEKLY_DAYS;
        private int expiryWarnDailyDays = EXPIRY_WARN_DAILY_DAYS;
        private int expiryWarnEveryDays = EXPIRY_WARN_EVERY_DAYS;
        private int graceStep1Days = GRACE_STEP_1_DAYS;
        private int graceStep2Days = GRACE_STEP_2_DAYS;
        private int graceTotalDays = GRACE_TOTAL_DAYS;
        private int minDaysForRunRate = MIN_DAYS_FOR_RUN_RATE;

        public Builder moderateOverPaceRatio(double ratio) {
            this.moderateOverPaceRatio = ratio;
            return this;
        }

        public Builder severeOverPaceRatio(double ratio) {
            this.severeOverPaceRatio = ratio;
            return this;
        }

        public Builder expiryWarnWeeklyDays(int days) {
            this.expiryWarnWeeklyDays = days;
            return this;
        }

        public Builder expiryWarnDailyDays(int days) {
            this.expiryWarnDailyDays = days;
            return this;
        }

        public Builder expiryWarnEveryDays(int days) {
            this.expiryWarnEveryDays = days;
            return this;
        }

        public Builder graceStep1Days(int days) {
            this.graceStep1Days = days;
            return this;
        }

        public Builder graceStep2Days(int days) {
            this.graceStep2Days = days;
            return this;
        }

        public Builder graceTotalDays(int days) {
            this.graceTotalDays = days;
            return this;
        }

        public Builder minDaysForRunRate(int days) {
            this.minDaysForRunRate = days;
            return this;
        }

        public EnforcementConfig build() {
            return new EnforcementConfig(this);
        }
    }
}

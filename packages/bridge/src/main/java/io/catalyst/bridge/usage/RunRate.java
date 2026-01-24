package io.catalyst.bridge.usage;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Immutable projection of annual usage based on current execution rate.
 *
 * <p>Uses a "run rate" concept (similar to cricket run rate) to predict
 * whether the user will exceed their annual limit at their current pace.</p>
 *
 * <p>Key calculations:</p>
 * <ul>
 *   <li>{@code allowedRate} = annual limit / 365 (executions per day allowed)</li>
 *   <li>{@code currentRate} = executions used / days elapsed (actual rate)</li>
 *   <li>{@code rateRatio} = currentRate / allowedRate (>1 means over pace)</li>
 *   <li>{@code projectedAnnualTotal} = currentRate * 365 (year-end projection)</li>
 * </ul>
 *
 * <p>Calculations require a minimum of 7 days of data for reliability.
 * If less than 7 days have elapsed, {@link #isSufficientData()} returns false.</p>
 *
 * @see RunRateCalculator
 */
public final class RunRate {

    private final double currentRate;
    private final double allowedRate;
    private final double rateRatio;
    private final int projectedAnnualTotal;
    private final int projectedPercent;
    private final Integer daysUntilLimit;
    private final LocalDate projectedLimitDate;
    private final long daysElapsed;
    private final long daysRemaining;
    private final boolean sufficientData;
    private final int currentUsage;
    private final int annualLimit;

    private RunRate(Builder builder) {
        this.currentRate = builder.currentRate;
        this.allowedRate = builder.allowedRate;
        this.rateRatio = builder.rateRatio;
        this.projectedAnnualTotal = builder.projectedAnnualTotal;
        this.projectedPercent = builder.projectedPercent;
        this.daysUntilLimit = builder.daysUntilLimit;
        this.projectedLimitDate = builder.projectedLimitDate;
        this.daysElapsed = builder.daysElapsed;
        this.daysRemaining = builder.daysRemaining;
        this.sufficientData = builder.sufficientData;
        this.currentUsage = builder.currentUsage;
        this.annualLimit = builder.annualLimit;
    }

    /**
     * Returns the current execution rate (executions per day).
     *
     * @return current rate
     */
    public double getCurrentRate() {
        return currentRate;
    }

    /**
     * Returns the allowed execution rate based on annual limit (limit / 365).
     *
     * @return allowed rate
     */
    public double getAllowedRate() {
        return allowedRate;
    }

    /**
     * Returns the ratio of current rate to allowed rate.
     * Values > 1.0 indicate the user is over pace.
     *
     * @return rate ratio
     */
    public double getRateRatio() {
        return rateRatio;
    }

    /**
     * Returns the projected annual total at current pace.
     *
     * @return projected total
     */
    public int getProjectedAnnualTotal() {
        return projectedAnnualTotal;
    }

    /**
     * Returns the projected total as a percentage of the annual limit.
     *
     * @return projected percentage
     */
    public int getProjectedPercent() {
        return projectedPercent;
    }

    /**
     * Returns the estimated days until the limit is reached.
     * Returns null if the user is not over pace.
     *
     * @return days until limit, or null
     */
    public Integer getDaysUntilLimit() {
        return daysUntilLimit;
    }

    /**
     * Returns the projected date when the limit will be reached.
     * Returns null if the user is not over pace.
     *
     * @return projected limit date, or null
     */
    public LocalDate getProjectedLimitDate() {
        return projectedLimitDate;
    }

    /**
     * Returns the number of days elapsed since the first execution.
     *
     * @return days elapsed
     */
    public long getDaysElapsed() {
        return daysElapsed;
    }

    /**
     * Returns the number of days remaining until license expiry.
     *
     * @return days remaining
     */
    public long getDaysRemaining() {
        return daysRemaining;
    }

    /**
     * Returns true if there is sufficient data (>= 7 days) for reliable projections.
     *
     * @return true if sufficient data
     */
    public boolean isSufficientData() {
        return sufficientData;
    }

    /**
     * Returns the current execution count.
     *
     * @return current usage
     */
    public int getCurrentUsage() {
        return currentUsage;
    }

    /**
     * Returns the annual execution limit.
     *
     * @return annual limit
     */
    public int getAnnualLimit() {
        return annualLimit;
    }

    /**
     * Returns true if the current rate exceeds the allowed rate.
     *
     * @return true if over pace
     */
    public boolean isOverPace() {
        return rateRatio > 1.0;
    }

    /**
     * Returns true if 20-50% over pace (moderate warning threshold).
     *
     * @return true if moderately over pace
     */
    public boolean isModeratelyOverPace() {
        return rateRatio >= 1.2 && rateRatio < 1.5;
    }

    /**
     * Returns true if >= 50% over pace (severe warning threshold).
     *
     * @return true if severely over pace
     */
    public boolean isSeverelyOverPace() {
        return rateRatio >= 1.5;
    }

    /**
     * Returns the percentage over pace (e.g., 27 for 27% over).
     * Returns 0 if not over pace.
     *
     * @return percentage over pace
     */
    public int getOverPacePercent() {
        if (rateRatio <= 1.0) {
            return 0;
        }
        return (int) Math.round((rateRatio - 1.0) * 100);
    }

    /**
     * Returns the number of remaining executions before hitting the limit.
     *
     * @return remaining executions
     */
    public int getRemainingExecutions() {
        return Math.max(0, annualLimit - currentUsage);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RunRate runRate = (RunRate) o;
        return Double.compare(runRate.currentRate, currentRate) == 0 &&
               Double.compare(runRate.allowedRate, allowedRate) == 0 &&
               projectedAnnualTotal == runRate.projectedAnnualTotal &&
               daysElapsed == runRate.daysElapsed &&
               sufficientData == runRate.sufficientData &&
               currentUsage == runRate.currentUsage &&
               annualLimit == runRate.annualLimit;
    }

    @Override
    public int hashCode() {
        return Objects.hash(currentRate, allowedRate, projectedAnnualTotal,
                           daysElapsed, sufficientData, currentUsage, annualLimit);
    }

    @Override
    public String toString() {
        return "RunRate{" +
               "currentRate=" + String.format("%.2f", currentRate) +
               ", allowedRate=" + String.format("%.2f", allowedRate) +
               ", rateRatio=" + String.format("%.2f", rateRatio) +
               ", projectedAnnualTotal=" + projectedAnnualTotal +
               ", projectedPercent=" + projectedPercent + "%" +
               ", currentUsage=" + currentUsage +
               ", annualLimit=" + annualLimit +
               ", sufficientData=" + sufficientData +
               '}';
    }

    /**
     * Creates a new builder for RunRate instances.
     *
     * @return a new Builder
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Builder for creating RunRate instances.
     */
    public static class Builder {
        private double currentRate;
        private double allowedRate;
        private double rateRatio;
        private int projectedAnnualTotal;
        private int projectedPercent;
        private Integer daysUntilLimit;
        private LocalDate projectedLimitDate;
        private long daysElapsed;
        private long daysRemaining;
        private boolean sufficientData;
        private int currentUsage;
        private int annualLimit;

        public Builder currentRate(double currentRate) {
            this.currentRate = currentRate;
            return this;
        }

        public Builder allowedRate(double allowedRate) {
            this.allowedRate = allowedRate;
            return this;
        }

        public Builder rateRatio(double rateRatio) {
            this.rateRatio = rateRatio;
            return this;
        }

        public Builder projectedAnnualTotal(int projectedAnnualTotal) {
            this.projectedAnnualTotal = projectedAnnualTotal;
            return this;
        }

        public Builder projectedPercent(int projectedPercent) {
            this.projectedPercent = projectedPercent;
            return this;
        }

        public Builder daysUntilLimit(Integer daysUntilLimit) {
            this.daysUntilLimit = daysUntilLimit;
            return this;
        }

        public Builder projectedLimitDate(LocalDate projectedLimitDate) {
            this.projectedLimitDate = projectedLimitDate;
            return this;
        }

        public Builder daysElapsed(long daysElapsed) {
            this.daysElapsed = daysElapsed;
            return this;
        }

        public Builder daysRemaining(long daysRemaining) {
            this.daysRemaining = daysRemaining;
            return this;
        }

        public Builder sufficientData(boolean sufficientData) {
            this.sufficientData = sufficientData;
            return this;
        }

        public Builder currentUsage(int currentUsage) {
            this.currentUsage = currentUsage;
            return this;
        }

        public Builder annualLimit(int annualLimit) {
            this.annualLimit = annualLimit;
            return this;
        }

        public RunRate build() {
            return new RunRate(this);
        }
    }
}

package io.catalyst.bridge.usage;

import io.catalyst.bridge.enforcement.EnforcementTrigger;
import io.catalyst.bridge.enforcement.LimpMode;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Persisted usage data for a license.
 *
 * <p>Stored in catalyst-usage.json alongside the JAR. This class is immutable;
 * updates create new instances via the builder or copy methods.</p>
 *
 * <p>Tracked data:</p>
 * <ul>
 *   <li>Execution count for the current year</li>
 *   <li>First and last execution dates</li>
 *   <li>Grace period state (trigger, activation date)</li>
 *   <li>Warning throttle dates (last daily/weekly warning)</li>
 * </ul>
 *
 * @see UsageStore
 * @see FileUsageStore
 */
public final class UsageData {

    /** Current schema version for the usage file */
    public static final int CURRENT_VERSION = 1;

    private final int version;
    private final String licenseKey;
    private final int year;
    private final int count;
    private final LocalDate firstExecution;
    private final LocalDate lastExecution;
    private final LocalDate noLicenseDetected;
    private final LocalDate triggerActivated;
    private final EnforcementTrigger activeTrigger;
    private final LimpMode lastLimpMode;
    private final LocalDate lastDailyWarn;
    private final LocalDate lastWeeklyWarn;

    private UsageData(Builder builder) {
        this.version = builder.version;
        this.licenseKey = builder.licenseKey;
        this.year = builder.year;
        this.count = builder.count;
        this.firstExecution = builder.firstExecution;
        this.lastExecution = builder.lastExecution;
        this.noLicenseDetected = builder.noLicenseDetected;
        this.triggerActivated = builder.triggerActivated;
        this.activeTrigger = builder.activeTrigger;
        this.lastLimpMode = builder.lastLimpMode;
        this.lastDailyWarn = builder.lastDailyWarn;
        this.lastWeeklyWarn = builder.lastWeeklyWarn;
    }

    /**
     * Creates initial usage data for a new license year.
     *
     * @param licenseKey the license key
     * @param year the year
     * @param today the current date
     * @return new UsageData with count of 1
     */
    public static UsageData createInitial(String licenseKey, int year, LocalDate today) {
        return builder()
            .version(CURRENT_VERSION)
            .licenseKey(licenseKey)
            .year(year)
            .count(1)
            .firstExecution(today)
            .lastExecution(today)
            .lastLimpMode(LimpMode.NONE)
            .build();
    }

    /**
     * Creates initial usage data when no license is present.
     *
     * @param year the year
     * @param today the current date
     * @return new UsageData with grace period started
     */
    public static UsageData createNoLicense(int year, LocalDate today) {
        return builder()
            .version(CURRENT_VERSION)
            .year(year)
            .count(1)
            .firstExecution(today)
            .lastExecution(today)
            .noLicenseDetected(today)
            .triggerActivated(today)
            .activeTrigger(EnforcementTrigger.NO_LICENSE)
            .lastLimpMode(LimpMode.STATUS_1)
            .build();
    }

    /**
     * Returns a copy with incremented count and updated last execution date.
     *
     * @param today the current date
     * @return new UsageData with incremented count
     */
    public UsageData withIncrementedCount(LocalDate today) {
        return toBuilder()
            .count(this.count + 1)
            .lastExecution(today)
            .build();
    }

    /**
     * Returns a copy with the grace period started.
     *
     * @param today the current date
     * @param trigger the enforcement trigger
     * @return new UsageData with grace period activated
     */
    public UsageData withGracePeriodStarted(LocalDate today, EnforcementTrigger trigger) {
        Builder builder = toBuilder()
            .triggerActivated(today)
            .activeTrigger(trigger)
            .lastLimpMode(LimpMode.STATUS_1);

        if (trigger == EnforcementTrigger.NO_LICENSE) {
            builder.noLicenseDetected(today);
        }

        return builder.build();
    }

    /**
     * Returns a copy with the grace period cleared (recovery).
     *
     * @return new UsageData with grace period cleared
     */
    public UsageData withGracePeriodCleared() {
        return toBuilder()
            .triggerActivated(null)
            .activeTrigger(null)
            .noLicenseDetected(null)
            .lastLimpMode(LimpMode.NONE)
            .build();
    }

    /**
     * Returns a copy with updated limp mode.
     *
     * @param limpMode the new limp mode
     * @return new UsageData with updated limp mode
     */
    public UsageData withLimpMode(LimpMode limpMode) {
        return toBuilder()
            .lastLimpMode(limpMode)
            .build();
    }

    /**
     * Returns a copy with updated daily warning date.
     *
     * @param date the warning date
     * @return new UsageData with updated date
     */
    public UsageData withDailyWarnDate(LocalDate date) {
        return toBuilder()
            .lastDailyWarn(date)
            .build();
    }

    /**
     * Returns a copy with updated weekly warning date.
     *
     * @param date the warning date
     * @return new UsageData with updated date
     */
    public UsageData withWeeklyWarnDate(LocalDate date) {
        return toBuilder()
            .lastWeeklyWarn(date)
            .build();
    }

    /**
     * Returns true if a grace period is currently active.
     *
     * @return true if in grace period
     */
    public boolean isInGracePeriod() {
        return triggerActivated != null && activeTrigger != null;
    }

    // ========== Getters ==========

    public int getVersion() {
        return version;
    }

    public String getLicenseKey() {
        return licenseKey;
    }

    public int getYear() {
        return year;
    }

    public int getCount() {
        return count;
    }

    public LocalDate getFirstExecution() {
        return firstExecution;
    }

    public LocalDate getLastExecution() {
        return lastExecution;
    }

    public LocalDate getNoLicenseDetected() {
        return noLicenseDetected;
    }

    public LocalDate getTriggerActivated() {
        return triggerActivated;
    }

    public EnforcementTrigger getActiveTrigger() {
        return activeTrigger;
    }

    public LimpMode getLastLimpMode() {
        return lastLimpMode;
    }

    public LocalDate getLastDailyWarn() {
        return lastDailyWarn;
    }

    public LocalDate getLastWeeklyWarn() {
        return lastWeeklyWarn;
    }

    /**
     * Creates a builder initialized with this instance's values.
     *
     * @return a new Builder with current values
     */
    public Builder toBuilder() {
        return new Builder()
            .version(version)
            .licenseKey(licenseKey)
            .year(year)
            .count(count)
            .firstExecution(firstExecution)
            .lastExecution(lastExecution)
            .noLicenseDetected(noLicenseDetected)
            .triggerActivated(triggerActivated)
            .activeTrigger(activeTrigger)
            .lastLimpMode(lastLimpMode)
            .lastDailyWarn(lastDailyWarn)
            .lastWeeklyWarn(lastWeeklyWarn);
    }

    /**
     * Creates a new builder.
     *
     * @return a new Builder
     */
    public static Builder builder() {
        return new Builder();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsageData usageData = (UsageData) o;
        return version == usageData.version &&
               year == usageData.year &&
               count == usageData.count &&
               Objects.equals(licenseKey, usageData.licenseKey) &&
               Objects.equals(firstExecution, usageData.firstExecution) &&
               Objects.equals(lastExecution, usageData.lastExecution) &&
               Objects.equals(triggerActivated, usageData.triggerActivated) &&
               activeTrigger == usageData.activeTrigger &&
               lastLimpMode == usageData.lastLimpMode;
    }

    @Override
    public int hashCode() {
        return Objects.hash(version, licenseKey, year, count, firstExecution,
                           lastExecution, triggerActivated, activeTrigger, lastLimpMode);
    }

    @Override
    public String toString() {
        return "UsageData{" +
               "year=" + year +
               ", count=" + count +
               ", firstExecution=" + firstExecution +
               ", lastExecution=" + lastExecution +
               ", activeTrigger=" + activeTrigger +
               ", lastLimpMode=" + lastLimpMode +
               '}';
    }

    /**
     * Builder for creating UsageData instances.
     */
    public static class Builder {
        private int version = CURRENT_VERSION;
        private String licenseKey;
        private int year;
        private int count;
        private LocalDate firstExecution;
        private LocalDate lastExecution;
        private LocalDate noLicenseDetected;
        private LocalDate triggerActivated;
        private EnforcementTrigger activeTrigger;
        private LimpMode lastLimpMode = LimpMode.NONE;
        private LocalDate lastDailyWarn;
        private LocalDate lastWeeklyWarn;

        public Builder version(int version) {
            this.version = version;
            return this;
        }

        public Builder licenseKey(String licenseKey) {
            this.licenseKey = licenseKey;
            return this;
        }

        public Builder year(int year) {
            this.year = year;
            return this;
        }

        public Builder count(int count) {
            this.count = count;
            return this;
        }

        public Builder firstExecution(LocalDate firstExecution) {
            this.firstExecution = firstExecution;
            return this;
        }

        public Builder lastExecution(LocalDate lastExecution) {
            this.lastExecution = lastExecution;
            return this;
        }

        public Builder noLicenseDetected(LocalDate noLicenseDetected) {
            this.noLicenseDetected = noLicenseDetected;
            return this;
        }

        public Builder triggerActivated(LocalDate triggerActivated) {
            this.triggerActivated = triggerActivated;
            return this;
        }

        public Builder activeTrigger(EnforcementTrigger activeTrigger) {
            this.activeTrigger = activeTrigger;
            return this;
        }

        public Builder lastLimpMode(LimpMode lastLimpMode) {
            this.lastLimpMode = lastLimpMode;
            return this;
        }

        public Builder lastDailyWarn(LocalDate lastDailyWarn) {
            this.lastDailyWarn = lastDailyWarn;
            return this;
        }

        public Builder lastWeeklyWarn(LocalDate lastWeeklyWarn) {
            this.lastWeeklyWarn = lastWeeklyWarn;
            return this;
        }

        public UsageData build() {
            return new UsageData(this);
        }
    }
}

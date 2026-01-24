package io.catalyst.bridge.enforcement;

import io.catalyst.bridge.licensing.License;
import io.catalyst.bridge.usage.RunRate;

/**
 * Complete enforcement state at a point in time.
 *
 * <p>Combines license status, usage data, and calculated enforcement action.
 * This is the main output of {@link EnforcementEngine#enforce()}.</p>
 *
 * <p>Contains:</p>
 * <ul>
 *   <li>Current license (null if no license)</li>
 *   <li>Execution count and run rate projection</li>
 *   <li>Limp mode status and trigger</li>
 *   <li>Grace period information</li>
 *   <li>Pre-grace warning level</li>
 * </ul>
 *
 * @see EnforcementEngine
 * @see LimpMode
 */
public final class EnforcementStatus {

    private final License license;
    private final int executionsUsed;
    private final RunRate runRate;
    private final LimpMode limpMode;
    private final EnforcementTrigger trigger;
    private final int graceDaysElapsed;
    private final int graceDaysRemaining;
    private final boolean stepTransition;
    private final AlertLevel preGraceAlert;

    private EnforcementStatus(Builder builder) {
        this.license = builder.license;
        this.executionsUsed = builder.executionsUsed;
        this.runRate = builder.runRate;
        this.limpMode = builder.limpMode;
        this.trigger = builder.trigger;
        this.graceDaysElapsed = builder.graceDaysElapsed;
        this.graceDaysRemaining = builder.graceDaysRemaining;
        this.stepTransition = builder.stepTransition;
        this.preGraceAlert = builder.preGraceAlert;
    }

    /**
     * Creates a status representing normal operation (no enforcement).
     *
     * @param license the current license
     * @param executionsUsed current execution count
     * @param runRate run rate projection (may be null)
     * @return normal operation status
     */
    public static EnforcementStatus normal(License license, int executionsUsed, RunRate runRate) {
        return builder()
            .license(license)
            .executionsUsed(executionsUsed)
            .runRate(runRate)
            .limpMode(LimpMode.NONE)
            .preGraceAlert(AlertLevel.NONE)
            .build();
    }

    /**
     * Creates a status with a pre-grace warning (license expiring soon or over pace).
     *
     * @param license the current license
     * @param executionsUsed current execution count
     * @param runRate run rate projection
     * @param alertLevel the warning level
     * @return warning status
     */
    public static EnforcementStatus warning(License license, int executionsUsed,
                                            RunRate runRate, AlertLevel alertLevel) {
        return builder()
            .license(license)
            .executionsUsed(executionsUsed)
            .runRate(runRate)
            .limpMode(LimpMode.NONE)
            .preGraceAlert(alertLevel)
            .build();
    }

    /**
     * Creates a status indicating limp mode is active.
     *
     * @param license the current license (may be null)
     * @param executionsUsed current execution count
     * @param limpMode the current limp mode
     * @param trigger the enforcement trigger
     * @param graceDaysElapsed days since trigger activated
     * @param stepTransition true if limp mode just changed
     * @return limp mode status
     */
    public static EnforcementStatus limpMode(License license, int executionsUsed,
                                             LimpMode limpMode, EnforcementTrigger trigger,
                                             int graceDaysElapsed, boolean stepTransition) {
        int remaining = 90 - graceDaysElapsed;
        return builder()
            .license(license)
            .executionsUsed(executionsUsed)
            .limpMode(limpMode)
            .trigger(trigger)
            .graceDaysElapsed(graceDaysElapsed)
            .graceDaysRemaining(remaining)
            .stepTransition(stepTransition)
            .preGraceAlert(AlertLevel.ERROR_EVERY)
            .build();
    }

    /**
     * Creates a status indicating the service is disabled.
     *
     * @param license the current license (may be null)
     * @param executionsUsed current execution count
     * @param trigger the enforcement trigger
     * @return disabled status
     */
    public static EnforcementStatus disabled(License license, int executionsUsed,
                                             EnforcementTrigger trigger) {
        return builder()
            .license(license)
            .executionsUsed(executionsUsed)
            .limpMode(LimpMode.DISABLED)
            .trigger(trigger)
            .graceDaysElapsed(91)
            .graceDaysRemaining(0)
            .preGraceAlert(AlertLevel.ERROR_EVERY)
            .build();
    }

    // ========== State Queries ==========

    /**
     * Returns true if a delay should be applied.
     *
     * @return true if delay required
     */
    public boolean requiresDelay() {
        return limpMode.isDegraded();
    }

    /**
     * Returns the delay in milliseconds, 0 if none.
     *
     * @return delay in milliseconds
     */
    public long getDelayMillis() {
        return limpMode.getDelayMillis();
    }

    /**
     * Returns true if service should be blocked.
     *
     * @return true if blocked
     */
    public boolean isBlocked() {
        return limpMode.isBlocked();
    }

    /**
     * Returns true if any enforcement is active (limp mode or disabled).
     *
     * @return true if enforced
     */
    public boolean isEnforced() {
        return limpMode.isEnforced();
    }

    /**
     * Returns true if this is normal operation with no warnings or enforcement.
     *
     * @return true if normal operation
     */
    public boolean isNormal() {
        return limpMode == LimpMode.NONE && preGraceAlert == AlertLevel.NONE;
    }

    /**
     * Returns true if pre-grace warning should be logged.
     *
     * @return true if warning present
     */
    public boolean hasPreGraceWarning() {
        return preGraceAlert != null && preGraceAlert != AlertLevel.NONE;
    }

    /**
     * Returns true if this is a limp mode step transition (for box message).
     *
     * @return true if step transition
     */
    public boolean isStepTransition() {
        return stepTransition;
    }

    // ========== Getters ==========

    public License getLicense() {
        return license;
    }

    public int getExecutionsUsed() {
        return executionsUsed;
    }

    public RunRate getRunRate() {
        return runRate;
    }

    public LimpMode getLimpMode() {
        return limpMode;
    }

    public EnforcementTrigger getTrigger() {
        return trigger;
    }

    public int getGraceDaysElapsed() {
        return graceDaysElapsed;
    }

    public int getGraceDaysRemaining() {
        return graceDaysRemaining;
    }

    public AlertLevel getPreGraceAlert() {
        return preGraceAlert;
    }

    @Override
    public String toString() {
        return "EnforcementStatus{" +
               "limpMode=" + limpMode +
               ", trigger=" + trigger +
               ", graceDaysElapsed=" + graceDaysElapsed +
               ", graceDaysRemaining=" + graceDaysRemaining +
               ", executionsUsed=" + executionsUsed +
               ", preGraceAlert=" + preGraceAlert +
               '}';
    }

    /**
     * Creates a new builder.
     *
     * @return a new Builder
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Builder for creating EnforcementStatus instances.
     */
    public static class Builder {
        private License license;
        private int executionsUsed;
        private RunRate runRate;
        private LimpMode limpMode = LimpMode.NONE;
        private EnforcementTrigger trigger;
        private int graceDaysElapsed;
        private int graceDaysRemaining;
        private boolean stepTransition;
        private AlertLevel preGraceAlert = AlertLevel.NONE;

        public Builder license(License license) {
            this.license = license;
            return this;
        }

        public Builder executionsUsed(int executionsUsed) {
            this.executionsUsed = executionsUsed;
            return this;
        }

        public Builder runRate(RunRate runRate) {
            this.runRate = runRate;
            return this;
        }

        public Builder limpMode(LimpMode limpMode) {
            this.limpMode = limpMode;
            return this;
        }

        public Builder trigger(EnforcementTrigger trigger) {
            this.trigger = trigger;
            return this;
        }

        public Builder graceDaysElapsed(int graceDaysElapsed) {
            this.graceDaysElapsed = graceDaysElapsed;
            return this;
        }

        public Builder graceDaysRemaining(int graceDaysRemaining) {
            this.graceDaysRemaining = graceDaysRemaining;
            return this;
        }

        public Builder stepTransition(boolean stepTransition) {
            this.stepTransition = stepTransition;
            return this;
        }

        public Builder preGraceAlert(AlertLevel preGraceAlert) {
            this.preGraceAlert = preGraceAlert;
            return this;
        }

        public EnforcementStatus build() {
            return new EnforcementStatus(this);
        }
    }
}

package io.catalyst.bridge.enforcement;

import io.catalyst.bridge.config.EnforcementConfig;
import io.catalyst.bridge.licensing.License;
import io.catalyst.bridge.usage.UsageData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

/**
 * Evaluates limp mode status based on trigger conditions and grace period.
 *
 * <p>All three triggers (NO_LICENSE, EXPIRED, LIMIT_EXCEEDED) follow
 * the same 90-day graduated enforcement:</p>
 * <ul>
 *   <li>Days 1-30: STATUS_1 (3s delay)</li>
 *   <li>Days 31-60: STATUS_2 (8s delay)</li>
 *   <li>Days 61-90: STATUS_3 (21s delay)</li>
 *   <li>Days 91+: DISABLED (blocked)</li>
 * </ul>
 *
 * @see LimpMode
 * @see EnforcementTrigger
 */
public class LimpModeEvaluator {

    private static final Logger LOGGER = LoggerFactory.getLogger(LimpModeEvaluator.class);

    private final EnforcementConfig config;

    /**
     * Creates a LimpModeEvaluator with default configuration.
     */
    public LimpModeEvaluator() {
        this(EnforcementConfig.defaults());
    }

    /**
     * Creates a LimpModeEvaluator with custom configuration.
     *
     * @param config the enforcement configuration
     */
    public LimpModeEvaluator(EnforcementConfig config) {
        this.config = config;
    }

    /**
     * Determines if a trigger condition is currently active.
     *
     * @param licenseExists true if a license file exists
     * @param license the loaded license (null if no license or invalid)
     * @param executionsUsed current execution count
     * @param today the current date
     * @return the active trigger, or empty if no trigger
     */
    public Optional<EnforcementTrigger> evaluateTrigger(
            boolean licenseExists,
            License license,
            int executionsUsed,
            LocalDate today) {

        // Check for no license
        if (!licenseExists || license == null) {
            LOGGER.debug("Trigger evaluation: NO_LICENSE (exists={}, license={})",
                licenseExists, license != null);
            return Optional.of(EnforcementTrigger.NO_LICENSE);
        }

        // Check for expired license
        if (license.isExpired(today)) {
            LOGGER.debug("Trigger evaluation: EXPIRED (expiry={}, today={})",
                license.getExpiryDate(), today);
            return Optional.of(EnforcementTrigger.EXPIRED);
        }

        // Check for limit exceeded
        if (executionsUsed > license.getAnnualLimit()) {
            LOGGER.debug("Trigger evaluation: LIMIT_EXCEEDED (used={}, limit={})",
                executionsUsed, license.getAnnualLimit());
            return Optional.of(EnforcementTrigger.LIMIT_EXCEEDED);
        }

        LOGGER.debug("Trigger evaluation: no trigger active");
        return Optional.empty();
    }

    /**
     * Calculates limp mode status based on grace days elapsed.
     *
     * @param graceDaysElapsed number of days since trigger activated
     * @return the appropriate LimpMode
     */
    public LimpMode evaluateLimpMode(int graceDaysElapsed) {
        return LimpMode.fromGraceDays(graceDaysElapsed);
    }

    /**
     * Calculates days remaining until disabled.
     *
     * @param graceDaysElapsed number of days since trigger activated
     * @return days remaining (0 if already disabled)
     */
    public int calculateGraceDaysRemaining(int graceDaysElapsed) {
        int remaining = config.getGraceTotalDays() - graceDaysElapsed;
        return Math.max(0, remaining);
    }

    /**
     * Calculates the number of days elapsed since the trigger was activated.
     *
     * @param usageData the usage data
     * @param today the current date
     * @return days elapsed, or 0 if no trigger is active
     */
    public int calculateGraceDaysElapsed(UsageData usageData, LocalDate today) {
        if (usageData == null || usageData.getTriggerActivated() == null) {
            return 0;
        }

        long days = ChronoUnit.DAYS.between(usageData.getTriggerActivated(), today);
        // Add 1 because day 1 is the activation day
        return (int) Math.max(1, days + 1);
    }

    /**
     * Determines if a limp mode transition occurred (for logging box messages).
     *
     * @param previousMode the previous limp mode
     * @param currentMode the current limp mode
     * @return true if mode changed
     */
    public boolean isStepTransition(LimpMode previousMode, LimpMode currentMode) {
        if (previousMode == null) {
            return currentMode != LimpMode.NONE;
        }
        return previousMode != currentMode;
    }

    /**
     * Evaluates the complete enforcement status.
     *
     * @param licenseExists true if license file exists
     * @param license the loaded license (may be null)
     * @param usageData the current usage data
     * @param executionsUsed current execution count
     * @return the current enforcement status
     */
    public EnforcementStatus evaluate(
            boolean licenseExists,
            License license,
            UsageData usageData,
            int executionsUsed) {
        return evaluate(licenseExists, license, usageData, executionsUsed, LocalDate.now());
    }

    /**
     * Evaluates the complete enforcement status for a specific date.
     *
     * @param licenseExists true if license file exists
     * @param license the loaded license (may be null)
     * @param usageData the current usage data
     * @param executionsUsed current execution count
     * @param today the current date
     * @return the current enforcement status
     */
    public EnforcementStatus evaluate(
            boolean licenseExists,
            License license,
            UsageData usageData,
            int executionsUsed,
            LocalDate today) {

        // Check if any trigger is active
        Optional<EnforcementTrigger> triggerOpt = evaluateTrigger(
            licenseExists, license, executionsUsed, today);

        if (triggerOpt.isEmpty()) {
            // No trigger - normal operation
            return EnforcementStatus.normal(license, executionsUsed, null);
        }

        EnforcementTrigger trigger = triggerOpt.get();

        // Calculate grace period status
        int graceDaysElapsed = calculateGraceDaysElapsed(usageData, today);

        // If this is a new trigger (not yet in usage data), it's day 1
        if (usageData == null || usageData.getTriggerActivated() == null) {
            graceDaysElapsed = 1;
        }

        // Determine limp mode
        LimpMode limpMode = evaluateLimpMode(graceDaysElapsed);

        // Check for step transition
        LimpMode previousMode = usageData != null ? usageData.getLastLimpMode() : null;
        boolean stepTransition = isStepTransition(previousMode, limpMode);

        LOGGER.debug("Limp mode evaluation: trigger={}, graceDays={}, mode={}, transition={}",
            trigger, graceDaysElapsed, limpMode, stepTransition);

        // Return appropriate status
        if (limpMode.isBlocked()) {
            return EnforcementStatus.disabled(license, executionsUsed, trigger);
        }

        return EnforcementStatus.limpMode(
            license, executionsUsed, limpMode, trigger,
            graceDaysElapsed, stepTransition
        );
    }
}

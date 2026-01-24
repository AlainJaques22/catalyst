package io.catalyst.bridge.logging;

import io.catalyst.bridge.enforcement.AlertLevel;
import io.catalyst.bridge.enforcement.EnforcementStatus;
import io.catalyst.bridge.enforcement.EnforcementTrigger;
import io.catalyst.bridge.enforcement.LimpMode;
import io.catalyst.bridge.licensing.License;
import io.catalyst.bridge.usage.RunRate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Formats and logs all enforcement messages.
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Format multi-line box messages for state transitions</li>
 *   <li>Format single-line messages for per-execution logs</li>
 *   <li>Respect throttling (daily/weekly limits)</li>
 *   <li>Log at correct level (WARN/ERROR)</li>
 * </ul>
 *
 * <p>All log messages use the [CATALYST] prefix for easy filtering.</p>
 *
 * @see LogMessages
 * @see LogThrottler
 */
public class EnforcementLogger {

    private static final Logger LOGGER = LoggerFactory.getLogger(EnforcementLogger.class);

    private final LogThrottler throttler;

    /**
     * Creates an EnforcementLogger with a new LogThrottler.
     */
    public EnforcementLogger() {
        this(new LogThrottler());
    }

    /**
     * Creates an EnforcementLogger with a custom LogThrottler.
     *
     * @param throttler the throttler to use
     */
    public EnforcementLogger(LogThrottler throttler) {
        this.throttler = throttler;
    }

    /**
     * Returns the LogThrottler used by this logger.
     *
     * @return the throttler
     */
    public LogThrottler getThrottler() {
        return throttler;
    }

    // ========== Pre-Grace Warnings ==========

    /**
     * Logs an expiry warning if throttling allows.
     *
     * @param license the license
     * @param daysRemaining days until expiry
     * @param level the alert level
     * @return true if the warning was logged
     */
    public boolean logExpiryWarning(License license, long daysRemaining, AlertLevel level) {
        if (!shouldLog(level)) {
            return false;
        }

        String message = String.format(
            "[CATALYST] License expires in %d days (%s). Visit %s to renew.",
            daysRemaining,
            license.getExpiryDate(),
            "https://catalyst.io/renew"
        );

        if (level == AlertLevel.ERROR_EVERY) {
            LOGGER.error(message);
        } else {
            LOGGER.warn(message);
        }

        recordLog(level);
        return true;
    }

    /**
     * Logs a run rate warning if throttling allows.
     *
     * @param license the license
     * @param runRate the run rate data
     * @param level the alert level
     * @return true if the warning was logged
     */
    public boolean logRunRateWarning(License license, RunRate runRate, AlertLevel level) {
        if (!shouldLog(level)) {
            return false;
        }

        String message;
        if (runRate.getDaysUntilLimit() != null) {
            message = String.format(
                "[CATALYST] Projected annual usage: %,d executions (%d%% of %,d limit). " +
                "At current pace, limit will be exceeded in %d days.",
                runRate.getProjectedAnnualTotal(),
                runRate.getProjectedPercent(),
                runRate.getAnnualLimit(),
                runRate.getDaysUntilLimit()
            );
        } else {
            message = String.format(
                "[CATALYST] Projected annual usage: %,d executions (%d%% of %,d limit).",
                runRate.getProjectedAnnualTotal(),
                runRate.getProjectedPercent(),
                runRate.getAnnualLimit()
            );
        }

        if (level == AlertLevel.ERROR_EVERY) {
            LOGGER.error(message);
        } else {
            LOGGER.warn(message);
        }

        recordLog(level);
        return true;
    }

    // ========== Limp Mode Messages ==========

    /**
     * Logs a limp mode transition (box message).
     *
     * @param status the enforcement status
     */
    public void logLimpModeTransition(EnforcementStatus status) {
        LimpMode mode = status.getLimpMode();
        EnforcementTrigger trigger = status.getTrigger();

        String message = String.format(LogMessages.LIMP_MODE_BOX,
            mode.getHeadline(),
            trigger.getDisplayName(),
            status.getGraceDaysElapsed(),
            mode.getDelayMillis() / 1000,
            status.getGraceDaysRemaining(),
            status.getLicense() != null ? status.getLicense().getMaskedKey() : "none",
            trigger.getActionUrl()
        );

        LOGGER.error(message);
    }

    /**
     * Logs a per-execution limp mode message (single line).
     *
     * @param status the enforcement status
     */
    public void logLimpModePerExecution(EnforcementStatus status) {
        LimpMode mode = status.getLimpMode();
        EnforcementTrigger trigger = status.getTrigger();

        String message = String.format(LogMessages.GRACE_STATUS,
            mode.getHeadline(),
            status.getGraceDaysElapsed(),
            mode.getDelayMillis() / 1000,
            status.getGraceDaysRemaining(),
            trigger.getDisplayName(),
            trigger.getActionUrl()
        );

        LOGGER.warn(message);
    }

    // ========== Disabled Messages ==========

    /**
     * Logs the disabled state (box message).
     *
     * @param status the enforcement status
     */
    public void logDisabled(EnforcementStatus status) {
        EnforcementTrigger trigger = status.getTrigger();

        String message = String.format(LogMessages.DISABLED_BOX,
            trigger.getDisplayName(),
            trigger.getActionUrl()
        );

        LOGGER.error(message);
    }

    // ========== Recovery Messages ==========

    /**
     * Logs recovery from enforcement (box message).
     *
     * @param license the new valid license
     * @param executionsUsed current execution count
     * @param year the current year
     */
    public void logRecovery(License license, int executionsUsed, int year) {
        String message = String.format(LogMessages.RECOVERY_BOX,
            license.getMaskedKey(),
            license.getTier(),
            executionsUsed,
            license.getAnnualLimit(),
            year
        );

        LOGGER.info(message);
    }

    // ========== License Status Messages ==========

    /**
     * Logs that a license was loaded successfully.
     *
     * @param license the loaded license
     */
    public void logLicenseLoaded(License license) {
        LOGGER.info(LogMessages.LICENSE_LOADED,
            license.getMaskedKey(),
            license.getTier(),
            license.getAnnualLimit(),
            license.getExpiryDate()
        );
    }

    /**
     * Logs that no license was found.
     *
     * @param licensePath the expected license path
     */
    public void logNoLicenseFound(String licensePath) {
        LOGGER.warn(LogMessages.NO_LICENSE_FOUND,
            licensePath,
            EnforcementTrigger.NO_LICENSE.getActionUrl()
        );
    }

    // ========== Helper Methods ==========

    private boolean shouldLog(AlertLevel level) {
        switch (level) {
            case NONE:
                return false;
            case WARN_WEEKLY:
                return throttler.shouldLogWeekly();
            case WARN_DAILY:
                return throttler.shouldLogDaily();
            case ERROR_EVERY:
                return true;
            default:
                return false;
        }
    }

    private void recordLog(AlertLevel level) {
        switch (level) {
            case WARN_WEEKLY:
                throttler.recordWeeklyWarning();
                break;
            case WARN_DAILY:
                throttler.recordDailyWarning();
                break;
            default:
                // No recording needed for ERROR_EVERY or NONE
                break;
        }
    }
}

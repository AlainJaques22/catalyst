package io.catalyst.bridge.enforcement;

import io.catalyst.bridge.config.EnforcementConfig;
import io.catalyst.bridge.licensing.License;
import io.catalyst.bridge.usage.RunRate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;

/**
 * Evaluates pre-grace warning conditions.
 *
 * <p>Checks two warning types:</p>
 * <ol>
 *   <li>License expiry warnings (90/60/30 day thresholds)</li>
 *   <li>Run rate warnings (20%/50% over pace thresholds)</li>
 * </ol>
 *
 * <p>Returns the appropriate {@link AlertLevel} for logging frequency.</p>
 *
 * @see AlertLevel
 * @see io.catalyst.bridge.logging.EnforcementLogger
 */
public class PreGraceEvaluator {

    private static final Logger LOGGER = LoggerFactory.getLogger(PreGraceEvaluator.class);

    private final EnforcementConfig config;

    /**
     * Creates a PreGraceEvaluator with default configuration.
     */
    public PreGraceEvaluator() {
        this(EnforcementConfig.defaults());
    }

    /**
     * Creates a PreGraceEvaluator with custom configuration.
     *
     * @param config the enforcement configuration
     */
    public PreGraceEvaluator(EnforcementConfig config) {
        this.config = config;
    }

    /**
     * Evaluates the license expiry warning level.
     *
     * <p>Thresholds (default):</p>
     * <ul>
     *   <li>90+ days remaining: NONE</li>
     *   <li>60-90 days remaining: WARN_WEEKLY</li>
     *   <li>30-60 days remaining: WARN_DAILY</li>
     *   <li>0-30 days remaining: ERROR_EVERY</li>
     * </ul>
     *
     * @param license the license to evaluate
     * @return the appropriate alert level
     */
    public AlertLevel evaluateExpiryWarning(License license) {
        return evaluateExpiryWarning(license, LocalDate.now());
    }

    /**
     * Evaluates the license expiry warning level for a specific date.
     *
     * @param license the license to evaluate
     * @param today the date to evaluate as of
     * @return the appropriate alert level
     */
    public AlertLevel evaluateExpiryWarning(License license, LocalDate today) {
        if (license == null) {
            return AlertLevel.NONE;
        }

        long daysRemaining = license.daysUntilExpiry(today);

        if (daysRemaining <= 0) {
            // Already expired - this will trigger enforcement, not a pre-grace warning
            return AlertLevel.NONE;
        }

        if (daysRemaining <= config.getExpiryWarnEveryDays()) {
            LOGGER.debug("Expiry warning: {} days remaining -> ERROR_EVERY", daysRemaining);
            return AlertLevel.ERROR_EVERY;
        }

        if (daysRemaining <= config.getExpiryWarnDailyDays()) {
            LOGGER.debug("Expiry warning: {} days remaining -> WARN_DAILY", daysRemaining);
            return AlertLevel.WARN_DAILY;
        }

        if (daysRemaining <= config.getExpiryWarnWeeklyDays()) {
            LOGGER.debug("Expiry warning: {} days remaining -> WARN_WEEKLY", daysRemaining);
            return AlertLevel.WARN_WEEKLY;
        }

        return AlertLevel.NONE;
    }

    /**
     * Evaluates the run rate warning level.
     *
     * <p>Thresholds (default):</p>
     * <ul>
     *   <li>At or under pace: NONE</li>
     *   <li>20-50% over pace: WARN_WEEKLY</li>
     *   <li>50%+ over pace: WARN_DAILY</li>
     * </ul>
     *
     * <p>Only evaluates if there is sufficient data (7+ days).</p>
     *
     * @param runRate the run rate to evaluate
     * @return the appropriate alert level
     */
    public AlertLevel evaluateRunRateWarning(RunRate runRate) {
        if (runRate == null || !runRate.isSufficientData()) {
            return AlertLevel.NONE;
        }

        double rateRatio = runRate.getRateRatio();

        if (rateRatio >= config.getSevereOverPaceRatio()) {
            LOGGER.debug("Run rate warning: {}% over pace -> WARN_DAILY",
                runRate.getOverPacePercent());
            return AlertLevel.WARN_DAILY;
        }

        if (rateRatio >= config.getModerateOverPaceRatio()) {
            LOGGER.debug("Run rate warning: {}% over pace -> WARN_WEEKLY",
                runRate.getOverPacePercent());
            return AlertLevel.WARN_WEEKLY;
        }

        return AlertLevel.NONE;
    }

    /**
     * Combines two alert levels, returning the more severe one.
     *
     * @param expiry the expiry alert level
     * @param runRate the run rate alert level
     * @return the combined (more severe) alert level
     */
    public AlertLevel combinedAlertLevel(AlertLevel expiry, AlertLevel runRate) {
        return AlertLevel.mostSevere(expiry, runRate);
    }

    /**
     * Evaluates all pre-grace warnings and returns the combined level.
     *
     * @param license the license
     * @param runRate the run rate (may be null)
     * @return the combined alert level
     */
    public AlertLevel evaluate(License license, RunRate runRate) {
        return evaluate(license, runRate, LocalDate.now());
    }

    /**
     * Evaluates all pre-grace warnings for a specific date.
     *
     * @param license the license
     * @param runRate the run rate (may be null)
     * @param today the date to evaluate as of
     * @return the combined alert level
     */
    public AlertLevel evaluate(License license, RunRate runRate, LocalDate today) {
        AlertLevel expiryLevel = evaluateExpiryWarning(license, today);
        AlertLevel runRateLevel = evaluateRunRateWarning(runRate);
        return combinedAlertLevel(expiryLevel, runRateLevel);
    }
}

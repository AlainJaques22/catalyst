package io.catalyst.bridge.usage;

import io.catalyst.bridge.config.EnforcementConfig;
import io.catalyst.bridge.licensing.License;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Calculates annual usage run rate and projections.
 *
 * <p>Based on the cricket "run rate" concept:</p>
 * <ul>
 *   <li>Allowed rate = annual limit / 365 (executions per day allowed)</li>
 *   <li>Current rate = executions used / days elapsed (actual rate)</li>
 *   <li>Rate ratio = current / allowed (values > 1 mean over pace)</li>
 * </ul>
 *
 * <p>Requires a minimum of 7 days of data for reliable projections.
 * With less data, the projection may be skewed by initial usage spikes.</p>
 *
 * @see RunRate
 */
public class RunRateCalculator {

    private static final Logger LOGGER = LoggerFactory.getLogger(RunRateCalculator.class);

    private final EnforcementConfig config;

    /**
     * Creates a RunRateCalculator with default configuration.
     */
    public RunRateCalculator() {
        this(EnforcementConfig.defaults());
    }

    /**
     * Creates a RunRateCalculator with custom configuration.
     *
     * @param config the enforcement configuration
     */
    public RunRateCalculator(EnforcementConfig config) {
        this.config = config;
    }

    /**
     * Calculates run rate projection based on current usage.
     *
     * @param usageData current usage data
     * @param license current license
     * @return calculated run rate projection
     */
    public RunRate calculate(UsageData usageData, License license) {
        return calculate(usageData, license, LocalDate.now());
    }

    /**
     * Calculates run rate projection for a specific date.
     * Primarily used for testing.
     *
     * @param usageData current usage data
     * @param license current license
     * @param today the date to calculate as of
     * @return calculated run rate projection
     */
    public RunRate calculate(UsageData usageData, License license, LocalDate today) {
        int executionsUsed = usageData.getCount();
        int annualLimit = license.getAnnualLimit();
        LocalDate firstExecution = usageData.getFirstExecution();
        LocalDate expiryDate = license.getExpiryDate();

        // Calculate days elapsed (at least 1 to avoid division by zero)
        long daysElapsed = Math.max(1, ChronoUnit.DAYS.between(firstExecution, today) + 1);

        // Calculate days remaining until license expiry
        long daysRemaining = ChronoUnit.DAYS.between(today, expiryDate);

        // Check if we have sufficient data for reliable projection
        boolean sufficientData = daysElapsed >= config.getMinDaysForRunRate();

        // Calculate rates
        double currentRate = (double) executionsUsed / daysElapsed;
        double allowedRate = (double) annualLimit / EnforcementConfig.DAYS_IN_YEAR;
        double rateRatio = currentRate / allowedRate;

        // Calculate projections
        int projectedAnnualTotal = (int) Math.round(currentRate * EnforcementConfig.DAYS_IN_YEAR);
        int projectedPercent = (int) Math.round((double) projectedAnnualTotal / annualLimit * 100);

        // Calculate days until limit (if over pace)
        Integer daysUntilLimit = null;
        LocalDate projectedLimitDate = null;

        if (rateRatio > 1.0 && currentRate > 0) {
            // At current rate, when will we hit the limit?
            int remainingExecutions = annualLimit - executionsUsed;
            if (remainingExecutions > 0) {
                daysUntilLimit = (int) Math.ceil(remainingExecutions / currentRate);
                projectedLimitDate = today.plusDays(daysUntilLimit);
            } else {
                daysUntilLimit = 0;
                projectedLimitDate = today;
            }
        }

        RunRate runRate = RunRate.builder()
            .currentRate(currentRate)
            .allowedRate(allowedRate)
            .rateRatio(rateRatio)
            .projectedAnnualTotal(projectedAnnualTotal)
            .projectedPercent(projectedPercent)
            .daysUntilLimit(daysUntilLimit)
            .projectedLimitDate(projectedLimitDate)
            .daysElapsed(daysElapsed)
            .daysRemaining(daysRemaining)
            .sufficientData(sufficientData)
            .currentUsage(executionsUsed)
            .annualLimit(annualLimit)
            .build();

        LOGGER.debug("Run rate calculated: ratio={}, projected={}%, sufficient={}",
            String.format("%.2f", rateRatio), projectedPercent, sufficientData);

        return runRate;
    }
}

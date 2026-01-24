package io.catalyst.bridge.logging;

import io.catalyst.bridge.usage.UsageData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Prevents log spam by tracking when warnings were last logged.
 *
 * <p>Supports three frequencies:</p>
 * <ul>
 *   <li>Weekly - for early warnings (at most once per 7 days)</li>
 *   <li>Daily - for moderate warnings (at most once per day)</li>
 *   <li>Every execution - for critical warnings (no throttling)</li>
 * </ul>
 *
 * <p>Thread-safe using synchronized access to last-logged dates.</p>
 *
 * @see EnforcementLogger
 */
public class LogThrottler {

    private static final Logger LOGGER = LoggerFactory.getLogger(LogThrottler.class);

    private final Clock clock;

    // In-memory tracking (also persisted in UsageData)
    private LocalDate lastWeeklyLogDate;
    private LocalDate lastDailyLogDate;

    /**
     * Creates a LogThrottler with the system clock.
     */
    public LogThrottler() {
        this(Clock.systemDefaultZone());
    }

    /**
     * Creates a LogThrottler with a custom clock.
     * Primarily used for testing.
     *
     * @param clock the clock to use for date calculations
     */
    public LogThrottler(Clock clock) {
        this.clock = clock;
    }

    /**
     * Initializes the throttler from persisted usage data.
     *
     * @param usageData the usage data containing last warning dates
     */
    public synchronized void initializeFrom(UsageData usageData) {
        if (usageData != null) {
            this.lastWeeklyLogDate = usageData.getLastWeeklyWarn();
            this.lastDailyLogDate = usageData.getLastDailyWarn();
            LOGGER.debug("LogThrottler initialized: lastWeekly={}, lastDaily={}",
                lastWeeklyLogDate, lastDailyLogDate);
        }
    }

    /**
     * Returns true if a weekly warning should be logged.
     * Weekly warnings are allowed if 7 or more days have passed since the last one.
     *
     * @return true if weekly warning should be logged
     */
    public synchronized boolean shouldLogWeekly() {
        LocalDate today = LocalDate.now(clock);

        if (lastWeeklyLogDate == null) {
            return true;
        }

        long daysSinceLastLog = ChronoUnit.DAYS.between(lastWeeklyLogDate, today);
        return daysSinceLastLog >= 7;
    }

    /**
     * Returns true if a daily warning should be logged.
     * Daily warnings are allowed if at least 1 day has passed since the last one.
     *
     * @return true if daily warning should be logged
     */
    public synchronized boolean shouldLogDaily() {
        LocalDate today = LocalDate.now(clock);

        if (lastDailyLogDate == null) {
            return true;
        }

        return !lastDailyLogDate.equals(today);
    }

    /**
     * Records that a weekly warning was logged.
     *
     * @return the date that was recorded
     */
    public synchronized LocalDate recordWeeklyWarning() {
        lastWeeklyLogDate = LocalDate.now(clock);
        LOGGER.debug("Recorded weekly warning at: {}", lastWeeklyLogDate);
        return lastWeeklyLogDate;
    }

    /**
     * Records that a daily warning was logged.
     *
     * @return the date that was recorded
     */
    public synchronized LocalDate recordDailyWarning() {
        lastDailyLogDate = LocalDate.now(clock);
        LOGGER.debug("Recorded daily warning at: {}", lastDailyLogDate);
        return lastDailyLogDate;
    }

    /**
     * Returns the last weekly warning date.
     *
     * @return the date, or null if never logged
     */
    public synchronized LocalDate getLastWeeklyLogDate() {
        return lastWeeklyLogDate;
    }

    /**
     * Returns the last daily warning date.
     *
     * @return the date, or null if never logged
     */
    public synchronized LocalDate getLastDailyLogDate() {
        return lastDailyLogDate;
    }

    /**
     * Resets the throttler state (for testing or recovery).
     */
    public synchronized void reset() {
        lastWeeklyLogDate = null;
        lastDailyLogDate = null;
        LOGGER.debug("LogThrottler reset");
    }
}

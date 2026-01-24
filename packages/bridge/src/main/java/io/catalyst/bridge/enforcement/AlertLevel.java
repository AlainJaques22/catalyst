package io.catalyst.bridge.enforcement;

/**
 * Alert levels for pre-grace warning messages.
 *
 * <p>Controls logging frequency to prevent log spam while ensuring
 * important warnings are visible:</p>
 * <ul>
 *   <li>{@link #NONE} - No warning required</li>
 *   <li>{@link #WARN_WEEKLY} - Log at most once per week</li>
 *   <li>{@link #WARN_DAILY} - Log at most once per day</li>
 *   <li>{@link #ERROR_EVERY} - Log on every execution</li>
 * </ul>
 *
 * @see PreGraceEvaluator
 * @see EnforcementLogger
 */
public enum AlertLevel {

    /**
     * No warning required - normal operation.
     */
    NONE,

    /**
     * Weekly warning - for early warnings (e.g., license expires in 90 days).
     */
    WARN_WEEKLY,

    /**
     * Daily warning - for moderate warnings (e.g., license expires in 60 days).
     */
    WARN_DAILY,

    /**
     * Every execution warning - for critical warnings (e.g., license expires in 30 days).
     */
    ERROR_EVERY;

    /**
     * Returns true if this alert level is more severe than the other.
     *
     * @param other the alert level to compare against
     * @return true if this level is more severe
     */
    public boolean isMoreSevereThan(AlertLevel other) {
        return this.ordinal() > other.ordinal();
    }

    /**
     * Returns the more severe of two alert levels.
     *
     * @param a first alert level
     * @param b second alert level
     * @return the more severe alert level
     */
    public static AlertLevel mostSevere(AlertLevel a, AlertLevel b) {
        return a.ordinal() >= b.ordinal() ? a : b;
    }
}

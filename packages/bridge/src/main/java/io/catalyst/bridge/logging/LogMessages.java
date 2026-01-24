package io.catalyst.bridge.logging;

/**
 * Message templates for enforcement logging.
 *
 * <p>All messages use the [CATALYST] prefix for easy log filtering.
 * Message placeholders use SLF4J syntax ({}).</p>
 *
 * <p>Box messages use the ━ character for borders to create
 * visually distinct notifications in the log stream.</p>
 *
 * @see EnforcementLogger
 */
public final class LogMessages {

    private LogMessages() {
        // Utility class - prevent instantiation
    }

    /** Prefix for all Catalyst log messages */
    public static final String PREFIX = "[CATALYST]";

    // ========== License Status Messages ==========

    /** No license file found */
    public static final String NO_LICENSE_FOUND =
        PREFIX + " No valid license found at {}. Visit {} to obtain a license.";

    /** License loaded successfully */
    public static final String LICENSE_LOADED =
        PREFIX + " License loaded: {} ({} tier, {} executions/year, expires {})";

    /** License has expired */
    public static final String LICENSE_EXPIRED =
        PREFIX + " License expired on {}. Visit {} to renew.";

    /** License expiring soon - warning */
    public static final String LICENSE_EXPIRING =
        PREFIX + " License expires in {} days ({}). Visit {} to renew.";

    // ========== Usage Messages ==========

    /** Execution count */
    public static final String USAGE_COUNT =
        PREFIX + " Execution {}/{} for year {} ({} remaining)";

    /** Annual limit exceeded */
    public static final String LIMIT_EXCEEDED =
        PREFIX + " Annual limit of {} executions exceeded ({} used). Visit {} to upgrade.";

    /** Run rate warning */
    public static final String RUN_RATE_WARNING =
        PREFIX + " Projected annual usage: {} executions ({}% of {} limit). " +
        "At current pace, limit will be exceeded in {} days.";

    // ========== Grace Period Messages ==========

    /** Grace period status - single line */
    public static final String GRACE_STATUS =
        PREFIX + " {} - Grace period day {}/90. {}s delay applied. " +
        "DISABLED in {} days. Reason: {}. Action: {}";

    /** Grace period exhausted - service blocked */
    public static final String GRACE_EXHAUSTED =
        PREFIX + " SERVICE UNAVAILABLE - Grace period exhausted. " +
        "Catalyst Bridge is disabled. Reason: {}. Action: {}";

    // ========== Box Message Format ==========

    /** Top border for box messages */
    public static final String BOX_TOP =
        "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    /** Bottom border for box messages */
    public static final String BOX_BOTTOM =
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

    /** Box message template for limp mode transitions */
    public static final String LIMP_MODE_BOX =
        BOX_TOP + "\n" +
        PREFIX + " {}\n" +
        PREFIX + " \n" +
        PREFIX + " Reason: {}\n" +
        PREFIX + " Grace Period: Day {}/90\n" +
        PREFIX + " Current Delay: {} seconds per execution\n" +
        PREFIX + " DISABLED MODE in {} days\n" +
        PREFIX + " \n" +
        PREFIX + " License: {}\n" +
        PREFIX + " Action: {}\n" +
        BOX_BOTTOM;

    /** Box message template for disabled state */
    public static final String DISABLED_BOX =
        BOX_TOP + "\n" +
        PREFIX + " SERVICE UNAVAILABLE\n" +
        PREFIX + " \n" +
        PREFIX + " Catalyst Bridge has been disabled.\n" +
        PREFIX + " Reason: {}\n" +
        PREFIX + " Grace period of 90 days has been exhausted.\n" +
        PREFIX + " \n" +
        PREFIX + " To restore service:\n" +
        PREFIX + " {}\n" +
        BOX_BOTTOM;

    /** Box message template for recovery */
    public static final String RECOVERY_BOX =
        BOX_TOP + "\n" +
        PREFIX + " SERVICE RESTORED\n" +
        PREFIX + " \n" +
        PREFIX + " Catalyst Bridge is now operating normally.\n" +
        PREFIX + " License: {} ({} tier)\n" +
        PREFIX + " Executions: {}/{} for {}\n" +
        BOX_BOTTOM;
}

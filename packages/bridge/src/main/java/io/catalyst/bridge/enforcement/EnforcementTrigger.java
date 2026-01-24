package io.catalyst.bridge.enforcement;

/**
 * The three conditions that can trigger license enforcement.
 *
 * <p>All triggers follow the same 90-day graduated enforcement path:
 * <ul>
 *   <li>Days 1-30: STATUS_1 (3 second delay)</li>
 *   <li>Days 31-60: STATUS_2 (8 second delay)</li>
 *   <li>Days 61-90: STATUS_3 (21 second delay)</li>
 *   <li>Days 91+: DISABLED (service blocked)</li>
 * </ul>
 *
 * @see LimpMode
 * @see EnforcementEngine
 */
public enum EnforcementTrigger {

    /**
     * No catalyst.lic file found in the expected location.
     */
    NO_LICENSE("no license", "https://catalyst.io/pricing"),

    /**
     * License has passed its expiry date.
     */
    EXPIRED("license expired", "https://catalyst.io/renew"),

    /**
     * Annual execution count has exceeded the license limit.
     */
    LIMIT_EXCEEDED("limit exceeded", "https://catalyst.io/upgrade");

    private final String displayName;
    private final String actionUrl;

    EnforcementTrigger(String displayName, String actionUrl) {
        this.displayName = displayName;
        this.actionUrl = actionUrl;
    }

    /**
     * Returns a human-readable description of the trigger.
     *
     * @return the display name (e.g., "no license", "license expired")
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Returns the URL where the user can take action to resolve this trigger.
     *
     * @return the action URL (e.g., "https://catalyst.io/pricing")
     */
    public String getActionUrl() {
        return actionUrl;
    }
}

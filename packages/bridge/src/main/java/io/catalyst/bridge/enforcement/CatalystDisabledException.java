package io.catalyst.bridge.enforcement;

/**
 * Exception thrown when the Catalyst Bridge service is disabled.
 *
 * <p>This exception is thrown by {@link EnforcementEngine#enforce()} when
 * the 90-day grace period has been exhausted and the service is blocked.</p>
 *
 * <p>The exception contains the {@link EnforcementTrigger} that caused
 * the service to be disabled, which can be used to provide appropriate
 * user guidance.</p>
 *
 * <p>This is a {@link RuntimeException} because it represents a fatal
 * condition that the caller cannot recover from within the execution.
 * The exception propagates up to Camunda, which handles it as a BPMN error.</p>
 *
 * @see EnforcementEngine
 * @see EnforcementTrigger
 */
public class CatalystDisabledException extends RuntimeException {

    private final EnforcementTrigger trigger;

    /**
     * Creates a new CatalystDisabledException.
     *
     * @param trigger the enforcement trigger that caused the service to be disabled
     */
    public CatalystDisabledException(EnforcementTrigger trigger) {
        super(buildMessage(trigger));
        this.trigger = trigger;
    }

    /**
     * Creates a new CatalystDisabledException with a custom message.
     *
     * @param message custom error message
     * @param trigger the enforcement trigger that caused the service to be disabled
     */
    public CatalystDisabledException(String message, EnforcementTrigger trigger) {
        super(message);
        this.trigger = trigger;
    }

    /**
     * Returns the enforcement trigger that caused the service to be disabled.
     *
     * @return the trigger
     */
    public EnforcementTrigger getTrigger() {
        return trigger;
    }

    /**
     * Returns the URL where the user can take action to restore service.
     *
     * @return the action URL
     */
    public String getActionUrl() {
        return trigger.getActionUrl();
    }

    /**
     * Builds the default exception message based on the trigger.
     */
    private static String buildMessage(EnforcementTrigger trigger) {
        return String.format(
            "Catalyst Bridge is disabled due to %s. " +
            "Grace period of 90 days has been exhausted. " +
            "Visit %s to restore service.",
            trigger.getDisplayName(),
            trigger.getActionUrl()
        );
    }

    @Override
    public String toString() {
        return "CatalystDisabledException{" +
               "trigger=" + trigger +
               ", message='" + getMessage() + '\'' +
               '}';
    }
}

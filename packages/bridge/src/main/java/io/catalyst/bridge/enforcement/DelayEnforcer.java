package io.catalyst.bridge.enforcement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Consumer;

/**
 * Applies Thread.sleep delays for limp mode enforcement.
 *
 * <p>Separated from {@link EnforcementEngine} for testability.
 * Tests can inject a mock sleep function to avoid actual delays.</p>
 *
 * @see EnforcementEngine
 * @see LimpMode
 */
public class DelayEnforcer {

    private static final Logger LOGGER = LoggerFactory.getLogger(DelayEnforcer.class);

    private final Consumer<Long> sleepFunction;

    /**
     * Creates a DelayEnforcer that uses Thread.sleep.
     */
    public DelayEnforcer() {
        this(DelayEnforcer::defaultSleep);
    }

    /**
     * Creates a DelayEnforcer with a custom sleep function.
     * Primarily used for testing.
     *
     * @param sleepFunction function that takes milliseconds and sleeps
     */
    public DelayEnforcer(Consumer<Long> sleepFunction) {
        this.sleepFunction = sleepFunction;
    }

    /**
     * Applies the delay for the given limp mode.
     *
     * @param limpMode the limp mode determining the delay
     * @throws InterruptedException if the thread is interrupted while sleeping
     */
    public void enforceDelay(LimpMode limpMode) throws InterruptedException {
        if (limpMode == null || !limpMode.isDegraded()) {
            return;
        }

        long delayMillis = limpMode.getDelayMillis();
        if (delayMillis <= 0) {
            return;
        }

        LOGGER.debug("Applying enforcement delay: {}ms ({})", delayMillis, limpMode);
        applyDelay(delayMillis);
    }

    /**
     * Applies a specific delay in milliseconds.
     *
     * @param delayMillis the delay in milliseconds
     * @throws InterruptedException if the thread is interrupted while sleeping
     */
    public void applyDelay(long delayMillis) throws InterruptedException {
        if (delayMillis <= 0) {
            return;
        }

        try {
            sleepFunction.accept(delayMillis);
        } catch (RuntimeException e) {
            // Check if the cause is InterruptedException
            if (e.getCause() instanceof InterruptedException) {
                throw (InterruptedException) e.getCause();
            }
            throw e;
        }
    }

    /**
     * Default sleep function using Thread.sleep.
     */
    private static void defaultSleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Delay interrupted", e);
        }
    }
}

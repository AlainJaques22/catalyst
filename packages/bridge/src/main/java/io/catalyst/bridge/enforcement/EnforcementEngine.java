package io.catalyst.bridge.enforcement;

import io.catalyst.bridge.config.EnforcementConfig;
import io.catalyst.bridge.licensing.License;
import io.catalyst.bridge.licensing.LicenseLoader;
import io.catalyst.bridge.logging.EnforcementLogger;
import io.catalyst.bridge.usage.FileUsageStore;
import io.catalyst.bridge.usage.RunRate;
import io.catalyst.bridge.usage.RunRateCalculator;
import io.catalyst.bridge.usage.UsageData;
import io.catalyst.bridge.usage.UsageStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Clock;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Main orchestrator for license enforcement.
 *
 * <p>This is the primary entry point for enforcement logic. It coordinates:</p>
 * <ul>
 *   <li>License loading and validation</li>
 *   <li>Usage tracking and persistence</li>
 *   <li>Run rate calculation</li>
 *   <li>Pre-grace warning evaluation</li>
 *   <li>Limp mode evaluation</li>
 *   <li>Logging</li>
 *   <li>Delay enforcement</li>
 * </ul>
 *
 * <p>Thread-safe. Designed to be instantiated once per JVM as a singleton.</p>
 *
 * <p>Usage:</p>
 * <pre>
 * EnforcementEngine engine = EnforcementEngine.create();
 * engine.enforce(); // Call on every execution
 * </pre>
 *
 * @see EnforcementStatus
 * @see CatalystDisabledException
 */
public class EnforcementEngine {

    private static final Logger LOGGER = LoggerFactory.getLogger(EnforcementEngine.class);

    private final LicenseLoader licenseLoader;
    private final UsageStore usageStore;
    private final RunRateCalculator runRateCalculator;
    private final PreGraceEvaluator preGraceEvaluator;
    private final LimpModeEvaluator limpModeEvaluator;
    private final EnforcementLogger enforcementLogger;
    private final DelayEnforcer delayEnforcer;
    private final Clock clock;

    // Cached license to avoid re-parsing every call
    private volatile License cachedLicense;
    private volatile boolean licenseLoadAttempted;
    private volatile LimpMode lastLimpMode;

    /**
     * Private constructor - use create() methods.
     */
    private EnforcementEngine(
            LicenseLoader licenseLoader,
            UsageStore usageStore,
            RunRateCalculator runRateCalculator,
            PreGraceEvaluator preGraceEvaluator,
            LimpModeEvaluator limpModeEvaluator,
            EnforcementLogger enforcementLogger,
            DelayEnforcer delayEnforcer,
            Clock clock) {
        this.licenseLoader = licenseLoader;
        this.usageStore = usageStore;
        this.runRateCalculator = runRateCalculator;
        this.preGraceEvaluator = preGraceEvaluator;
        this.limpModeEvaluator = limpModeEvaluator;
        this.enforcementLogger = enforcementLogger;
        this.delayEnforcer = delayEnforcer;
        this.clock = clock;
    }

    /**
     * Creates an EnforcementEngine with default configuration.
     *
     * @return new EnforcementEngine instance
     */
    public static EnforcementEngine create() {
        EnforcementConfig config = EnforcementConfig.defaults();
        return create(
            new LicenseLoader(),
            new FileUsageStore(),
            new RunRateCalculator(config),
            new PreGraceEvaluator(config),
            new LimpModeEvaluator(config),
            new EnforcementLogger(),
            new DelayEnforcer(),
            Clock.systemDefaultZone()
        );
    }

    /**
     * Creates an EnforcementEngine with custom dependencies (for testing).
     *
     * @param licenseLoader the license loader
     * @param usageStore the usage store
     * @param runRateCalculator the run rate calculator
     * @param preGraceEvaluator the pre-grace evaluator
     * @param limpModeEvaluator the limp mode evaluator
     * @param enforcementLogger the enforcement logger
     * @param delayEnforcer the delay enforcer
     * @param clock the clock for time operations
     * @return new EnforcementEngine instance
     */
    public static EnforcementEngine create(
            LicenseLoader licenseLoader,
            UsageStore usageStore,
            RunRateCalculator runRateCalculator,
            PreGraceEvaluator preGraceEvaluator,
            LimpModeEvaluator limpModeEvaluator,
            EnforcementLogger enforcementLogger,
            DelayEnforcer delayEnforcer,
            Clock clock) {
        return new EnforcementEngine(
            licenseLoader, usageStore,
            runRateCalculator, preGraceEvaluator, limpModeEvaluator,
            enforcementLogger, delayEnforcer, clock
        );
    }

    /**
     * Evaluates enforcement status and applies any required delays.
     *
     * <p>This method:</p>
     * <ol>
     *   <li>Loads and validates license (cached after first call)</li>
     *   <li>Increments usage counter</li>
     *   <li>Calculates run rate projection</li>
     *   <li>Evaluates pre-grace warnings</li>
     *   <li>Evaluates limp mode status</li>
     *   <li>Logs appropriate messages</li>
     *   <li>Applies delay if in limp mode</li>
     *   <li>Throws if disabled</li>
     * </ol>
     *
     * @return the current enforcement status
     * @throws CatalystDisabledException if service is blocked
     */
    public EnforcementStatus enforce() throws CatalystDisabledException {
        LocalDate today = LocalDate.now(clock);

        // Step 1: Load license (cached)
        License license = loadLicense();

        // Step 2: Increment usage and get updated data
        UsageData usageData = usageStore.incrementAndGet(license, clock);

        // Initialize throttler from persisted data
        enforcementLogger.getThrottler().initializeFrom(usageData);

        // Step 3: Evaluate enforcement status
        boolean licenseExists = licenseLoader.licenseFileExists();
        EnforcementStatus status = limpModeEvaluator.evaluate(
            licenseExists, license, usageData, usageData.getCount(), today);

        // Step 4: Handle enforcement based on status
        if (status.isBlocked()) {
            handleDisabled(status, usageData);
            // This throws - we don't reach the code below
        }

        if (status.isEnforced()) {
            handleLimpMode(status, usageData);
        } else {
            handleNormalOperation(license, usageData, today);
        }

        return status;
    }

    /**
     * Handles the disabled state - logs and throws exception.
     */
    private void handleDisabled(EnforcementStatus status, UsageData usageData)
            throws CatalystDisabledException {
        // Update usage data with disabled state
        UsageData updated = usageData.withLimpMode(LimpMode.DISABLED);
        usageStore.save(updated);

        // Log the disabled message
        enforcementLogger.logDisabled(status);

        // Throw exception to block execution
        throw new CatalystDisabledException(status.getTrigger());
    }

    /**
     * Handles limp mode - logs, updates state, and applies delay.
     */
    private void handleLimpMode(EnforcementStatus status, UsageData usageData) {
        LimpMode currentMode = status.getLimpMode();

        // Check for step transition
        if (status.isStepTransition()) {
            enforcementLogger.logLimpModeTransition(status);
        } else {
            enforcementLogger.logLimpModePerExecution(status);
        }

        // Update usage data if mode changed
        if (lastLimpMode != currentMode) {
            UsageData updated = usageData.withLimpMode(currentMode);

            // Also update trigger activation if this is new
            if (usageData.getTriggerActivated() == null && status.getTrigger() != null) {
                updated = updated.withGracePeriodStarted(
                    LocalDate.now(clock), status.getTrigger());
            }

            usageStore.save(updated);
            lastLimpMode = currentMode;
        }

        // Apply delay
        if (status.requiresDelay()) {
            try {
                delayEnforcer.enforceDelay(currentMode);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                LOGGER.warn("Enforcement delay was interrupted");
            }
        }
    }

    /**
     * Handles normal operation - check for pre-grace warnings.
     */
    private void handleNormalOperation(License license, UsageData usageData, LocalDate today) {
        if (license == null) {
            return;
        }

        // Calculate run rate
        RunRate runRate = null;
        if (usageData.getFirstExecution() != null) {
            runRate = runRateCalculator.calculate(usageData, license, today);
        }

        // Check for pre-grace warnings
        AlertLevel alertLevel = preGraceEvaluator.evaluate(license, runRate, today);

        if (alertLevel != AlertLevel.NONE) {
            // Determine what type of warning to log
            AlertLevel expiryLevel = preGraceEvaluator.evaluateExpiryWarning(license, today);
            AlertLevel runRateLevel = preGraceEvaluator.evaluateRunRateWarning(runRate);

            boolean logged = false;

            if (expiryLevel != AlertLevel.NONE) {
                logged = enforcementLogger.logExpiryWarning(
                    license, license.daysUntilExpiry(today), expiryLevel);
            }

            if (runRateLevel != AlertLevel.NONE && runRate != null) {
                boolean runRateLogged = enforcementLogger.logRunRateWarning(
                    license, runRate, runRateLevel);
                logged = logged || runRateLogged;
            }

            // Update throttle dates if we logged
            if (logged) {
                UsageData updated = usageData;
                if (alertLevel == AlertLevel.WARN_WEEKLY) {
                    updated = updated.withWeeklyWarnDate(
                        enforcementLogger.getThrottler().getLastWeeklyLogDate());
                } else if (alertLevel == AlertLevel.WARN_DAILY) {
                    updated = updated.withDailyWarnDate(
                        enforcementLogger.getThrottler().getLastDailyLogDate());
                }
                if (updated != usageData) {
                    usageStore.save(updated);
                }
            }
        }

        // Clear any previous limp mode state if we recovered
        if (lastLimpMode != null && lastLimpMode != LimpMode.NONE) {
            LOGGER.info("Recovered from limp mode");
            enforcementLogger.logRecovery(license, usageData.getCount(), usageData.getYear());
            UsageData cleared = usageData.withGracePeriodCleared();
            usageStore.save(cleared);
            lastLimpMode = LimpMode.NONE;
        }
    }

    /**
     * Loads the license, using cached value if available.
     */
    private License loadLicense() {
        if (!licenseLoadAttempted) {
            synchronized (this) {
                if (!licenseLoadAttempted) {
                    Optional<License> licenseOpt = licenseLoader.load();
                    if (licenseOpt.isPresent()) {
                        cachedLicense = licenseOpt.get();
                        enforcementLogger.logLicenseLoaded(cachedLicense);
                    } else {
                        enforcementLogger.logNoLicenseFound(
                            licenseLoader.getLicenseFilePath().toString());
                    }
                    licenseLoadAttempted = true;
                }
            }
        }
        return cachedLicense;
    }

    /**
     * Forces a license reload on the next enforce() call.
     * Useful if the license file may have been updated.
     */
    public void invalidateLicenseCache() {
        synchronized (this) {
            licenseLoadAttempted = false;
            cachedLicense = null;
        }
    }

    /**
     * Returns the cached license, or null if not loaded.
     *
     * @return the cached license
     */
    public License getCachedLicense() {
        return cachedLicense;
    }
}

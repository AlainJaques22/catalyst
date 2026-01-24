package io.catalyst.bridge.usage;

import io.catalyst.bridge.licensing.License;

import java.time.Clock;
import java.util.Optional;

/**
 * Persistence interface for usage tracking data.
 *
 * <p>Implementations must be thread-safe and survive JVM restarts.
 * The primary implementation is {@link FileUsageStore} which persists
 * data to a JSON file.</p>
 *
 * <p>Key operations:</p>
 * <ul>
 *   <li>{@link #load()} - Load existing usage data</li>
 *   <li>{@link #save(UsageData)} - Persist usage data</li>
 *   <li>{@link #incrementAndGet(License, Clock)} - Atomic increment and save</li>
 * </ul>
 *
 * @see FileUsageStore
 * @see UsageData
 */
public interface UsageStore {

    /**
     * Loads the current usage data.
     *
     * @return current usage data, or empty if no data exists
     */
    Optional<UsageData> load();

    /**
     * Saves updated usage data atomically.
     *
     * @param data the usage data to persist
     */
    void save(UsageData data);

    /**
     * Increments the execution count and returns updated data.
     *
     * <p>This is the primary method called on each execution. It:</p>
     * <ol>
     *   <li>Loads existing data (or creates new if none exists)</li>
     *   <li>Handles year rollover if needed</li>
     *   <li>Increments the execution count</li>
     *   <li>Persists the updated data</li>
     *   <li>Returns the new state</li>
     * </ol>
     *
     * <p>This method is thread-safe and atomic.</p>
     *
     * @param license current license (null if no license)
     * @param clock clock for timestamps
     * @return updated usage data with incremented count
     */
    UsageData incrementAndGet(License license, Clock clock);
}

/**
 * Usage tracking and run rate calculation for Catalyst Bridge.
 *
 * <p>This package tracks execution counts and projects annual usage:</p>
 * <ul>
 *   <li>{@link io.catalyst.bridge.usage.UsageData} - Persisted usage data model</li>
 *   <li>{@link io.catalyst.bridge.usage.UsageStore} - Persistence interface</li>
 *   <li>{@link io.catalyst.bridge.usage.FileUsageStore} - JSON file-based implementation</li>
 *   <li>{@link io.catalyst.bridge.usage.RunRate} - Run rate projection model</li>
 *   <li>{@link io.catalyst.bridge.usage.RunRateCalculator} - Calculates usage projections</li>
 * </ul>
 *
 * <p>Usage data is persisted in catalyst-usage.json and includes:</p>
 * <ul>
 *   <li>Execution count for the current year</li>
 *   <li>First and last execution dates</li>
 *   <li>Grace period state (trigger, activation date)</li>
 *   <li>Warning throttle dates</li>
 * </ul>
 *
 * <p>Run rate calculation uses a cricket-style "run rate" concept to predict
 * whether annual limits will be exceeded at the current execution pace.</p>
 *
 * @see io.catalyst.bridge.enforcement.EnforcementEngine
 */
package io.catalyst.bridge.usage;

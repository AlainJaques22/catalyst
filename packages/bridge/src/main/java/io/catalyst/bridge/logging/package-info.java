/**
 * Enforcement logging and message formatting for Catalyst Bridge.
 *
 * <p>This package handles all enforcement-related logging:</p>
 * <ul>
 *   <li>{@link io.catalyst.bridge.logging.EnforcementLogger} - Formats and logs enforcement messages</li>
 *   <li>{@link io.catalyst.bridge.logging.LogThrottler} - Prevents log spam with daily/weekly limits</li>
 *   <li>{@link io.catalyst.bridge.logging.LogMessages} - Message templates and constants</li>
 * </ul>
 *
 * <p>All log messages use the [CATALYST] prefix for easy filtering in log aggregators.</p>
 *
 * <p>Message types:</p>
 * <ul>
 *   <li>Pre-grace warnings (expiry, run rate) - throttled daily/weekly</li>
 *   <li>Limp mode status - per-execution or box messages on transitions</li>
 *   <li>Disabled state - box message with action URL</li>
 *   <li>Recovery - box message when service is restored</li>
 * </ul>
 *
 * <p>Box messages use the ━ character for visual prominence in log streams.</p>
 *
 * @see io.catalyst.bridge.enforcement.EnforcementEngine
 */
package io.catalyst.bridge.logging;

/**
 * Configuration classes for Catalyst Bridge license enforcement.
 *
 * <p>This package contains configuration constants and path resolution utilities:</p>
 * <ul>
 *   <li>{@link io.catalyst.bridge.config.EnforcementConfig} - Enforcement thresholds and constants</li>
 *   <li>{@link io.catalyst.bridge.config.CatalystPaths} - File path resolution for license and usage files</li>
 * </ul>
 *
 * <p>Key configuration areas:</p>
 * <ul>
 *   <li>License tier limits (micro, starter, professional, enterprise)</li>
 *   <li>Grace period thresholds (30/60/90 day boundaries)</li>
 *   <li>Warning thresholds for expiry and run rate</li>
 *   <li>File locations (catalyst.lic, catalyst-usage.json)</li>
 * </ul>
 *
 * @see io.catalyst.bridge.enforcement.EnforcementEngine
 */
package io.catalyst.bridge.config;

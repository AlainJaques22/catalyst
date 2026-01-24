/**
 * Core license enforcement logic for Catalyst Bridge.
 *
 * <p>This package contains the main enforcement orchestrator and supporting components:</p>
 * <ul>
 *   <li>{@link io.catalyst.bridge.enforcement.EnforcementEngine} - Main orchestrator (entry point)</li>
 *   <li>{@link io.catalyst.bridge.enforcement.EnforcementStatus} - Current enforcement state</li>
 *   <li>{@link io.catalyst.bridge.enforcement.EnforcementTrigger} - Trigger conditions (NO_LICENSE, EXPIRED, LIMIT_EXCEEDED)</li>
 *   <li>{@link io.catalyst.bridge.enforcement.LimpMode} - Graduated enforcement levels with delays</li>
 *   <li>{@link io.catalyst.bridge.enforcement.AlertLevel} - Pre-grace warning levels</li>
 *   <li>{@link io.catalyst.bridge.enforcement.PreGraceEvaluator} - Evaluates expiry and run rate warnings</li>
 *   <li>{@link io.catalyst.bridge.enforcement.LimpModeEvaluator} - Evaluates grace period status</li>
 *   <li>{@link io.catalyst.bridge.enforcement.DelayEnforcer} - Applies Thread.sleep delays</li>
 *   <li>{@link io.catalyst.bridge.enforcement.CatalystDisabledException} - Thrown when service is blocked</li>
 * </ul>
 *
 * <p>Enforcement follows a 90-day graduated grace period:</p>
 * <ul>
 *   <li>Days 1-30: STATUS_1 - 3 second delay per execution</li>
 *   <li>Days 31-60: STATUS_2 - 8 second delay per execution</li>
 *   <li>Days 61-90: STATUS_3 - 21 second delay per execution</li>
 *   <li>Day 91+: DISABLED - Service blocked entirely</li>
 * </ul>
 *
 * <p>Triggers that start the grace period:</p>
 * <ul>
 *   <li>NO_LICENSE - No catalyst.lic file found</li>
 *   <li>EXPIRED - License has passed its expiry date</li>
 *   <li>LIMIT_EXCEEDED - Annual execution count exceeded</li>
 * </ul>
 *
 * @see io.catalyst.bridge.CatalystBridge
 */
package io.catalyst.bridge.enforcement;

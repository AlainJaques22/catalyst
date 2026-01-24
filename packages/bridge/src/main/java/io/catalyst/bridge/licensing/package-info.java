/**
 * License loading and validation for Catalyst Bridge.
 *
 * <p>This package handles reading license files and validating license keys:</p>
 * <ul>
 *   <li>{@link io.catalyst.bridge.licensing.License} - Immutable license data model</li>
 *   <li>{@link io.catalyst.bridge.licensing.LicenseLoader} - Loads catalyst.lic from filesystem</li>
 *   <li>{@link io.catalyst.bridge.licensing.LicenseValidator} - Parses and validates license keys</li>
 *   <li>{@link io.catalyst.bridge.licensing.InvalidLicenseException} - Thrown on validation failure</li>
 * </ul>
 *
 * <p>License key format:</p>
 * <pre>
 * CAT{version}.{base64-payload}.{signature}
 * Example: CAT1.eyJ0aWVyIjoic3RhcnRlciIsLi4ufQ==.SIGNATURE
 * </pre>
 *
 * <p>License tiers:</p>
 * <ul>
 *   <li>micro - 1,200 executions/year</li>
 *   <li>starter - 10,000 executions/year</li>
 *   <li>professional - 50,000 executions/year</li>
 *   <li>enterprise - 100,000 executions/year</li>
 * </ul>
 *
 * @see io.catalyst.bridge.enforcement.EnforcementEngine
 */
package io.catalyst.bridge.licensing;

package io.catalyst.bridge.licensing;

/**
 * Exception thrown when license validation fails.
 *
 * <p>This exception is thrown by {@link LicenseValidator} when:</p>
 * <ul>
 *   <li>The license key format is invalid</li>
 *   <li>The license key signature verification fails</li>
 *   <li>The license payload cannot be decoded</li>
 *   <li>Required license fields are missing</li>
 * </ul>
 *
 * <p>The {@link #getReason()} method provides a machine-readable reason
 * that can be used for logging or user feedback.</p>
 *
 * @see LicenseValidator
 */
public class InvalidLicenseException extends Exception {

    private final String reason;

    /**
     * Creates a new InvalidLicenseException.
     *
     * @param message human-readable error message
     * @param reason machine-readable reason code
     */
    public InvalidLicenseException(String message, String reason) {
        super(message);
        this.reason = reason;
    }

    /**
     * Creates a new InvalidLicenseException with a cause.
     *
     * @param message human-readable error message
     * @param reason machine-readable reason code
     * @param cause the underlying cause
     */
    public InvalidLicenseException(String message, String reason, Throwable cause) {
        super(message, cause);
        this.reason = reason;
    }

    /**
     * Returns the machine-readable reason for the validation failure.
     *
     * <p>Common reason codes:</p>
     * <ul>
     *   <li>{@code MALFORMED_KEY} - Key doesn't match expected format</li>
     *   <li>{@code INVALID_VERSION} - Unknown key version</li>
     *   <li>{@code DECODE_FAILED} - Base64 decoding failed</li>
     *   <li>{@code INVALID_PAYLOAD} - JSON payload is invalid</li>
     *   <li>{@code MISSING_FIELD} - Required field missing from payload</li>
     *   <li>{@code SIGNATURE_INVALID} - Signature verification failed</li>
     * </ul>
     *
     * @return the reason code
     */
    public String getReason() {
        return reason;
    }

    @Override
    public String toString() {
        return "InvalidLicenseException{" +
               "reason='" + reason + '\'' +
               ", message='" + getMessage() + '\'' +
               '}';
    }
}

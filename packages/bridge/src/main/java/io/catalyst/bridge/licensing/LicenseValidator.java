package io.catalyst.bridge.licensing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Validates and decodes signed license keys.
 *
 * <p>License key structure: {@code CAT{version}.{base64-payload}.{signature}}</p>
 *
 * <p>The payload is JSON containing tier, limit, customer, and dates.
 * The signature verification is currently a placeholder - it always accepts
 * valid format keys. Real signature verification will be added later.</p>
 *
 * <p>Validation is entirely offline - no network calls required.</p>
 *
 * <p>Example key format:</p>
 * <pre>
 * CAT1.eyJ0aWVyIjoic3RhcnRlciIsImFubnVhbExpbWl0IjoxMDAwMCwuLi59.SIGNATURE
 * </pre>
 *
 * @see License
 * @see LicenseLoader
 */
public class LicenseValidator {

    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseValidator.class);

    /** Pattern for license key format: CAT{version}.{payload}.{signature} */
    private static final Pattern KEY_PATTERN =
        Pattern.compile("^CAT(\\d+)\\.([A-Za-z0-9+/=]+)\\.([A-Za-z0-9+/=_-]+)$");

    /** Supported key versions */
    private static final int[] SUPPORTED_VERSIONS = {1, 2};

    private final ObjectMapper objectMapper;

    /**
     * Creates a new LicenseValidator with default ObjectMapper.
     */
    public LicenseValidator() {
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Creates a new LicenseValidator with custom ObjectMapper.
     * Primarily used for testing.
     *
     * @param objectMapper the ObjectMapper to use
     */
    public LicenseValidator(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Validates a license key and returns the decoded license.
     *
     * @param licenseKey the full license key string
     * @return validated License object
     * @throws InvalidLicenseException if key is malformed or signature invalid
     */
    public License validate(String licenseKey) throws InvalidLicenseException {
        if (licenseKey == null || licenseKey.trim().isEmpty()) {
            throw new InvalidLicenseException("License key is empty", "EMPTY_KEY");
        }

        String trimmedKey = licenseKey.trim();
        LOGGER.debug("Validating license key: {}...", trimmedKey.substring(0, Math.min(20, trimmedKey.length())));

        // Parse the key format
        Matcher matcher = KEY_PATTERN.matcher(trimmedKey);
        if (!matcher.matches()) {
            throw new InvalidLicenseException(
                "License key format is invalid. Expected: CAT{version}.{payload}.{signature}",
                "MALFORMED_KEY"
            );
        }

        // Extract parts
        int version = Integer.parseInt(matcher.group(1));
        String payload = matcher.group(2);
        String signature = matcher.group(3);

        // Validate version
        if (!isVersionSupported(version)) {
            throw new InvalidLicenseException(
                "License key version " + version + " is not supported",
                "INVALID_VERSION"
            );
        }

        // Decode payload
        String decodedPayload;
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(payload);
            decodedPayload = new String(decodedBytes);
        } catch (IllegalArgumentException e) {
            throw new InvalidLicenseException(
                "License key payload could not be decoded",
                "DECODE_FAILED",
                e
            );
        }

        // Verify signature (placeholder - always returns true for now)
        if (!verifySignature(payload, signature, version)) {
            throw new InvalidLicenseException(
                "License key signature is invalid",
                "SIGNATURE_INVALID"
            );
        }

        // Parse payload JSON
        License license = parsePayload(trimmedKey, version, decodedPayload);
        LOGGER.info("License validated successfully: {} ({} tier, {} limit)",
            license.getCustomer(), license.getTier(), license.getAnnualLimit());

        return license;
    }

    /**
     * Parses the JSON payload and creates a License object.
     */
    private License parsePayload(String key, int version, String jsonPayload)
            throws InvalidLicenseException {
        try {
            JsonNode root = objectMapper.readTree(jsonPayload);

            // Extract required fields
            String tier = getRequiredString(root, "tier");
            int annualLimit = getRequiredInt(root, "annualLimit");
            String customer = getRequiredString(root, "customer");
            LocalDate startDate = getRequiredDate(root, "startDate");
            LocalDate expiryDate = getRequiredDate(root, "expiryDate");

            // Validate tier
            if (!isValidTier(tier)) {
                throw new InvalidLicenseException(
                    "Unknown license tier: " + tier,
                    "INVALID_TIER"
                );
            }

            return License.builder()
                .key(key)
                .keyVersion(version)
                .tier(tier.toLowerCase())
                .annualLimit(annualLimit)
                .customer(customer)
                .startDate(startDate)
                .expiryDate(expiryDate)
                .build();

        } catch (InvalidLicenseException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidLicenseException(
                "License payload is invalid: " + e.getMessage(),
                "INVALID_PAYLOAD",
                e
            );
        }
    }

    /**
     * Verifies the license key signature.
     *
     * <p><strong>PLACEHOLDER IMPLEMENTATION:</strong> This method currently
     * always returns true. Real cryptographic signature verification
     * will be implemented in a future version.</p>
     *
     * @param payload the Base64 payload
     * @param signature the signature to verify
     * @param version the key version (determines which public key to use)
     * @return true if signature is valid
     */
    boolean verifySignature(String payload, String signature, int version) {
        // TODO: Implement real signature verification
        // For now, accept any signature that matches the expected format
        LOGGER.debug("Signature verification (placeholder): accepting signature for version {}", version);
        return signature != null && !signature.isEmpty();
    }

    /**
     * Checks if the given version is supported.
     */
    private boolean isVersionSupported(int version) {
        for (int supported : SUPPORTED_VERSIONS) {
            if (supported == version) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validates the tier name.
     */
    private boolean isValidTier(String tier) {
        if (tier == null) return false;
        String lower = tier.toLowerCase();
        return lower.equals("micro") ||
               lower.equals("starter") ||
               lower.equals("professional") ||
               lower.equals("enterprise");
    }

    /**
     * Extracts a required string field from JSON.
     */
    private String getRequiredString(JsonNode root, String field) throws InvalidLicenseException {
        JsonNode node = root.get(field);
        if (node == null || node.isNull()) {
            throw new InvalidLicenseException(
                "Required field '" + field + "' is missing",
                "MISSING_FIELD"
            );
        }
        return node.asText();
    }

    /**
     * Extracts a required integer field from JSON.
     */
    private int getRequiredInt(JsonNode root, String field) throws InvalidLicenseException {
        JsonNode node = root.get(field);
        if (node == null || node.isNull()) {
            throw new InvalidLicenseException(
                "Required field '" + field + "' is missing",
                "MISSING_FIELD"
            );
        }
        if (!node.isNumber()) {
            throw new InvalidLicenseException(
                "Field '" + field + "' must be a number",
                "INVALID_FIELD"
            );
        }
        return node.asInt();
    }

    /**
     * Extracts a required date field from JSON.
     */
    private LocalDate getRequiredDate(JsonNode root, String field) throws InvalidLicenseException {
        String dateStr = getRequiredString(root, field);
        try {
            return LocalDate.parse(dateStr);
        } catch (DateTimeParseException e) {
            throw new InvalidLicenseException(
                "Field '" + field + "' is not a valid date (expected YYYY-MM-DD)",
                "INVALID_DATE",
                e
            );
        }
    }
}

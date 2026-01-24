package io.catalyst.bridge.licensing;

import org.junit.Before;
import org.junit.Test;

import java.time.LocalDate;
import java.util.Base64;

import static org.junit.Assert.*;

/**
 * Unit tests for LicenseValidator.
 */
public class LicenseValidatorTest {

    private LicenseValidator validator;

    @Before
    public void setUp() {
        validator = new LicenseValidator();
    }

    @Test
    public void testValidLicense_StarterTier() throws InvalidLicenseException {
        String payload = createPayload("starter", 10000, "Acme Corp", "2024-01-01", "2025-12-31");
        String licenseKey = "CAT1." + payload + ".VALID_SIGNATURE";

        License license = validator.validate(licenseKey);

        assertEquals("starter", license.getTier());
        assertEquals(10000, license.getAnnualLimit());
        assertEquals("Acme Corp", license.getCustomer());
        assertEquals(LocalDate.of(2024, 1, 1), license.getStartDate());
        assertEquals(LocalDate.of(2025, 12, 31), license.getExpiryDate());
        assertEquals(1, license.getKeyVersion());
    }

    @Test
    public void testValidLicense_MicroTier() throws InvalidLicenseException {
        String payload = createPayload("micro", 1200, "Small Co", "2024-06-01", "2025-06-01");
        String licenseKey = "CAT1." + payload + ".SIG";

        License license = validator.validate(licenseKey);

        assertEquals("micro", license.getTier());
        assertEquals(1200, license.getAnnualLimit());
    }

    @Test
    public void testValidLicense_ProfessionalTier() throws InvalidLicenseException {
        String payload = createPayload("professional", 50000, "Medium Inc", "2024-01-01", "2024-12-31");
        String licenseKey = "CAT2." + payload + ".SIGNATURE";

        License license = validator.validate(licenseKey);

        assertEquals("professional", license.getTier());
        assertEquals(50000, license.getAnnualLimit());
        assertEquals(2, license.getKeyVersion());
    }

    @Test
    public void testValidLicense_EnterpriseTier() throws InvalidLicenseException {
        String payload = createPayload("enterprise", 100000, "Big Corp", "2024-01-01", "2026-01-01");
        String licenseKey = "CAT1." + payload + ".SIG123";

        License license = validator.validate(licenseKey);

        assertEquals("enterprise", license.getTier());
        assertEquals(100000, license.getAnnualLimit());
    }

    @Test(expected = InvalidLicenseException.class)
    public void testInvalidLicense_EmptyKey() throws InvalidLicenseException {
        validator.validate("");
    }

    @Test(expected = InvalidLicenseException.class)
    public void testInvalidLicense_NullKey() throws InvalidLicenseException {
        validator.validate(null);
    }

    @Test
    public void testInvalidLicense_MalformedKey() {
        try {
            validator.validate("not-a-valid-key");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("MALFORMED_KEY", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_WrongPrefix() {
        try {
            validator.validate("ABC1.payload.signature");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("MALFORMED_KEY", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_UnsupportedVersion() {
        String payload = createPayload("starter", 10000, "Test", "2024-01-01", "2025-01-01");
        try {
            validator.validate("CAT99." + payload + ".SIG");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("INVALID_VERSION", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_InvalidBase64() {
        // The regex pattern requires valid Base64 characters, so invalid chars fail pattern match first
        try {
            validator.validate("CAT1.not-valid-base64!!!.SIG");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            // Invalid base64 chars (!) cause pattern match to fail
            assertEquals("MALFORMED_KEY", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_InvalidJson() {
        String invalidPayload = Base64.getEncoder().encodeToString("not json".getBytes());
        try {
            validator.validate("CAT1." + invalidPayload + ".SIG");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("INVALID_PAYLOAD", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_MissingField() {
        String incompleteJson = "{\"tier\":\"starter\"}";
        String payload = Base64.getEncoder().encodeToString(incompleteJson.getBytes());
        try {
            validator.validate("CAT1." + payload + ".SIG");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("MISSING_FIELD", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_InvalidTier() {
        String payload = createPayload("unknown", 5000, "Test", "2024-01-01", "2025-01-01");
        try {
            validator.validate("CAT1." + payload + ".SIG");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("INVALID_TIER", e.getReason());
        }
    }

    @Test
    public void testInvalidLicense_InvalidDate() {
        String json = String.format(
            "{\"tier\":\"starter\",\"annualLimit\":10000,\"customer\":\"Test\",\"startDate\":\"not-a-date\",\"expiryDate\":\"2025-01-01\"}"
        );
        String payload = Base64.getEncoder().encodeToString(json.getBytes());
        try {
            validator.validate("CAT1." + payload + ".SIG");
            fail("Expected InvalidLicenseException");
        } catch (InvalidLicenseException e) {
            assertEquals("INVALID_DATE", e.getReason());
        }
    }

    @Test
    public void testLicense_TierCaseInsensitive() throws InvalidLicenseException {
        String payload = createPayload("STARTER", 10000, "Test", "2024-01-01", "2025-01-01");
        String licenseKey = "CAT1." + payload + ".SIG";

        License license = validator.validate(licenseKey);

        assertEquals("starter", license.getTier());
    }

    /**
     * Creates a Base64-encoded JSON payload for testing.
     */
    private String createPayload(String tier, int limit, String customer, String startDate, String expiryDate) {
        String json = String.format(
            "{\"tier\":\"%s\",\"annualLimit\":%d,\"customer\":\"%s\",\"startDate\":\"%s\",\"expiryDate\":\"%s\"}",
            tier, limit, customer, startDate, expiryDate
        );
        return Base64.getEncoder().encodeToString(json.getBytes());
    }
}

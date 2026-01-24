package io.catalyst.bridge.licensing;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

/**
 * Immutable representation of a validated Catalyst license.
 *
 * <p>Contains all license terms extracted from a signed license key.
 * Once created, a License instance cannot be modified.</p>
 *
 * <p>License fields:</p>
 * <ul>
 *   <li>{@code key} - The full original license key string</li>
 *   <li>{@code keyVersion} - Version number (1 or 2) for key rotation support</li>
 *   <li>{@code tier} - License tier name (micro, starter, professional, enterprise)</li>
 *   <li>{@code annualLimit} - Maximum executions allowed per year</li>
 *   <li>{@code customer} - Customer identifier/name</li>
 *   <li>{@code startDate} - License validity start date</li>
 *   <li>{@code expiryDate} - License validity end date</li>
 * </ul>
 *
 * @see LicenseValidator
 * @see LicenseLoader
 */
public final class License {

    private final String key;
    private final int keyVersion;
    private final String tier;
    private final int annualLimit;
    private final String customer;
    private final LocalDate startDate;
    private final LocalDate expiryDate;

    /**
     * Creates a new License instance.
     *
     * @param key the full original license key
     * @param keyVersion the key version (1 or 2)
     * @param tier the license tier name
     * @param annualLimit the annual execution limit
     * @param customer the customer identifier
     * @param startDate the license start date
     * @param expiryDate the license expiry date
     */
    public License(String key, int keyVersion, String tier, int annualLimit,
                   String customer, LocalDate startDate, LocalDate expiryDate) {
        this.key = Objects.requireNonNull(key, "key must not be null");
        this.keyVersion = keyVersion;
        this.tier = Objects.requireNonNull(tier, "tier must not be null");
        this.annualLimit = annualLimit;
        this.customer = Objects.requireNonNull(customer, "customer must not be null");
        this.startDate = Objects.requireNonNull(startDate, "startDate must not be null");
        this.expiryDate = Objects.requireNonNull(expiryDate, "expiryDate must not be null");
    }

    /**
     * Returns the full original license key.
     *
     * @return the license key string
     */
    public String getKey() {
        return key;
    }

    /**
     * Returns the key version number (1 or 2).
     *
     * @return the key version
     */
    public int getKeyVersion() {
        return keyVersion;
    }

    /**
     * Returns the license tier name.
     *
     * @return the tier (micro, starter, professional, or enterprise)
     */
    public String getTier() {
        return tier;
    }

    /**
     * Returns the annual execution limit.
     *
     * @return the maximum executions allowed per year
     */
    public int getAnnualLimit() {
        return annualLimit;
    }

    /**
     * Returns the customer identifier.
     *
     * @return the customer name/identifier
     */
    public String getCustomer() {
        return customer;
    }

    /**
     * Returns the license start date.
     *
     * @return the start date
     */
    public LocalDate getStartDate() {
        return startDate;
    }

    /**
     * Returns the license expiry date.
     *
     * @return the expiry date
     */
    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    /**
     * Returns true if the license has expired as of today.
     *
     * @return true if expired
     */
    public boolean isExpired() {
        return isExpired(LocalDate.now());
    }

    /**
     * Returns true if the license has expired as of the given date.
     *
     * @param asOf the date to check against
     * @return true if expired
     */
    public boolean isExpired(LocalDate asOf) {
        return asOf.isAfter(expiryDate);
    }

    /**
     * Returns the number of days until expiry from today.
     * Returns a negative number if already expired.
     *
     * @return days until expiry (negative if expired)
     */
    public long daysUntilExpiry() {
        return daysUntilExpiry(LocalDate.now());
    }

    /**
     * Returns the number of days until expiry from the given date.
     * Returns a negative number if already expired.
     *
     * @param asOf the date to calculate from
     * @return days until expiry (negative if expired)
     */
    public long daysUntilExpiry(LocalDate asOf) {
        return ChronoUnit.DAYS.between(asOf, expiryDate);
    }

    /**
     * Returns a masked version of the key for logging.
     * Shows the prefix and first few characters, hiding the rest.
     *
     * <p>Example: "CAT1.eyJ0aWVy...****"</p>
     *
     * @return the masked key
     */
    public String getMaskedKey() {
        if (key.length() <= 20) {
            return key.substring(0, Math.min(10, key.length())) + "****";
        }
        return key.substring(0, 15) + "...****";
    }

    /**
     * Returns a display name for the license.
     *
     * <p>Example: "ACME-STARTER-****"</p>
     *
     * @return the display name
     */
    public String getDisplayName() {
        String custPart = customer.toUpperCase().replace(" ", "-");
        if (custPart.length() > 10) {
            custPart = custPart.substring(0, 10);
        }
        return custPart + "-" + tier.toUpperCase() + "-****";
    }

    /**
     * Returns a formatted tier display name.
     *
     * <p>Example: "Starter (10,000 executions/year)"</p>
     *
     * @return the formatted tier name
     */
    public String getTierDisplayName() {
        String tierName = tier.substring(0, 1).toUpperCase() + tier.substring(1).toLowerCase();
        return String.format("%s (%,d executions/year)", tierName, annualLimit);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        License license = (License) o;
        return keyVersion == license.keyVersion &&
               annualLimit == license.annualLimit &&
               Objects.equals(key, license.key) &&
               Objects.equals(tier, license.tier) &&
               Objects.equals(customer, license.customer) &&
               Objects.equals(startDate, license.startDate) &&
               Objects.equals(expiryDate, license.expiryDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key, keyVersion, tier, annualLimit, customer, startDate, expiryDate);
    }

    @Override
    public String toString() {
        return "License{" +
               "tier='" + tier + '\'' +
               ", annualLimit=" + annualLimit +
               ", customer='" + customer + '\'' +
               ", startDate=" + startDate +
               ", expiryDate=" + expiryDate +
               ", keyVersion=" + keyVersion +
               '}';
    }

    /**
     * Creates a builder for constructing License instances.
     *
     * @return a new Builder
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Builder for creating License instances.
     */
    public static class Builder {
        private String key;
        private int keyVersion = 1;
        private String tier;
        private int annualLimit;
        private String customer;
        private LocalDate startDate;
        private LocalDate expiryDate;

        public Builder key(String key) {
            this.key = key;
            return this;
        }

        public Builder keyVersion(int keyVersion) {
            this.keyVersion = keyVersion;
            return this;
        }

        public Builder tier(String tier) {
            this.tier = tier;
            return this;
        }

        public Builder annualLimit(int annualLimit) {
            this.annualLimit = annualLimit;
            return this;
        }

        public Builder customer(String customer) {
            this.customer = customer;
            return this;
        }

        public Builder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public Builder expiryDate(LocalDate expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public License build() {
            return new License(key, keyVersion, tier, annualLimit, customer, startDate, expiryDate);
        }
    }
}

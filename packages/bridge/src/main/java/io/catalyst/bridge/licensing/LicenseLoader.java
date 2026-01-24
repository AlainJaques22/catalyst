package io.catalyst.bridge.licensing;

import io.catalyst.bridge.config.CatalystPaths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

/**
 * Loads the license file from the filesystem.
 *
 * <p>Looks for catalyst.lic in the same directory as the JAR file.
 * The file may contain comments (lines starting with #) and blank lines,
 * which are ignored. The license key should be on a single line.</p>
 *
 * <p>License file format:</p>
 * <pre>
 * # Comments start with hash
 * # Blank lines are ignored
 * CAT1.eyJ0aWVy...base64...SIGNATURE
 * </pre>
 *
 * @see LicenseValidator
 * @see CatalystPaths
 */
public class LicenseLoader {

    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseLoader.class);

    private final CatalystPaths paths;
    private final LicenseValidator validator;

    /**
     * Creates a LicenseLoader with default paths and validator.
     */
    public LicenseLoader() {
        this(new CatalystPaths(), new LicenseValidator());
    }

    /**
     * Creates a LicenseLoader with custom paths and validator.
     * Primarily used for testing.
     *
     * @param paths the path resolver
     * @param validator the license validator
     */
    public LicenseLoader(CatalystPaths paths, LicenseValidator validator) {
        this.paths = paths;
        this.validator = validator;
    }

    /**
     * Attempts to load and validate the license file.
     *
     * @return the validated License, or empty if file not found or invalid
     */
    public Optional<License> load() {
        Path licensePath = paths.getLicenseFilePath();

        if (!licenseFileExists()) {
            LOGGER.warn("License file not found at: {}", licensePath);
            return Optional.empty();
        }

        try {
            String licenseKey = extractLicenseKey(licensePath);

            if (licenseKey == null || licenseKey.isEmpty()) {
                LOGGER.warn("License file is empty or contains no valid key: {}", licensePath);
                return Optional.empty();
            }

            License license = validator.validate(licenseKey);
            return Optional.of(license);

        } catch (IOException e) {
            LOGGER.error("Failed to read license file: {}", e.getMessage());
            return Optional.empty();
        } catch (InvalidLicenseException e) {
            LOGGER.error("Invalid license: {} ({})", e.getMessage(), e.getReason());
            return Optional.empty();
        }
    }

    /**
     * Checks if the license file exists.
     *
     * @return true if the file exists
     */
    public boolean licenseFileExists() {
        Path licensePath = paths.getLicenseFilePath();
        boolean exists = Files.exists(licensePath) && Files.isRegularFile(licensePath);
        LOGGER.debug("License file exists check: {} -> {}", licensePath, exists);
        return exists;
    }

    /**
     * Returns the path where the license file is expected.
     *
     * @return the license file path
     */
    public Path getLicenseFilePath() {
        return paths.getLicenseFilePath();
    }

    /**
     * Extracts the license key from the file, ignoring comments and blank lines.
     *
     * @param file the license file path
     * @return the license key string, or null if no key found
     * @throws IOException if file cannot be read
     */
    String extractLicenseKey(Path file) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(file)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();

                // Skip empty lines
                if (trimmed.isEmpty()) {
                    continue;
                }

                // Skip comment lines
                if (trimmed.startsWith("#")) {
                    continue;
                }

                // Found the license key line
                if (trimmed.startsWith("CAT")) {
                    LOGGER.debug("Found license key starting with: {}...",
                        trimmed.substring(0, Math.min(20, trimmed.length())));
                    return trimmed;
                }

                // Non-comment, non-empty line that doesn't start with CAT - unexpected
                LOGGER.warn("Unexpected content in license file: {}...",
                    trimmed.substring(0, Math.min(30, trimmed.length())));
            }
        }

        return null;
    }
}

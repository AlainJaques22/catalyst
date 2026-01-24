package io.catalyst.bridge.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Resolves file paths for Catalyst license and usage files.
 *
 * <p>All files are located in the same directory as the Catalyst Bridge JAR:</p>
 * <ul>
 *   <li>{@code catalyst.lic} - License file</li>
 *   <li>{@code catalyst-usage.json} - Usage tracking data</li>
 * </ul>
 *
 * <p>In a typical Camunda deployment, the JAR is placed in {@code camunda/lib/},
 * so the license file should be at {@code camunda/lib/catalyst.lic}.</p>
 *
 * @see io.catalyst.bridge.licensing.LicenseLoader
 * @see io.catalyst.bridge.usage.FileUsageStore
 */
public class CatalystPaths {

    private static final Logger LOGGER = LoggerFactory.getLogger(CatalystPaths.class);

    /** Name of the license file */
    public static final String LICENSE_FILE_NAME = "catalyst.lic";

    /** Name of the usage tracking file */
    public static final String USAGE_FILE_NAME = "catalyst-usage.json";

    private final Path libDirectory;

    /**
     * Creates a CatalystPaths instance that resolves paths relative to the JAR location.
     */
    public CatalystPaths() {
        this.libDirectory = resolveLibDirectory();
        LOGGER.debug("Catalyst lib directory resolved to: {}", libDirectory);
    }

    /**
     * Creates a CatalystPaths instance with a custom lib directory.
     * Primarily used for testing.
     *
     * @param libDirectory the directory containing catalyst files
     */
    public CatalystPaths(Path libDirectory) {
        this.libDirectory = libDirectory;
        LOGGER.debug("Catalyst lib directory set to: {}", libDirectory);
    }

    /**
     * Returns the directory containing the Catalyst Bridge JAR.
     *
     * @return the lib directory path
     */
    public Path getLibDirectory() {
        return libDirectory;
    }

    /**
     * Returns the path to the license file (catalyst.lic).
     *
     * @return the license file path
     */
    public Path getLicenseFilePath() {
        return libDirectory.resolve(LICENSE_FILE_NAME);
    }

    /**
     * Returns the path to the usage tracking file (catalyst-usage.json).
     *
     * @return the usage file path
     */
    public Path getUsageFilePath() {
        return libDirectory.resolve(USAGE_FILE_NAME);
    }

    /**
     * Resolves the lib directory by finding the location of the Catalyst Bridge JAR.
     *
     * <p>Resolution order:</p>
     * <ol>
     *   <li>Location of the JAR containing this class</li>
     *   <li>Falls back to current working directory if JAR location cannot be determined</li>
     * </ol>
     *
     * @return the resolved lib directory
     */
    private Path resolveLibDirectory() {
        try {
            // Get the URL of this class's code source (the JAR file)
            URL jarUrl = CatalystPaths.class.getProtectionDomain()
                .getCodeSource()
                .getLocation();

            if (jarUrl != null) {
                Path jarPath = Paths.get(jarUrl.toURI());

                // If running from a JAR, get its parent directory
                if (jarPath.toFile().isFile()) {
                    Path parent = jarPath.getParent();
                    LOGGER.info("Resolved Catalyst lib directory from JAR location: {}", parent);
                    return parent;
                }

                // If running from classes directory (e.g., during development/testing)
                if (jarPath.toFile().isDirectory()) {
                    LOGGER.info("Running from classes directory: {}", jarPath);
                    return jarPath;
                }
            }
        } catch (URISyntaxException e) {
            LOGGER.warn("Failed to resolve JAR location: {}", e.getMessage());
        } catch (SecurityException e) {
            LOGGER.warn("Security exception resolving JAR location: {}", e.getMessage());
        }

        // Fallback to current working directory
        Path cwd = Paths.get("").toAbsolutePath();
        LOGGER.warn("Could not resolve JAR location, using current directory: {}", cwd);
        return cwd;
    }

    @Override
    public String toString() {
        return "CatalystPaths{libDirectory=" + libDirectory + "}";
    }
}

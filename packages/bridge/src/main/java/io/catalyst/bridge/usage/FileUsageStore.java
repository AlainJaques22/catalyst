package io.catalyst.bridge.usage;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.catalyst.bridge.config.CatalystPaths;
import io.catalyst.bridge.licensing.License;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Optional;

/**
 * JSON file-based implementation of UsageStore.
 *
 * <p>Stores data in catalyst-usage.json in the same directory as the JAR.</p>
 *
 * <p>Thread safety is achieved via synchronized methods.
 * Atomic writes (write to temp, then rename) prevent corruption.</p>
 *
 * <p>File format is human-readable JSON for easy debugging:</p>
 * <pre>
 * {
 *   "version": 1,
 *   "licenseKey": "CAT1...",
 *   "year": 2025,
 *   "count": 847,
 *   "firstExecution": "2025-01-15",
 *   "lastExecution": "2025-06-17",
 *   ...
 * }
 * </pre>
 *
 * @see UsageStore
 * @see UsageData
 */
public class FileUsageStore implements UsageStore {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileUsageStore.class);

    private final Path filePath;
    private final ObjectMapper objectMapper;
    private final Object lock = new Object();

    /**
     * Creates a FileUsageStore with default paths.
     */
    public FileUsageStore() {
        this(new CatalystPaths().getUsageFilePath());
    }

    /**
     * Creates a FileUsageStore with a custom file path.
     * Primarily used for testing.
     *
     * @param filePath the path to the usage file
     */
    public FileUsageStore(Path filePath) {
        this.filePath = filePath;
        this.objectMapper = createObjectMapper();
        LOGGER.debug("FileUsageStore initialized with path: {}", filePath);
    }

    private ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return mapper;
    }

    @Override
    public Optional<UsageData> load() {
        synchronized (lock) {
            if (!Files.exists(filePath)) {
                LOGGER.debug("Usage file does not exist: {}", filePath);
                return Optional.empty();
            }

            try {
                UsageDataDto dto = objectMapper.readValue(filePath.toFile(), UsageDataDto.class);
                UsageData data = dto.toUsageData();
                LOGGER.debug("Loaded usage data: year={}, count={}", data.getYear(), data.getCount());
                return Optional.of(data);
            } catch (IOException e) {
                LOGGER.error("Failed to read usage file: {}. Will create new.", e.getMessage());
                return Optional.empty();
            }
        }
    }

    @Override
    public void save(UsageData data) {
        synchronized (lock) {
            try {
                // Write to temp file first
                Path tempFile = filePath.resolveSibling(filePath.getFileName() + ".tmp");
                UsageDataDto dto = UsageDataDto.fromUsageData(data);
                objectMapper.writeValue(tempFile.toFile(), dto);

                // Atomic rename
                Files.move(tempFile, filePath, StandardCopyOption.REPLACE_EXISTING,
                          StandardCopyOption.ATOMIC_MOVE);

                LOGGER.debug("Saved usage data: year={}, count={}", data.getYear(), data.getCount());

            } catch (IOException e) {
                LOGGER.error("Failed to save usage file: {}", e.getMessage());
                throw new RuntimeException("Failed to persist usage data", e);
            }
        }
    }

    @Override
    public UsageData incrementAndGet(License license, Clock clock) {
        synchronized (lock) {
            LocalDate today = LocalDate.now(clock);
            int currentYear = today.getYear();

            Optional<UsageData> existing = load();

            UsageData updated;

            if (existing.isEmpty()) {
                // No existing data - create new
                if (license != null) {
                    updated = UsageData.createInitial(license.getKey(), currentYear, today);
                } else {
                    updated = UsageData.createNoLicense(currentYear, today);
                }
                LOGGER.info("Created new usage data for year {}", currentYear);

            } else {
                UsageData current = existing.get();

                // Check for year rollover
                if (current.getYear() != currentYear) {
                    LOGGER.info("Year rollover detected: {} -> {}", current.getYear(), currentYear);
                    if (license != null) {
                        updated = UsageData.createInitial(license.getKey(), currentYear, today);
                    } else {
                        updated = UsageData.createNoLicense(currentYear, today);
                    }
                } else {
                    // Same year - increment count
                    updated = current.withIncrementedCount(today);
                }
            }

            save(updated);
            return updated;
        }
    }

    /**
     * Returns the file path being used.
     *
     * @return the usage file path
     */
    public Path getFilePath() {
        return filePath;
    }

    /**
     * DTO for JSON serialization of UsageData.
     * Uses simpler types for cleaner JSON output.
     */
    static class UsageDataDto {
        public int version;
        public String licenseKey;
        public int year;
        public int count;
        public LocalDate firstExecution;
        public LocalDate lastExecution;
        public LocalDate noLicenseDetected;
        public LocalDate triggerActivated;
        public String activeTrigger;
        public String lastLimpMode;
        public LocalDate lastDailyWarn;
        public LocalDate lastWeeklyWarn;

        static UsageDataDto fromUsageData(UsageData data) {
            UsageDataDto dto = new UsageDataDto();
            dto.version = data.getVersion();
            dto.licenseKey = data.getLicenseKey();
            dto.year = data.getYear();
            dto.count = data.getCount();
            dto.firstExecution = data.getFirstExecution();
            dto.lastExecution = data.getLastExecution();
            dto.noLicenseDetected = data.getNoLicenseDetected();
            dto.triggerActivated = data.getTriggerActivated();
            dto.activeTrigger = data.getActiveTrigger() != null ?
                data.getActiveTrigger().name() : null;
            dto.lastLimpMode = data.getLastLimpMode() != null ?
                data.getLastLimpMode().name() : null;
            dto.lastDailyWarn = data.getLastDailyWarn();
            dto.lastWeeklyWarn = data.getLastWeeklyWarn();
            return dto;
        }

        UsageData toUsageData() {
            return UsageData.builder()
                .version(version)
                .licenseKey(licenseKey)
                .year(year)
                .count(count)
                .firstExecution(firstExecution)
                .lastExecution(lastExecution)
                .noLicenseDetected(noLicenseDetected)
                .triggerActivated(triggerActivated)
                .activeTrigger(activeTrigger != null ?
                    io.catalyst.bridge.enforcement.EnforcementTrigger.valueOf(activeTrigger) : null)
                .lastLimpMode(lastLimpMode != null ?
                    io.catalyst.bridge.enforcement.LimpMode.valueOf(lastLimpMode) :
                    io.catalyst.bridge.enforcement.LimpMode.NONE)
                .lastDailyWarn(lastDailyWarn)
                .lastWeeklyWarn(lastWeeklyWarn)
                .build();
        }
    }
}

package io.catalyst.bridge.enforcement;

import io.catalyst.bridge.licensing.License;
import io.catalyst.bridge.usage.RunRate;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDate;

import static org.junit.Assert.*;

/**
 * Unit tests for PreGraceEvaluator.
 */
public class PreGraceEvaluatorTest {

    private PreGraceEvaluator evaluator;

    @Before
    public void setUp() {
        evaluator = new PreGraceEvaluator();
    }

    // ========== Expiry Warning Tests ==========

    @Test
    public void testExpiryWarning_None_MoreThan90Days() {
        License license = createLicense(LocalDate.of(2024, 12, 31));
        LocalDate today = LocalDate.of(2024, 1, 1); // 365 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.NONE, level);
    }

    @Test
    public void testExpiryWarning_Weekly_Exactly90Days() {
        License license = createLicense(LocalDate.of(2024, 4, 1));
        LocalDate today = LocalDate.of(2024, 1, 2); // 90 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.WARN_WEEKLY, level);
    }

    @Test
    public void testExpiryWarning_Weekly_75Days() {
        License license = createLicense(LocalDate.of(2024, 4, 15));
        LocalDate today = LocalDate.of(2024, 1, 31); // 75 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.WARN_WEEKLY, level);
    }

    @Test
    public void testExpiryWarning_Daily_60Days() {
        License license = createLicense(LocalDate.of(2024, 4, 1));
        LocalDate today = LocalDate.of(2024, 2, 1); // 60 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.WARN_DAILY, level);
    }

    @Test
    public void testExpiryWarning_Daily_45Days() {
        License license = createLicense(LocalDate.of(2024, 4, 15));
        LocalDate today = LocalDate.of(2024, 3, 1); // 45 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.WARN_DAILY, level);
    }

    @Test
    public void testExpiryWarning_Every_30Days() {
        License license = createLicense(LocalDate.of(2024, 3, 1));
        LocalDate today = LocalDate.of(2024, 1, 31); // 30 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.ERROR_EVERY, level);
    }

    @Test
    public void testExpiryWarning_Every_15Days() {
        License license = createLicense(LocalDate.of(2024, 3, 15));
        LocalDate today = LocalDate.of(2024, 3, 1); // 14 days until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.ERROR_EVERY, level);
    }

    @Test
    public void testExpiryWarning_Every_1Day() {
        License license = createLicense(LocalDate.of(2024, 3, 2));
        LocalDate today = LocalDate.of(2024, 3, 1); // 1 day until expiry

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.ERROR_EVERY, level);
    }

    @Test
    public void testExpiryWarning_None_AlreadyExpired() {
        // Expired licenses trigger enforcement, not warnings
        License license = createLicense(LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 3, 1);

        AlertLevel level = evaluator.evaluateExpiryWarning(license, today);

        assertEquals(AlertLevel.NONE, level);
    }

    @Test
    public void testExpiryWarning_NullLicense() {
        AlertLevel level = evaluator.evaluateExpiryWarning(null, LocalDate.now());
        assertEquals(AlertLevel.NONE, level);
    }

    // ========== Run Rate Warning Tests ==========

    @Test
    public void testRunRateWarning_None_UnderPace() {
        RunRate runRate = createRunRate(0.8, true);

        AlertLevel level = evaluator.evaluateRunRateWarning(runRate);

        assertEquals(AlertLevel.NONE, level);
    }

    @Test
    public void testRunRateWarning_Weekly_20PercentOver() {
        RunRate runRate = createRunRate(1.2, true);

        AlertLevel level = evaluator.evaluateRunRateWarning(runRate);

        assertEquals(AlertLevel.WARN_WEEKLY, level);
    }

    @Test
    public void testRunRateWarning_Weekly_35PercentOver() {
        RunRate runRate = createRunRate(1.35, true);

        AlertLevel level = evaluator.evaluateRunRateWarning(runRate);

        assertEquals(AlertLevel.WARN_WEEKLY, level);
    }

    @Test
    public void testRunRateWarning_Daily_50PercentOver() {
        RunRate runRate = createRunRate(1.5, true);

        AlertLevel level = evaluator.evaluateRunRateWarning(runRate);

        assertEquals(AlertLevel.WARN_DAILY, level);
    }

    @Test
    public void testRunRateWarning_Daily_100PercentOver() {
        RunRate runRate = createRunRate(2.0, true);

        AlertLevel level = evaluator.evaluateRunRateWarning(runRate);

        assertEquals(AlertLevel.WARN_DAILY, level);
    }

    @Test
    public void testRunRateWarning_None_InsufficientData() {
        RunRate runRate = createRunRate(2.0, false);

        AlertLevel level = evaluator.evaluateRunRateWarning(runRate);

        assertEquals(AlertLevel.NONE, level);
    }

    @Test
    public void testRunRateWarning_NullRunRate() {
        AlertLevel level = evaluator.evaluateRunRateWarning(null);
        assertEquals(AlertLevel.NONE, level);
    }

    // ========== Combined Alert Level Tests ==========

    @Test
    public void testCombinedAlertLevel_BothNone() {
        AlertLevel combined = evaluator.combinedAlertLevel(AlertLevel.NONE, AlertLevel.NONE);
        assertEquals(AlertLevel.NONE, combined);
    }

    @Test
    public void testCombinedAlertLevel_OneWeeklyOneNone() {
        AlertLevel combined = evaluator.combinedAlertLevel(AlertLevel.WARN_WEEKLY, AlertLevel.NONE);
        assertEquals(AlertLevel.WARN_WEEKLY, combined);
    }

    @Test
    public void testCombinedAlertLevel_WeeklyAndDaily() {
        AlertLevel combined = evaluator.combinedAlertLevel(AlertLevel.WARN_WEEKLY, AlertLevel.WARN_DAILY);
        assertEquals(AlertLevel.WARN_DAILY, combined);
    }

    @Test
    public void testCombinedAlertLevel_DailyAndEvery() {
        AlertLevel combined = evaluator.combinedAlertLevel(AlertLevel.WARN_DAILY, AlertLevel.ERROR_EVERY);
        assertEquals(AlertLevel.ERROR_EVERY, combined);
    }

    private License createLicense(LocalDate expiryDate) {
        return License.builder()
            .key("CAT1.test.sig")
            .keyVersion(1)
            .tier("starter")
            .annualLimit(10000)
            .customer("Test")
            .startDate(LocalDate.of(2024, 1, 1))
            .expiryDate(expiryDate)
            .build();
    }

    private RunRate createRunRate(double rateRatio, boolean sufficientData) {
        return RunRate.builder()
            .currentRate(rateRatio * 27.4)
            .allowedRate(27.4)
            .rateRatio(rateRatio)
            .projectedAnnualTotal((int) (rateRatio * 10000))
            .projectedPercent((int) (rateRatio * 100))
            .daysElapsed(100)
            .daysRemaining(265)
            .sufficientData(sufficientData)
            .currentUsage(2740)
            .annualLimit(10000)
            .build();
    }
}

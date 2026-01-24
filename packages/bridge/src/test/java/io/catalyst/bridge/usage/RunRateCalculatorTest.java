package io.catalyst.bridge.usage;

import io.catalyst.bridge.licensing.License;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDate;

import static org.junit.Assert.*;

/**
 * Unit tests for RunRateCalculator.
 */
public class RunRateCalculatorTest {

    private RunRateCalculator calculator;
    private License license;

    @Before
    public void setUp() {
        calculator = new RunRateCalculator();
        license = License.builder()
            .key("CAT1.test.sig")
            .keyVersion(1)
            .tier("starter")
            .annualLimit(10000)
            .customer("Test")
            .startDate(LocalDate.of(2024, 1, 1))
            .expiryDate(LocalDate.of(2024, 12, 31))
            .build();
    }

    @Test
    public void testOnPace_ExactlyOnLimit() {
        // 10000 / 365 = ~27.4 per day
        // After 100 days, should have ~2740 if on pace
        UsageData usage = createUsageData(2740, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 4, 10); // Day 100

        RunRate rate = calculator.calculate(usage, license, today);

        assertTrue(rate.isSufficientData());
        assertFalse(rate.isOverPace());
        assertEquals(0, rate.getOverPacePercent());
    }

    @Test
    public void testOverPace_20Percent() {
        // Need to be 20% over pace
        // Allowed rate = 10000 / 365 = 27.4/day
        // For 100 days, on-pace = 2740
        // 20% over pace means rateRatio >= 1.2, so need 3288+
        // But calculation uses days elapsed including first day
        // Day 1 = Jan 1, Day 100 = Apr 9 (100 days elapsed when today = Apr 10)
        UsageData usage = createUsageData(3500, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 4, 10); // 100 days

        RunRate rate = calculator.calculate(usage, license, today);

        assertTrue("Should be over pace", rate.isOverPace());
        assertTrue("Should be moderately over pace (20-50%)", rate.isModeratelyOverPace());
        assertFalse("Should not be severely over pace", rate.isSeverelyOverPace());
    }

    @Test
    public void testOverPace_50Percent() {
        // 50% over pace means rateRatio >= 1.5
        // For 100 days at on-pace = 2740
        // 50% over = 4110+
        UsageData usage = createUsageData(4500, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 4, 10);

        RunRate rate = calculator.calculate(usage, license, today);

        assertTrue("Should be over pace", rate.isOverPace());
        assertTrue("Should be severely over pace (50%+)", rate.isSeverelyOverPace());
    }

    @Test
    public void testUnderPace() {
        // Using only 50% of allowed pace
        UsageData usage = createUsageData(1370, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 4, 10); // Day 100

        RunRate rate = calculator.calculate(usage, license, today);

        assertFalse(rate.isOverPace());
        assertEquals(0, rate.getOverPacePercent());
        assertNull(rate.getDaysUntilLimit());
    }

    @Test
    public void testInsufficientData_LessThan7Days() {
        UsageData usage = createUsageData(100, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 1, 5); // Only 5 days

        RunRate rate = calculator.calculate(usage, license, today);

        assertFalse(rate.isSufficientData());
    }

    @Test
    public void testSufficientData_Exactly7Days() {
        UsageData usage = createUsageData(200, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 1, 7); // 7 days

        RunRate rate = calculator.calculate(usage, license, today);

        assertTrue(rate.isSufficientData());
    }

    @Test
    public void testProjectedAnnualTotal() {
        // 100 executions in 10 days = 10/day
        // Projected annual = 10 * 365 = 3650
        UsageData usage = createUsageData(100, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 1, 10);

        RunRate rate = calculator.calculate(usage, license, today);

        assertEquals(3650, rate.getProjectedAnnualTotal());
    }

    @Test
    public void testDaysUntilLimit_OverPace() {
        // 50 executions/day for 10 days = 500 used
        // Limit = 10000
        // Remaining = 9500
        // Days until limit = 9500 / 50 = 190 days
        UsageData usage = createUsageData(500, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 1, 10);

        RunRate rate = calculator.calculate(usage, license, today);

        // At this pace (50/day projected 18250/year), definitely over pace
        assertTrue(rate.isOverPace());
        assertNotNull(rate.getDaysUntilLimit());
    }

    @Test
    public void testRemainingExecutions() {
        UsageData usage = createUsageData(3000, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 4, 10);

        RunRate rate = calculator.calculate(usage, license, today);

        assertEquals(7000, rate.getRemainingExecutions());
    }

    @Test
    public void testDaysRemaining() {
        UsageData usage = createUsageData(100, LocalDate.of(2024, 1, 1));
        LocalDate today = LocalDate.of(2024, 6, 1);

        RunRate rate = calculator.calculate(usage, license, today);

        // Days from June 1 to Dec 31 = ~214 days
        assertTrue(rate.getDaysRemaining() > 200 && rate.getDaysRemaining() < 220);
    }

    private UsageData createUsageData(int count, LocalDate firstExecution) {
        return UsageData.builder()
            .version(1)
            .licenseKey("CAT1.test.sig")
            .year(2024)
            .count(count)
            .firstExecution(firstExecution)
            .lastExecution(LocalDate.now())
            .build();
    }
}

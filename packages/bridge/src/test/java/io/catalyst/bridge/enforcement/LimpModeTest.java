package io.catalyst.bridge.enforcement;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Unit tests for LimpMode enum.
 */
public class LimpModeTest {

    @Test
    public void testFromGraceDays_Zero() {
        assertEquals(LimpMode.NONE, LimpMode.fromGraceDays(0));
    }

    @Test
    public void testFromGraceDays_Negative() {
        assertEquals(LimpMode.NONE, LimpMode.fromGraceDays(-1));
    }

    @Test
    public void testFromGraceDays_Status1_Day1() {
        assertEquals(LimpMode.STATUS_1, LimpMode.fromGraceDays(1));
    }

    @Test
    public void testFromGraceDays_Status1_Day15() {
        assertEquals(LimpMode.STATUS_1, LimpMode.fromGraceDays(15));
    }

    @Test
    public void testFromGraceDays_Status1_Day30() {
        assertEquals(LimpMode.STATUS_1, LimpMode.fromGraceDays(30));
    }

    @Test
    public void testFromGraceDays_Status2_Day31() {
        assertEquals(LimpMode.STATUS_2, LimpMode.fromGraceDays(31));
    }

    @Test
    public void testFromGraceDays_Status2_Day45() {
        assertEquals(LimpMode.STATUS_2, LimpMode.fromGraceDays(45));
    }

    @Test
    public void testFromGraceDays_Status2_Day60() {
        assertEquals(LimpMode.STATUS_2, LimpMode.fromGraceDays(60));
    }

    @Test
    public void testFromGraceDays_Status3_Day61() {
        assertEquals(LimpMode.STATUS_3, LimpMode.fromGraceDays(61));
    }

    @Test
    public void testFromGraceDays_Status3_Day75() {
        assertEquals(LimpMode.STATUS_3, LimpMode.fromGraceDays(75));
    }

    @Test
    public void testFromGraceDays_Status3_Day90() {
        assertEquals(LimpMode.STATUS_3, LimpMode.fromGraceDays(90));
    }

    @Test
    public void testFromGraceDays_Disabled_Day91() {
        assertEquals(LimpMode.DISABLED, LimpMode.fromGraceDays(91));
    }

    @Test
    public void testFromGraceDays_Disabled_Day100() {
        assertEquals(LimpMode.DISABLED, LimpMode.fromGraceDays(100));
    }

    @Test
    public void testDelayMillis() {
        assertEquals(0, LimpMode.NONE.getDelayMillis());
        assertEquals(3000, LimpMode.STATUS_1.getDelayMillis());
        assertEquals(8000, LimpMode.STATUS_2.getDelayMillis());
        assertEquals(21000, LimpMode.STATUS_3.getDelayMillis());
        assertEquals(-1, LimpMode.DISABLED.getDelayMillis());
    }

    @Test
    public void testIsBlocked() {
        assertFalse(LimpMode.NONE.isBlocked());
        assertFalse(LimpMode.STATUS_1.isBlocked());
        assertFalse(LimpMode.STATUS_2.isBlocked());
        assertFalse(LimpMode.STATUS_3.isBlocked());
        assertTrue(LimpMode.DISABLED.isBlocked());
    }

    @Test
    public void testIsDegraded() {
        assertFalse(LimpMode.NONE.isDegraded());
        assertTrue(LimpMode.STATUS_1.isDegraded());
        assertTrue(LimpMode.STATUS_2.isDegraded());
        assertTrue(LimpMode.STATUS_3.isDegraded());
        assertFalse(LimpMode.DISABLED.isDegraded());
    }

    @Test
    public void testIsEnforced() {
        assertFalse(LimpMode.NONE.isEnforced());
        assertTrue(LimpMode.STATUS_1.isEnforced());
        assertTrue(LimpMode.STATUS_2.isEnforced());
        assertTrue(LimpMode.STATUS_3.isEnforced());
        assertTrue(LimpMode.DISABLED.isEnforced());
    }

    @Test
    public void testHeadline() {
        assertNull(LimpMode.NONE.getHeadline());
        assertEquals("SERVICE DEGRADED", LimpMode.STATUS_1.getHeadline());
        assertEquals("SERVICE IMPAIRED", LimpMode.STATUS_2.getHeadline());
        assertEquals("SERVICE CRITICAL", LimpMode.STATUS_3.getHeadline());
        assertEquals("SERVICE UNAVAILABLE", LimpMode.DISABLED.getHeadline());
    }

    @Test
    public void testLevel() {
        assertEquals(0, LimpMode.NONE.getLevel());
        assertEquals(1, LimpMode.STATUS_1.getLevel());
        assertEquals(2, LimpMode.STATUS_2.getLevel());
        assertEquals(3, LimpMode.STATUS_3.getLevel());
        assertEquals(4, LimpMode.DISABLED.getLevel());
    }
}

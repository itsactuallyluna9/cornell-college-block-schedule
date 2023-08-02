import {
  assertEquals,
  assertExists,
  assertInstanceOf,
  assertNotEquals,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import loadCalendar from "../src/calendar.ts";

Deno.test("calendar data can load", () => {
  const calendar = loadCalendar();
  assertExists(calendar);
});

Deno.test("calendar data is valid", () => {
  const calendar = loadCalendar();
  const invalidDate = new Date(null!);
  for (const year in calendar) {
    const year_data = calendar[year];
    assertEquals(year_data.blocks.length >= 8, true);
    for (const block of year_data.blocks) {
      assertEquals(typeof block.block, "number");
      assertEquals(block.block >= 1, true);

      assertInstanceOf(block.start, Date);
      assertInstanceOf(block.end, Date);

      assertNotEquals(block.start, invalidDate);
      assertNotEquals(block.end, invalidDate);
    }
    for (const event of year_data.events) {
      assertInstanceOf(event.start, Date);
      assertInstanceOf(event.end, Date);

      assertNotEquals(event.start, invalidDate);
      assertNotEquals(event.end, invalidDate);
    }
  }
});

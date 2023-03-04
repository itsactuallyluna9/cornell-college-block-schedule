import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import loadCalendar from "../src/calendar.ts";

Deno.test("calendar data is loaded", () => {
  const calendar = loadCalendar();
  assertExists(calendar);
});

Deno.test("calendar data is valid", () => {
  const calendar = loadCalendar();
  for (const year in calendar) {
    const year_data = calendar[year];
    assertEquals(year_data.blocks.length > 8, true);
    for (const block of year_data.blocks) {
      assertEquals(typeof block.block, "number");
      assertEquals(block.block >= 1, true);

      assertEquals(block.start instanceof Date, true);
      assertEquals(block.end instanceof Date, true);
    }
    for (const event of year_data.events) {
      assertEquals(event.start instanceof Date, true);
      assertEquals(event.end instanceof Date, true);
    }
  }
});

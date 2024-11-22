import { test, expect } from "bun:test";
import { loadCalendar } from "../src/calendar.ts";

test("calendar data can load", () => {
  const calendar = loadCalendar();
  expect(calendar).toBeObject();
});

test("calendar data is valid", () => {
  const calendar = loadCalendar();
  const invalidDate = new Date(null!);
  for (const year in calendar) {
    const year_data = calendar[year];
    expect(year_data.blocks.length).toBeGreaterThanOrEqual(8);
    for (const block of year_data.blocks) {
      expect(block.block).toBeNumber();
      expect(block.start).toBeInstanceOf(Date);
      expect(block.end).toBeInstanceOf(Date);
      expect(block.start).not.toEqual(invalidDate);
      expect(block.end).not.toEqual(invalidDate);
    }
    for (const event of year_data.events) {
      expect(event.name).toBeString();
      expect(event.start).toBeInstanceOf(Date);
      expect(event.end).toBeInstanceOf(Date);
      expect(event.start).not.toEqual(invalidDate);
      expect(event.end).not.toEqual(invalidDate);
    }
  }
});

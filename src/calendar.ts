import type { Calendar } from "./types.ts";
import data from "../calendar.json";

export default function loadCalendar() {
  const calendar = data as unknown as Calendar;
  // Convert dates to Date objects
  for (const year in calendar) {
    const year_data = calendar[year];
    for (const block of year_data.blocks) {
      block.start = new Date(block.start);
      block.end = new Date(block.end);
    }
    for (const event of year_data.events) {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
    }
  }
  return calendar;
}

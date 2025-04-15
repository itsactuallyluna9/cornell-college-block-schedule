import data from "../calendar.json";

export type Calendar = {
  [school_year: string]: {
    blocks: [
      {
        block: number; // 1-8 guaranteed, 9+ optional
        start: Date;
        end: Date;
      },
    ];
    events: [
      {
        name: string; // Fall Break, Winter Break, Spring Break, Commencement
        start: Date;
        end: Date;
      },
    ];
  };
};

/**
 * Load the calendar data
 * 
 * Automatically converts dates to Date objects
 * 
 * @returns The calendar data
 */
export function loadCalendar() {
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

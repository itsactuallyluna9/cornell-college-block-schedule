import { loadCalendar } from "./calendar.ts";

/**
 * Calendar data for a specific date
 */
export type CalendarData = {
  /**
   * Does the date fall on a weekend? (Saturday or Sunday)
   */
  is_weekend: boolean;
  block: Block | null;
  /**
   * The day of the block the date falls in
   * 
   * null if the date is not in a block
   */
  day: number | null;
  /**
   * The week of the block the date falls in
   * 
   * null if the date is not in a block
   */
  week: number | null;
  event: Event | null;
  /**
   * The school year the date falls in
   */
  school_year?: string;
};

/**
 * A block, lasting 18 class days.
 */
type Block = {
  /**
   * The block number, typically 1-8, but can be 9+ for blocks over the summer.
   */
  block: number;
  /**
   * The start date of the block.
   */
  start: Date;
  /**
   * The end date of the block.
   */
  end: Date;
};

/**
 * The event the date falls in
 * 
 * Typically Fall Break, Winter Break, Spring Break, Commencement, or Common Afternoon
 */
type Event = {
  /**
   * The name of the event.
   */
  name: string;
  /**
   * The start date of the block.
   */
  start: Date;
  /**
   * The end date of the block.
   */
  end: Date;
};

/**
 * Get the calendar data for a specific date
 * 
 * @param for_date The date to get the calendar data for
 * @returns The calendar data for the date
 * @throws If the calendar data for the date is not found
 */
export function calendarData(for_date: Date): CalendarData {
  const calendar = loadCalendar();
  const school_year = Object.keys(calendar).find((year) => {
    const year_data = calendar[year];
    const first_block = year_data.blocks[0];
    const last_block = year_data.blocks[year_data.blocks.length - 1];
    return for_date >= first_block.start && for_date <= last_block.end;
  });
  if (!school_year) {
    throw new Error("Calendar data not found for date!");
  }
  const year_data = calendar[school_year];
  const block = year_data.blocks.find((block) => {
    return for_date >= block.start && for_date <= block.end;
  });
  const event = year_data.events.find((event) => {
    return for_date >= event.start && for_date <= event.end;
  });

  if (block && event) {
    return {
      is_weekend: for_date.getDay() === 0 || for_date.getDay() === 6,
      block,
      day: null,
      week: null,
      event,
      school_year,
    };
  }

  if (!block && event) {
    return {
      is_weekend: for_date.getDay() === 0 || for_date.getDay() === 6,
      block: null,
      day: null,
      week: null,
      event,
      school_year,
    };
  }
  if (!block && !event) {
    // so if we're not in a block, and we're not in an offically defined break, we're in block break!
    // block break starts on the last day of the last block we were in, and ends on the first day of the next block
    // to get the last block we were in, we need to find the most recent block that ended before the date we're checking
    const last_block = year_data.blocks.reduce(
      (prev, current) => {
        if (current.end < for_date) {
          return current;
        }
        return prev;
      },
      null as Block | null,
    );
    if (!last_block) {
      throw new Error("Calendar data not found for date!");
    }

    // now we need to find the next block!
    const next_block =
      year_data.blocks[year_data.blocks.indexOf(last_block) + 1];
    if (!next_block) {
      throw new Error("Calendar data not found for date!");
    }
    // if (next_block.block) isn't between 1-8
    if (next_block.block < 1 || next_block.block > 8) {
      // we're in pure summer!
      // summer break ends on the first day of the first block of the next school year

      // get the next school year
      const next_school_year = Object.keys(calendar).find((year) => {
        return year > school_year;
      });

      if (!next_school_year) {
        throw new Error("Calendar data not found for date!");
      }

      const next_year_data = calendar[next_school_year];
      const next_year_first_block = next_year_data.blocks[0];
      return {
        is_weekend: for_date.getDay() === 0 || for_date.getDay() === 6,
        block: null,
        day: null,
        week: null,
        event: {
          name: "Summer Break",
          start: last_block.end,
          end: next_year_first_block.start,
        },
      };
    }

    // now we can check if the date we're checking is between the last block and the next block
    if (for_date > last_block.end && for_date < next_block.start) {
      return {
        is_weekend: for_date.getDay() === 0 || for_date.getDay() === 6,
        block: null,
        day: null,
        week: null,
        event: {
          name: "Block Break",
          start: last_block.end,
          end: next_block.start,
        },
        school_year,
      };
    } else {
      throw new Error("Calendar data not found for date!");
    }
  }

  if (!block) {
    // make ts happy.
    throw new Error("Calendar data not found for date!");
  }

  const is_weekend = for_date.getDay() === 0 || for_date.getDay() === 6;
  // count up the days since the start of the block
  // skip weekends and events
  let day = 0;
  let week = 0;
  let had_event = false;
  const current_date = new Date(block.start);
  while (current_date <= for_date) {
    const event = year_data.events.find((event) => {
      return current_date >= event.start && current_date < event.end;
    });
    if (event) {
      had_event = true;
    }
    if (current_date.getDay() !== 0 && current_date.getDay() !== 6 && !event) {
      day++;
    }
    if (current_date.getDay() === 1) {
      week++;
    }
    current_date.setDate(current_date.getDate() + 1);
  }
  if (had_event) {
    day++;
    // and recalculate the week...
    week = Math.ceil(day / 5);
    if (is_weekend) {
      day--;
      week--;
    }
  }
  if (block.block < 1 || block.block > 8) {
    // we're in summer, but there's a block going on!
    // summer break ends on the first day of the first block of the next school year

    // get the next school year
    const next_school_year = Object.keys(calendar).find((year) => {
      return year > school_year;
    });

    if (!next_school_year) {
      throw new Error("Calendar data not found for date!");
    }
    const required_blocks = year_data.blocks.filter((block) => {
      return block.block >= 1 && block.block <= 8;
    });
    const end_of_last_required_block =
      required_blocks[required_blocks.length - 1].end;
    const next_year_data = calendar[next_school_year];
    const next_year_first_block = next_year_data.blocks[0];
    return {
      is_weekend: for_date.getDay() === 0 || for_date.getDay() === 6,
      block,
      day,
      week,
      event: {
        name: "Summer Break",
        start: end_of_last_required_block,
        end: next_year_first_block.start,
      },
    };
  } else {
    // we're in a block!

    // handle common afternoon
    // so far, it's only been implemented for 24-25 and 25-26
    // 2nd wednesday of each block (day 8), 12p-3p
    if (school_year === "2024-2025" || school_year === "2025-2026") {
      if (day === 8 && for_date.getHours() >= 12 && for_date.getHours() < 15) {
        return {
          is_weekend,
          block,
          day,
          week,
          event: {
            name: "Common Afternoon",
            start: new Date(
              for_date.getFullYear(),
              for_date.getMonth(),
              for_date.getDate(),
              12,
              0,
            ),
            end: new Date(
              for_date.getFullYear(),
              for_date.getMonth(),
              for_date.getDate(),
              15,
              0,
            ),
          },
          school_year,
        };
      }
    }
    return {
      is_weekend,
      block,
      day,
      week,
      event: null,
      school_year,
    };
  }
}

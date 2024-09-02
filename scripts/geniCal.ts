import loadCalendar from "../src/calendar";
import ical from "ical-generator";

async function main() {
  const data = await loadCalendar();
  const calendar = ical({
    name: "Cornell College Block Schedule",
  });
  for (const year in data) {
    const year_data = data[year];
    for (const block of year_data.blocks) {
      calendar.createEvent({
        start: block.start,
        end: block.end,
        summary: `Block ${block.block}`,
      });
    }
    for (const event of year_data.events) {
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.name,
      });
    }
  }
  await Bun.write("cornell.ics", calendar.toString());
}

await main();

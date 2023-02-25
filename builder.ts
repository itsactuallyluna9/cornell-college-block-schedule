// A simple script to format the calendar.json file! (assuming you manually input the dates)
// Run with `deno run --allow-read --allow-write builder.ts`

type Block = {
  block: number;
  start: Date;
  end: Date;
};

type CalEvent = {
  name: string;
  start: Date;
  end: Date;
};

type AcademicYear = {
  blocks: Block[];
  events: CalEvent[];
};

type Calendar = {
  // 2021-2022: AcademicYear;
  [key: string]: AcademicYear;
};

function getBlocks(startYear: number): Block[] {
  const blocks: Block[] = [];
  const totalBlocks = 9;
  let block = 1;

  for (let i = 0; i < totalBlocks; i++) {
    console.log(`Block ${block}`);
    const startAns = prompt("Start date:") + ` ${startYear} 9:00 AM`;
    const start = new Date(startAns);
    const endTime = (block === 4 || block === 6) ? "12:00 PM" : "3:00 PM";
    const endAns = prompt("End date:") + ` ${startYear} ${endTime}`;
    const end = new Date(endAns);
    blocks.push({ block, start, end });
    block++;
    if (block === 4) {
      startYear++;
    }
  }

  return blocks;
}

function getEvents(startYear: number): CalEvent[] {
  const events: CalEvent[] = [];
  events.push({
    name: "Fall Break",
    start: new Date(`${prompt("Fall Break Start:")} ${startYear} 9:00 AM`),
    end: new Date(`${prompt("Fall Break End:")} ${startYear} 9:00 AM`),
  });
  events.push({
    name: "Winter Break",
    start: new Date(`${prompt("Winter Break Start:")} ${startYear} 9:00 AM`),
    end: new Date(`${prompt("Winter Break End:")} ${startYear + 1} 9:00 AM`),
  });
  events.push({
    name: "Spring Break",
    start: new Date(
      `${prompt("Spring Break Start:")} ${startYear + 1} 9:00 AM`,
    ),
    end: new Date(`${prompt("Spring Break End:")} ${startYear + 1} 9:00 AM`),
  });
  const commencementDate = prompt("Commencement Date:");
  events.push({
    name: "Commencement",
    start: new Date(`${commencementDate} ${startYear + 1} 9:00 AM`),
    end: new Date(`${commencementDate} ${startYear + 1} 12:00 PM`),
  });
  return events;
}

async function getCalendar() {
  // read from calendar.json
  const data = await Deno.readTextFile("calendar.json");
  return JSON.parse(data) as Calendar;
}

async function main() {
  const startYear = prompt("Start year: ");
  if (startYear === null) {
    return;
  }
  const cal = await getCalendar();
  const blocks = getBlocks(parseInt(startYear));
  const events = getEvents(parseInt(startYear));
  const year = `${startYear}-${parseInt(startYear) + 1}`;
  cal[year] = { blocks, events };
  await Deno.writeTextFile("calendar.json", JSON.stringify(cal, null, 2));
}

await main();

import { assertSnapshot } from "https://deno.land/std@0.178.0/testing/snapshot.ts";
import { calendarData } from "../src/info.ts";

Deno.test("handles pure summer break", (t) => {
  const date_to_check = new Date("June 1, 2023 9:00");
  const data = calendarData(date_to_check);
  assertSnapshot(t, data);
});

Deno.test("handles not pure summer break", (t) => {
  const date_to_check = new Date("June 25, 2023 9:00");
  const data = calendarData(date_to_check);
  assertSnapshot(t, data);
});

Deno.test("handles block breaks", (t) => {
  const date_to_check = new Date("Feb 10, 2023 9:00");
  const data = calendarData(date_to_check);
  assertSnapshot(t, data);
});

Deno.test("handles actual blocks", (t) => {
  const date_to_check = new Date("Mar 3, 2023 9:00");
  const data = calendarData(date_to_check);
  assertSnapshot(t, data);
});

// DOES NOT WORK FOR NOW
// I gotta redo some logic :(

// Deno.test("handles breaks in blocks", (t) => {
//     const date_to_check = new Date("Nov 25, 2024 9:00")
//     const data = calendarData(date_to_check)
//     assertSnapshot(t, data)
// })

// Deno.test("handles breaks in blocks on return", (t) => {
//     const date_to_check = new Date("Dec 2, 2024 9:00")
//     const data = calendarData(date_to_check)
//     assertSnapshot(t, data)
// })

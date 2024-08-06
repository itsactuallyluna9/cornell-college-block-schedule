import { test, expect } from "bun:test";
import { calendarData } from "../src/info.ts";

test("handles pure summer break", () => {
  const date_to_check = new Date("June 1, 2023 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("handles not pure summer break", () => {
  const date_to_check = new Date("June 25, 2023 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("handles block breaks", () => {
  const date_to_check = new Date("Feb 10, 2023 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("handles actual blocks", () => {
  const date_to_check = new Date("Mar 3, 2023 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("handles breaks in blocks", () => {
  const date_to_check = new Date("Nov 25, 2024 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("handles breaks in blocks on return", () => {
  const date_to_check = new Date("Dec 2, 2024 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

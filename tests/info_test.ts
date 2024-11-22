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
  const date_to_check = new Date("Nov 26, 2024 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("handles breaks in blocks on return", () => {
  const date_to_check = new Date("Dec 2, 2024 8:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();

  const date_to_check_weekend = new Date("Dec 8, 2024 9:00");
  const data_weekend = calendarData(date_to_check_weekend);
  expect(data_weekend).toMatchSnapshot();
});

test("handles pure breaks", () => {
  const date_to_check = new Date("Dec 25, 2023 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

test("throws on invalid school year", () => {
  expect(() => {
    calendarData(new Date("Jan 1, 1900 9:00"));
  }).toThrowError("Calendar data not found for date!");
  expect(() => {
    calendarData(new Date("Jan 1, 3000 9:00"));
  }).toThrowError("Calendar data not found for date!");
});

test("handles weekends", () => {
  const date_to_check = new Date("Nov 2, 2024 9:00");
  const data = calendarData(date_to_check);
  expect(data).toMatchSnapshot();
});

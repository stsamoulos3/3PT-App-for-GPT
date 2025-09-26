import {
  DateTime,
  DateTimeFormatOptions,
  DateTimeFormatPresetValue,
} from "luxon";

/**
 * Converts a Date object or ISO string to UTC ISO string for storage
 * @param date Date object or ISO string
 * @returns UTC ISO string
 */
export const toUTCForStorage = (date: Date | string): string => {
  if (typeof date === "string") {
    return DateTime.fromISO(date).toUTC().toISO() ?? "";
  }
  return DateTime.fromJSDate(date).toUTC().toISO() ?? "";
};

/**
 * Converts a UTC ISO string to local timezone for display
 * @param utcDate UTC ISO string
 * @param format Optional format string (Luxon format)
 * @returns Formatted date string in local timezone
 */
export const fromUTCToLocal = (utcDate: string, format?: string): string => {
  return DateTime.fromISO(utcDate)
    .toLocal()
    .toFormat(format ?? "d MMM y");
};

/**
 * Converts a UTC ISO string to local timezone Date object
 * @param utcDate UTC ISO string
 * @returns Date object in local timezone
 */
export const fromUTCToLocalDate = (utcDate: string): Date => {
  return DateTime.fromISO(utcDate).toLocal().toJSDate();
};

/**
 * Gets the current date and time in UTC ISO format
 * @returns Current UTC ISO string
 */
export const getCurrentUTCDate = (): string => {
  return DateTime.now().toUTC().toISO();
};

/**
 * Creates a date range with UTC ISO strings
 * @param startDate Start date (Date object)
 * @param endDate Optional end date (Date object)
 * @returns Object with startDate and endDate as UTC ISO strings
 */
export const getUTCDateRange = (startDate: Date, endDate?: Date) => {
  if (startDate.toString().includes("Z")) {
    return {
      startDate: startDate,
      endDate: endDate,
    };
  }

  const start = DateTime.fromJSDate(startDate).startOf("day").toUTC();
  const end = endDate
    ? DateTime.fromJSDate(endDate).endOf("day").toUTC()
    : start.endOf("day");

  return {
    startDate: start.toISO(),
    endDate: end.toISO(),
  };
};

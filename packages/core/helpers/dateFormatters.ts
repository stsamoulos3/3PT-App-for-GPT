import { DateTime, DateTimeFormatOptions } from "luxon";
import { fromUTCToLocal } from "./dateUtils";

export const formatDate = (date: string, template?: string) => {
  return fromUTCToLocal(date, template ?? "d MMM y");
};

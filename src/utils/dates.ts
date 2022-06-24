import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

const dateFormat = "dd/MM/yyyy";
const timeFormat = "hh:mm a";
const dateTimeFormat = `${dateFormat} ${timeFormat}`;

export const formatDate = (date: Date | Timestamp) => {
  if (date instanceof Date) {
    return format(date, dateFormat);
  }

  return format(date.toDate(), dateFormat);
};

export const formatTime = (date: Date | Timestamp) => {
  if (date instanceof Date) {
    return format(date, timeFormat);
  }

  return format(date.toDate(), timeFormat);
};

export const formatDateTime = (date: Date | Timestamp) => {
  if (date instanceof Date) {
    return format(date, dateTimeFormat);
  }

  return format(date.toDate(), dateTimeFormat);
};

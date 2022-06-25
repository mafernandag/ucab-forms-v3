import { formatDateTime } from "../../utils/dates";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { DateTimeQuestion, DateTimeAnswer, DateTimeDbAnswer } from "./types";

// TODO: See if this can be changed
export const stringify = (value: DateTimeDbAnswer) => {
  if (!value) {
    return "";
  }

  return formatDateTime(value);
};

export const getSerializableValue = (value: DateTimeDbAnswer) => {
  if (!value) {
    return "";
  }

  return formatDateTime(value);
};

export const getInitializedAnswer = (
  question: DateTimeQuestion
): DateTimeAnswer => {
  return "";
};

export const checkRequired = (value: DateTimeAnswer) => {
  return !!value;
};

export const checkFormat = (value: DateTimeAnswer) => {
  return value.toString() !== "Invalid Date";
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: DateTimeQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

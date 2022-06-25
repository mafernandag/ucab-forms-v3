import { formatDate } from "../../utils/dates";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { DateQuestion, DateAnswer, DateDbAnswer } from "./types";

// TODO: See if this can be changed
export const stringify = (value: DateDbAnswer) => {
  if (!value) {
    return "";
  }

  return formatDate(value);
};

export const getSerializableValue = (value: DateDbAnswer) => {
  if (!value) {
    return "";
  }

  return formatDate(value);
};

export const getInitializedAnswer = (question: DateQuestion): DateAnswer => {
  return "";
};

export const checkRequired = (value: DateAnswer) => {
  return !!value;
};

export const checkFormat = (value: DateAnswer) => {
  return value.toString() !== "Invalid Date";
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: DateQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

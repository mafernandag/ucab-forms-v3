import { formatTime } from "../../utils/dates";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { TimeQuestion, TimeAnswer, TimeDbAnswer } from "./types";

// TODO: See if this can be changed
export const stringify = (value: TimeDbAnswer) => {
  if (!value) {
    return "";
  }

  return formatTime(value);
};

export const getInitializedAnswer = (question: TimeQuestion): TimeAnswer => {
  return "";
};

export const checkRequired = (value: TimeAnswer) => {
  return !!value;
};

export const checkFormat = (value: TimeAnswer) => {
  return value.toString() !== "Invalid Date";
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: TimeQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

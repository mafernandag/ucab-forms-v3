import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { TextQuestion, TextAnswer, TextDbAnswer } from "./types";

export const stringify = (value: TextDbAnswer) => {
  return value;
};

export const getInitializedAnswer = (question: TextQuestion) => {
  return "";
};

export const checkRequired = (value: TextAnswer) => {
  return true;
};

export const checkFormat = (value: TextAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: TextQuestion = {
    ...baseQuestion,
    type: newType,
    specialType: (question as TextQuestion).specialType ?? "",
  };

  return newQuestion;
};

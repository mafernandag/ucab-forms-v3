import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { TextareaQuestion, TextareaAnswer, TextareaDbAnswer } from "./types";

export const stringify = (value: TextareaDbAnswer) => {
  return value;
};

export const getSerializableValue = (value: TextareaDbAnswer) => {
  return value || "";
};

export const getInitializedAnswer = (question: TextareaQuestion) => {
  return "";
};

export const checkRequired = (value: TextareaAnswer) => {
  return true;
};

export const checkFormat = (value: TextareaAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: TextareaQuestion = {
    ...baseQuestion,
    type: newType,
    specialType: (question as TextareaQuestion).specialType ?? "",
  };

  return newQuestion;
};

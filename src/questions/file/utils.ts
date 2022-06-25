import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { FileQuestion, FileAnswer, FileDbAnswer } from "./types";

export const stringify = (value: FileDbAnswer) => {
  return value.map((f) => f.url).join(", ");
};

export const getSerializableValue = (value: FileDbAnswer) => {
  return value || [];
};

export const getInitializedAnswer = (question: FileQuestion) => {
  return [];
};

export const checkRequired = (value: FileAnswer) => {
  return !!value.length;
};

export const checkFormat = (value: FileAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: FileQuestion = {
    ...baseQuestion,
    type: newType,
    multipleFiles: (question as FileQuestion).multipleFiles ?? false,
  };

  return newQuestion;
};

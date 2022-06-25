import { defaultOption } from "../constants";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { SelectAnswer, SelectDbAnswer, SelectQuestion } from "./types";

export const stringify = (value: SelectDbAnswer) => {
  return value;
};

export const getInitializedAnswer = (question: SelectQuestion) => {
  return "";
};

export const checkRequired = (value: SelectAnswer) => {
  return true;
};

export const checkFormat = (value: SelectAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: SelectQuestion = {
    ...baseQuestion,
    type: newType,
    options: (question as SelectQuestion).options ?? [defaultOption],
    randomOrder: (question as SelectQuestion).randomOrder ?? false,
  };

  return newQuestion;
};

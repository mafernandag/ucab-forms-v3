import { defaultOption } from "../constants";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { CheckboxAnswer, CheckboxDbAnswer, CheckboxQuestion } from "./types";

export const stringify = (value: CheckboxDbAnswer) => {
  return value.join(", ");
};

export const getInitializedAnswer = (question: CheckboxQuestion) => {
  return [];
};

export const checkRequired = (value: CheckboxAnswer) => {
  return !!value.length;
};

export const checkFormat = (value: CheckboxAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: CheckboxQuestion = {
    ...baseQuestion,
    type: newType,
    options: (question as CheckboxQuestion).options ?? [defaultOption],
    randomOrder: (question as CheckboxQuestion).randomOrder ?? false,
    other: (question as CheckboxQuestion).other ?? false,
  };

  return newQuestion;
};

import { defaultOption } from "../constants";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { RadioAnswer, RadioDbAnswer, RadioQuestion } from "./types";

export const stringify = (value: RadioDbAnswer) => {
  return value;
};

export const initializeAnswer = (question: RadioQuestion) => {
  if (question.required) {
    return question.options[0];
  }

  return "";
};

export const checkRequired = (value: RadioAnswer) => {
  return true;
};

export const checkFormat = (value: RadioAnswer) => {
  return true;
};

export const initializeFields = (question: BaseQuestion, newType: string) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: RadioQuestion = {
    ...baseQuestion,
    type: newType,
    options: (question as RadioQuestion).options ?? [defaultOption],
    randomOrder: (question as RadioQuestion).randomOrder ?? false,
    other: (question as RadioQuestion).other ?? false,
  };

  return newQuestion;
};

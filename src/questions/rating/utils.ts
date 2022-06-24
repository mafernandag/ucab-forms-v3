import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { RatingQuestion, RatingAnswer, RatingDbAnswer } from "./types";

export const stringify = (value: RatingDbAnswer) => {
  // TODO: See if this breaks anything
  return value.toString();
};

export const initializeAnswer = (question: RatingQuestion) => {
  return 0;
};

export const checkRequired = (value: RatingAnswer) => {
  return !!value;
};

export const checkFormat = (value: RatingAnswer) => {
  return true;
};

export const initializeFields = (question: BaseQuestion, newType: string) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: RatingQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

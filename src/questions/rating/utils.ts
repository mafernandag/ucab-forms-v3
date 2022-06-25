import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { RatingQuestion, RatingAnswer, RatingDbAnswer } from "./types";

export const stringify = (value: RatingDbAnswer) => {
  // TODO: See if this breaks anything and try to see if it's better to include the label instead
  return value.toString();
};

export const getSerializableValue = (value: RatingDbAnswer) => {
  return value || "";
};

export const getInitializedAnswer = (question: RatingQuestion): "" => {
  return "";
};

export const checkRequired = (value: RatingAnswer) => {
  return !!value;
};

export const checkFormat = (value: RatingAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: RatingQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

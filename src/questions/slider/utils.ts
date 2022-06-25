import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { defaultMax, defaultMin } from "./constants";
import { SliderQuestion, SliderAnswer, SliderDbAnswer } from "./types";

export const stringify = (value: SliderDbAnswer) => {
  // TODO: See if this breaks anything
  return value.toString();
};

export const getInitializedAnswer = (question: SliderQuestion) => {
  return question.min;
};

export const checkRequired = (value: SliderAnswer) => {
  return true;
};

export const checkFormat = (value: SliderAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: SliderQuestion = {
    ...baseQuestion,
    type: newType,
    min: (question as SliderQuestion).min ?? defaultMin,
    max: (question as SliderQuestion).max ?? defaultMax,
    minLabel: (question as SliderQuestion).minLabel ?? "",
    maxLabel: (question as SliderQuestion).maxLabel ?? "",
  };

  return newQuestion;
};

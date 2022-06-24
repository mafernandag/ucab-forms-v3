import { defaultOption } from "../constants";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { SortableAnswer, SortableDbAnswer, SortableQuestion } from "./types";

export const stringify = (value: SortableDbAnswer) => {
  return value.join(", ");
};

export const initializeAnswer = (question: SortableQuestion) => {
  return [...question.options];
};

export const checkRequired = (value: SortableAnswer) => {
  return true;
};

export const checkFormat = (value: SortableAnswer) => {
  return true;
};

export const initializeFields = (question: BaseQuestion, newType: string) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: SortableQuestion = {
    ...baseQuestion,
    type: newType,
    required: true,
    options: (question as SortableQuestion).options ?? [defaultOption],
    randomOrder: (question as SortableQuestion).randomOrder ?? false,
  };

  return newQuestion;
};

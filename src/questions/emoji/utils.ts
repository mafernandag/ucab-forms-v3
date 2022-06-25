import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import { EmojiQuestion, EmojiAnswer, EmojiDbAnswer } from "./types";

export const stringify = (value: EmojiDbAnswer) => {
  // TODO: See if this breaks anything and try to see if it's better to include the label instead
  return value.toString();
};

export const getSerializableValue = (value: EmojiDbAnswer) => {
  return value || "";
};

export const getInitializedAnswer = (question: EmojiQuestion): "" => {
  return "";
};

export const checkRequired = (value: EmojiAnswer) => {
  return !!value;
};

export const checkFormat = (value: EmojiAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: EmojiQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

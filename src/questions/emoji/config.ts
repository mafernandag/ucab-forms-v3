import { QuestionTypeConfig } from "../types";
import Preview from "./Preview";
import Question from "./Question";
import Stat from "./Stat";
import Settings from "./Settings";
import ResponseByPerson from "./ResponseByPerson";
import ResponseByQuestion from "./ResponseByQuestion";
import {
  checkFormat,
  checkRequired,
  getInitializedAnswer,
  getInitializedFields,
  getSerializableValue,
  stringify,
} from "./utils";
import { EmojiAnswer, EmojiDbAnswer, EmojiQuestion } from "./types";

export const config: QuestionTypeConfig<
  EmojiQuestion,
  EmojiAnswer,
  EmojiDbAnswer
> = {
  label: "Escala de emociones",
  Preview,
  Settings,
  Question,
  Stat,
  ResponseByPerson,
  ResponseByQuestion,
  stringify: stringify,
  getSerializableValue: getSerializableValue,
  getInitializedAnswer: getInitializedAnswer,
  checkRequired: checkRequired,
  checkFormat: checkFormat,
  getInitializedFields: getInitializedFields,
};

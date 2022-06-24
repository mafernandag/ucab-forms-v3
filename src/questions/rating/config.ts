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
  initializeAnswer,
  initializeFields,
  stringify,
} from "./utils";
import { RatingAnswer, RatingDbAnswer, RatingQuestion } from "./types";

export const config: QuestionTypeConfig<
  RatingQuestion,
  RatingAnswer,
  RatingDbAnswer
> = {
  label: "Escala de valoración",
  preview: Preview,
  settings: Settings,
  question: Question,
  stat: Stat,
  responseByPerson: ResponseByPerson,
  responseByQuestion: ResponseByQuestion,
  stringify: stringify,
  initializeAnswer: initializeAnswer,
  checkRequired: checkRequired,
  checkFormat: checkFormat,
  initializeFields: initializeFields,
  alwaysRequired: false,
};

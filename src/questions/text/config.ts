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
import { TextAnswer, TextDbAnswer, TextQuestion } from "./types";

export const config: QuestionTypeConfig<
  TextQuestion,
  TextAnswer,
  TextDbAnswer
> = {
  label: "Respuesta breve",
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

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
import { NumericAnswer, NumericDbAnswer, NumericQuestion } from "./types";

export const config: QuestionTypeConfig<
  NumericQuestion,
  NumericAnswer,
  NumericDbAnswer
> = {
  label: "Respuesta numérica",
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

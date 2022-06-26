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
import { SelectAnswer, SelectDbAnswer, SelectQuestion } from "./types";

export const config: QuestionTypeConfig<
  SelectQuestion,
  SelectAnswer,
  SelectDbAnswer
> = {
  label: "Lista desplegable",
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

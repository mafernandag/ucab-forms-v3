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
import { CheckboxAnswer, CheckboxDbAnswer, CheckboxQuestion } from "./types";

export const config: QuestionTypeConfig<
  CheckboxQuestion,
  CheckboxAnswer,
  CheckboxDbAnswer
> = {
  label: "Selección multiple",
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

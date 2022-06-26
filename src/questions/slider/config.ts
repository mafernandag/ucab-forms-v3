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
import { SliderAnswer, SliderDbAnswer, SliderQuestion } from "./types";

export const config: QuestionTypeConfig<
  SliderQuestion,
  SliderAnswer,
  SliderDbAnswer
> = {
  label: "Escala lineal",
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

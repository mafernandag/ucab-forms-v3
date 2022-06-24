import {
  PreviewProps,
  QuestionProps,
  QuestionWithOther,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface RadioQuestion extends QuestionWithOther {}

export type RadioAnswer = string;

export type RadioDbAnswer = string;

export type RadioPreviewProps = PreviewProps<RadioQuestion>;

export type RadioSettingsProps = SettingsProps<RadioQuestion>;

export type RadioQuestionProps = QuestionProps<RadioQuestion, RadioAnswer>;

export type RadioStatProps = StatProps<RadioQuestion, RadioDbAnswer>;

export type RadioResponseByQuestionProps = ResponseByQuestionProps<
  RadioQuestion,
  RadioDbAnswer
>;

export type RadioResponseByPersonProps = ResponseByPersonProps<
  RadioQuestion,
  RadioDbAnswer
>;

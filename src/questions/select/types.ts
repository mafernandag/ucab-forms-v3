import {
  PreviewProps,
  QuestionProps,
  QuestionWithOptions,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface SelectQuestion extends QuestionWithOptions {}

export type SelectAnswer = string;

export type SelectDbAnswer = string;

export type SelectPreviewProps = PreviewProps<SelectQuestion>;

export type SelectSettingsProps = SettingsProps<SelectQuestion>;

export type SelectQuestionProps = QuestionProps<SelectQuestion, SelectAnswer>;

export type SelectStatProps = StatProps<SelectQuestion, SelectDbAnswer>;

export type SelectResponseByQuestionProps = ResponseByQuestionProps<
  SelectQuestion,
  SelectDbAnswer
>;

export type SelectResponseByPersonProps = ResponseByPersonProps<
  SelectQuestion,
  SelectDbAnswer
>;

import {
  PreviewProps,
  QuestionProps,
  QuestionWithOther,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface CheckboxQuestion extends QuestionWithOther {}

export type CheckboxAnswer = string[];

export type CheckboxDbAnswer = string[];

export type CheckboxPreviewProps = PreviewProps<CheckboxQuestion>;

export type CheckboxSettingsProps = SettingsProps<CheckboxQuestion>;

export type CheckboxQuestionProps = QuestionProps<
  CheckboxQuestion,
  CheckboxAnswer
>;

export type CheckboxStatProps = StatProps<CheckboxQuestion, CheckboxDbAnswer>;

export type CheckboxResponseByQuestionProps = ResponseByQuestionProps<
  CheckboxQuestion,
  CheckboxDbAnswer
>;

export type CheckboxResponseByPersonProps = ResponseByPersonProps<
  CheckboxQuestion,
  CheckboxDbAnswer
>;

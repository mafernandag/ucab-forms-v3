import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface NumericQuestion extends BaseQuestion {}

export type NumericAnswer = string;

export type NumericDbAnswer = string;

export type NumericPreviewProps = PreviewProps<NumericQuestion>;

export type NumericSettingsProps = SettingsProps<NumericQuestion>;

export type NumericQuestionProps = QuestionProps<
  NumericQuestion,
  NumericAnswer
>;

export type NumericStatProps = StatProps<NumericQuestion, NumericAnswer>;

export type NumericResponseByQuestionProps = ResponseByQuestionProps<
  NumericQuestion,
  NumericDbAnswer
>;

export type NumericResponseByPersonProps = ResponseByPersonProps<
  NumericQuestion,
  NumericDbAnswer
>;

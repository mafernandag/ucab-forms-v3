import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface RatingQuestion extends BaseQuestion {}

export type RatingAnswer = number | "";

export type RatingDbAnswer = number | "";

export type RatingPreviewProps = PreviewProps<RatingQuestion>;

export type RatingSettingsProps = SettingsProps<RatingQuestion>;

export type RatingQuestionProps = QuestionProps<RatingQuestion, RatingAnswer>;

export type RatingStatProps = StatProps<RatingQuestion, RatingDbAnswer>;

export type RatingResponseByQuestionProps = ResponseByQuestionProps<
  RatingQuestion,
  RatingDbAnswer
>;

export type RatingResponseByPersonProps = ResponseByPersonProps<
  RatingQuestion,
  RatingDbAnswer
>;

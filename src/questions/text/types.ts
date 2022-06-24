import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface TextQuestion extends BaseQuestion {
  specialType: string;
}

export type TextAnswer = string;

export type TextDbAnswer = string;

export type TextPreviewProps = PreviewProps<TextQuestion>;

export type TextSettingsProps = SettingsProps<TextQuestion>;

export type TextQuestionProps = QuestionProps<TextQuestion, TextAnswer>;

export type TextStatProps = StatProps<TextQuestion, TextAnswer>;

export type TextResponseByQuestionProps = ResponseByQuestionProps<
  TextQuestion,
  TextDbAnswer
>;

export type TextResponseByPersonProps = ResponseByPersonProps<
  TextQuestion,
  TextDbAnswer
>;

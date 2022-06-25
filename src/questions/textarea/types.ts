import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface TextareaQuestion extends BaseQuestion {
  specialType: string;
}

export type TextareaAnswer = string;

export type TextareaDbAnswer = string;

export type TextareaPreviewProps = PreviewProps<TextareaQuestion>;

export type TextareaSettingsProps = SettingsProps<TextareaQuestion>;

export type TextareaQuestionProps = QuestionProps<
  TextareaQuestion,
  TextareaAnswer
>;

export type TextareaStatProps = StatProps<TextareaQuestion, TextareaDbAnswer>;

export type TextareaResponseByQuestionProps = ResponseByQuestionProps<
  TextareaQuestion,
  TextareaDbAnswer
>;

export type TextareaResponseByPersonProps = ResponseByPersonProps<
  TextareaQuestion,
  TextareaDbAnswer
>;

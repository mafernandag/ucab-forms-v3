import {
  PreviewProps,
  QuestionProps,
  QuestionWithOptions,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface SortableQuestion extends QuestionWithOptions {}

export type SortableAnswer = string[];

export type SortableDbAnswer = string[];

export type SortablePreviewProps = PreviewProps<SortableQuestion>;

export type SortableSettingsProps = SettingsProps<SortableQuestion>;

export type SortableQuestionProps = QuestionProps<
  SortableQuestion,
  SortableAnswer
>;

export type SortableStatProps = StatProps<SortableQuestion, SortableDbAnswer>;

export type SortableResponseByQuestionProps = ResponseByQuestionProps<
  SortableQuestion,
  SortableDbAnswer
>;

export type SortableResponseByPersonProps = ResponseByPersonProps<
  SortableQuestion,
  SortableDbAnswer
>;

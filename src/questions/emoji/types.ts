import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface EmojiQuestion extends BaseQuestion {}

export type EmojiAnswer = number | "";

export type EmojiDbAnswer = number | "";

export type EmojiPreviewProps = PreviewProps<EmojiQuestion>;

export type EmojiSettingsProps = SettingsProps<EmojiQuestion>;

export type EmojiQuestionProps = QuestionProps<EmojiQuestion, EmojiAnswer>;

export type EmojiStatProps = StatProps<EmojiQuestion, EmojiDbAnswer>;

export type EmojiResponseByQuestionProps = ResponseByQuestionProps<
  EmojiQuestion,
  EmojiDbAnswer
>;

export type EmojiResponseByPersonProps = ResponseByPersonProps<
  EmojiQuestion,
  EmojiDbAnswer
>;

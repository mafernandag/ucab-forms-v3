import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface SliderQuestion extends BaseQuestion {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export type SliderAnswer = number | "";

export type SliderDbAnswer = number | "";

export type SliderPreviewProps = PreviewProps<SliderQuestion>;

export type SliderSettingsProps = SettingsProps<SliderQuestion>;

export type SliderQuestionProps = QuestionProps<SliderQuestion, SliderAnswer>;

export type SliderStatProps = StatProps<SliderQuestion, SliderDbAnswer>;

export type SliderResponseByQuestionProps = ResponseByQuestionProps<
  SliderQuestion,
  SliderDbAnswer
>;

export type SliderResponseByPersonProps = ResponseByPersonProps<
  SliderQuestion,
  SliderDbAnswer
>;

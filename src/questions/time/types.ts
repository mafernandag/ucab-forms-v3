import { Timestamp } from "firebase/firestore";
import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface TimeQuestion extends BaseQuestion {}

export type TimeAnswer = Date | "";

export type TimeDbAnswer = Timestamp | "";

export type TimePreviewProps = PreviewProps<TimeQuestion>;

export type TimeSettingsProps = SettingsProps<TimeQuestion>;

export type TimeQuestionProps = QuestionProps<TimeQuestion, TimeAnswer>;

export type TimeStatProps = StatProps<TimeQuestion, TimeDbAnswer>;

export type TimeResponseByQuestionProps = ResponseByQuestionProps<
  TimeQuestion,
  TimeDbAnswer
>;

export type TimeResponseByPersonProps = ResponseByPersonProps<
  TimeQuestion,
  TimeDbAnswer
>;

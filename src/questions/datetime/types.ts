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

export interface DateTimeQuestion extends BaseQuestion {}

export type DateTimeAnswer = Date | "";

export type DateTimeDbAnswer = Timestamp | "";

export type DateTimePreviewProps = PreviewProps<DateTimeQuestion>;

export type DateTimeSettingsProps = SettingsProps<DateTimeQuestion>;

export type DateTimeQuestionProps = QuestionProps<
  DateTimeQuestion,
  DateTimeAnswer
>;

export type DateTimeStatProps = StatProps<DateTimeQuestion, DateTimeDbAnswer>;

export type DateTimeResponseByQuestionProps = ResponseByQuestionProps<
  DateTimeQuestion,
  DateTimeDbAnswer
>;

export type DateTimeResponseByPersonProps = ResponseByPersonProps<
  DateTimeQuestion,
  DateTimeDbAnswer
>;

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

export interface DateQuestion extends BaseQuestion {}

export type DateAnswer = Date | "";

export type DateDbAnswer = Timestamp | "";

export type DatePreviewProps = PreviewProps<DateQuestion>;

export type DateSettingsProps = SettingsProps<DateQuestion>;

export type DateQuestionProps = QuestionProps<DateQuestion, DateAnswer>;

export type DateStatProps = StatProps<DateQuestion, DateDbAnswer>;

export type DateResponseByQuestionProps = ResponseByQuestionProps<
  DateQuestion,
  DateDbAnswer
>;

export type DateResponseByPersonProps = ResponseByPersonProps<
  DateQuestion,
  DateDbAnswer
>;

import {
  BaseQuestion,
  PreviewProps,
  QuestionProps,
  ResponseByPersonProps,
  ResponseByQuestionProps,
  SettingsProps,
  StatProps,
} from "../types";

export interface FileQuestion extends BaseQuestion {
  multipleFiles: boolean;
}

export type FileAnswer = File[];

export type FileDbAnswer = {
  url: string;
  name: string;
  type: string;
}[];

export type FilePreviewProps = PreviewProps<FileQuestion>;

export type FileSettingsProps = SettingsProps<FileQuestion>;

export type FileQuestionProps = QuestionProps<FileQuestion, FileAnswer>;

export type FileStatProps = StatProps<FileQuestion, FileDbAnswer>;

export type FileResponseByQuestionProps = ResponseByQuestionProps<
  FileQuestion,
  FileDbAnswer
>;

export type FileResponseByPersonProps = ResponseByPersonProps<
  FileQuestion,
  FileDbAnswer
>;

export interface BaseQuestion {
  id: string;
  title: string;
  type: string;
  required: boolean;
  index: number;
  sectionId: string;
}

export interface QuestionWithOptions extends BaseQuestion {
  options: string[];
  randomOrder: boolean;
}

export interface QuestionWithOther extends QuestionWithOptions {
  other: boolean;
}

export interface PreviewProps<T> {
  question: T;
}

export interface SettingsProps<T> {
  question: T;
  updateQuestion: (question: BaseQuestion) => void;
}

export interface QuestionProps<T, K> {
  question: T;
  answer: K;
  updateAnswer: (answer: K) => void;
}

export interface StatProps<T, K> {
  question: T;
  answers: Record<string, K>[];
}

export interface ResponseByQuestionProps<T, K> {
  question: T;
  value: K;
}

export interface ResponseByPersonProps<T, K> {
  question: T;
  value: K;
}

export interface QuestionTypeConfig<T, K, V> {
  label: string;
  preview: (props: PreviewProps<T>) => JSX.Element;
  settings: (props: SettingsProps<T>) => JSX.Element;
  question: (props: QuestionProps<T, K>) => JSX.Element;
  stat: (props: StatProps<T, V>) => JSX.Element;
  responseByQuestion: (props: ResponseByQuestionProps<T, V>) => JSX.Element;
  responseByPerson: (props: ResponseByPersonProps<T, V>) => JSX.Element;
  stringify: (value: V) => string;
  getInitializedAnswer: (question: T) => K;
  checkRequired: (value: K) => boolean;
  checkFormat: (value: K) => boolean;
  getInitializedFields: (question: BaseQuestion, newType: string) => T;
  alwaysRequired: boolean;
}

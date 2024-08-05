import { flatMap, flatMapDeep, pick, range } from "lodash";
import { Section } from "../types";
import { questionTypesConfig } from "./config";
import { DEFAULT_LABEL } from "./constants";
import { BaseQuestion, QuestionWithOptions } from "./types";

export const getBaseQuestion = (question: BaseQuestion) => {
  const baseQuestion: BaseQuestion = pick(question, [
    "id",
    "title",
    "type",
    "required",
    "index",
    "sectionId",
  ]);

  return baseQuestion;
};

export const getSectionLabels = (
  section: Section,
  questions: BaseQuestion[]
) => {
  if (section && section.dynamicLabels) {
    const questionId = section.dynamicLabelsQuestion;
    const question = questions.find((question) => question.id === questionId);

    if (!question) {
      return [DEFAULT_LABEL];
    }

    const labels = (question as QuestionWithOptions).options;
    return labels;
  }

  return section?.labels?.length ? section.labels : [DEFAULT_LABEL];
};

export const isEmpty = (value: any) => {
  return (
    value === undefined || value === null || value === "" || value.length === 0
  );
};

interface GetDatasetsOptions {
  labels: string[];
  values: any[];
  questionId: string;
  answers: Record<string, Record<string, any[]>>[];
  other?: boolean;
}

export const getDatasets = (options: GetDatasetsOptions) => {
  const { labels, values, questionId, answers, other = false } = options;

  return labels.map((label) => {
    const flattenedAnswers = flatMapDeep(answers, (answer) => {
      return answer[questionId]?.[label];
    });

    const dataset = {
      label,
      data: values.map((value) => {
        return flattenedAnswers.filter((answer) => answer === value).length;
      }),
    };

    if (other) {
      dataset.data.push(
        flattenedAnswers.filter((answer) => {
          return !values.includes(answer) && !isEmpty(answer);
        }).length
      );
    }

    return dataset;
  });
};

interface GetRowsOptions {
  labels: string[];
  question: BaseQuestion;
  answers: Record<string, Record<string, any[]>>[];
}

export const getRows = ({ labels, question, answers }: GetRowsOptions) => {
  const columns: Record<string, string[]> = {};

  labels.forEach((label) => {
    const flattenedAnswers = flatMap(answers, (answer) => {
      return answer[question.id]?.[label];
    });

    const filteredAnswers = flattenedAnswers.filter(Boolean);
    columns[label] = filteredAnswers;
  });

  const maxLength = Math.max(
    ...Object.values(columns).map((column) => column.length)
  );

  const type = question.type;
  const stringify = questionTypesConfig[type].stringify;

  const rows = range(maxLength).map((i) => {
    const row: Record<string, string> = {};
    labels.forEach((label) => {
      if (columns[label][i]) {
        row[label] = stringify(columns[label][i]);
      }
      row[label] = row[label] || "";
    });
    return row;
  });

  return rows;
};

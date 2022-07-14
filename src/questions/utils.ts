import { pick } from "lodash";
import { Section } from "../types";
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
  sections: Section[],
  questions: BaseQuestion[]
) => {
  if (section.dynamicLabels) {
    const label = section.dynamicLabelsSectionLabel;
    const sectionId = section.dynamicLabelsSection;
    const questionId = section.dynamicLabelsQuestion;

    const dynamicLabelsSection = sections.find(
      (section) => section.id === sectionId
    );

    if (!dynamicLabelsSection) {
      return [DEFAULT_LABEL];
    }

    const validLabel =
      dynamicLabelsSection.labels.includes(label) ||
      (!label && dynamicLabelsSection.labels.length === 0);

    if (!validLabel) {
      return [DEFAULT_LABEL];
    }

    const dynamicLabelsQuestion = questions.find(
      (question) => question.id === questionId
    );

    if (
      !dynamicLabelsQuestion ||
      dynamicLabelsQuestion.sectionId !== sectionId
    ) {
      return [DEFAULT_LABEL];
    }

    const labels = (dynamicLabelsQuestion as QuestionWithOptions).options;
    return labels;
  }

  return section.labels.length ? section.labels : [DEFAULT_LABEL];
};

export const isEmpty = (value: any) => {
  return (
    value === undefined || value === null || value === "" || value.length === 0
  );
};

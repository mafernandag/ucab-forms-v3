import { castArray } from "lodash";
import { questionConfig } from "../../questions";
import { DEFAULT_LABEL } from "../../questions/constants";
import { BaseQuestion, QuestionWithOptions } from "../../questions/types";
import { isEmpty } from "../../questions/utils";
import { FormToRespond, Section } from "../../types";
import { Page } from "./types";

export const getLabels = (
  section: Section,
  answers: Record<string, any>,
  questions: BaseQuestion[]
) => {
  if (section.dynamicLabels) {
    const label = section.dynamicLabelsSectionLabel || DEFAULT_LABEL;
    const answer = answers[section.dynamicLabelsQuestion as string]?.[label];

    if (isEmpty(answer)) {
      return [];
    }

    const dynamicLabels = castArray(answer);

    const question = questions.find(
      (question) => question.id === section.dynamicLabelsQuestion
    ) as QuestionWithOptions | undefined;

    const validLabels = dynamicLabels.filter((label) => {
      return question?.options.includes(label);
    });

    return validLabels;
  }

  return section.labels.length ? section.labels : [DEFAULT_LABEL];
};

export const getPages = (form: FormToRespond, answers: Record<string, any>) => {
  const pages: Page[] = [];

  form.sections.forEach((section) => {
    const sectionLabels = getLabels(section, answers, form.questions);
    const sectionQuestions = form.questions.filter(
      (question) => question.sectionId === section.id
    );

    sectionLabels.forEach((label) => {
      pages.push({
        section,
        label,
        questions: sectionQuestions,
      });
    });
  });

  return pages;
};

export const getAnswers = (pages: Page[], answers: Record<string, any>) => {
  const newAnswers: Record<string, any> = {};

  pages.forEach((page) => {
    page.questions.forEach((question) => {
      const type = question.type;
      const getInitializedAnswer = questionConfig[type].getInitializedAnswer;

      const answer = answers[question.id]?.[page.label];
      const newAnswer = answer ?? getInitializedAnswer(question);

      newAnswers[question.id] = {
        ...newAnswers[question.id],
        [page.label]: newAnswer,
      };
    });
  });

  return newAnswers;
};

import { castArray, isNil, range } from "lodash";
import { questionConfig } from "../../questions";
import { questionTypesConfig } from "../../questions/config";
import { DEFAULT_LABEL } from "../../questions/constants";
import { BaseQuestion, QuestionWithOptions } from "../../questions/types";
import { isEmpty } from "../../questions/utils";
import { FormToRespond, Section } from "../../types";
import { Page } from "./types";

export const getLabels = (
  section: Section,
  answers: Record<string, Record<string, any[]>>,
  questions: BaseQuestion[]
) => {
  if (section.dynamicLabels) {
    const label = section.dynamicLabelsSectionLabel || DEFAULT_LABEL;
    const answer = answers[section.dynamicLabelsQuestion as string]?.[label][0];

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

const getTitleAndSubtitle = (section: Section, label: string, i: number) => {
  let title = "";
  let subtitle = "";

  if (section.iterable) {
    if (label === DEFAULT_LABEL) {
      title = section.title;
    } else {
      title = `${section.title} - ${label}`;
    }

    if (i > 0) {
      subtitle = section.prefix ? `${section.prefix} ${i}` : `${i}`;
    }
  } else {
    title = section.title;
    if (label !== DEFAULT_LABEL) {
      subtitle = label;
    }
  }

  return { title, subtitle };
};

export const getPagesData = (
  form: FormToRespond,
  previousAnswers: Record<string, Record<string, any[]>>,
  previousNumberMap: Record<string, number>
) => {
  const pages: Page[] = [];
  const newAnswers: Record<string, Record<string, any[]>> = {};
  const newNumberMap: Record<string, number> = {};

  form.sections.forEach((section) => {
    if (section.conditioned) {
      const questionId = section.conditionedQuestion as string;
      const label = section.conditionedSectionLabel || DEFAULT_LABEL;

      const answer = newAnswers[questionId]?.[label]?.[0];

      if (isNil(answer)) {
        return;
      }

      const question = form.questions.find(
        (question) => question.id === questionId
      );

      if (!question) {
        return;
      }

      const getSerializableValue =
        questionTypesConfig[question.type].getSerializableValue;

      const expectedValue = getSerializableValue(answer);
      const strigifiedExpectedValue = JSON.stringify(expectedValue);

      const value = getSerializableValue(section.conditionedValue);
      const strigifiedValue = JSON.stringify(value);

      if (strigifiedExpectedValue !== strigifiedValue) {
        return;
      }
    }

    const sectionLabels = getLabels(section, newAnswers, form.questions);
    const sectionQuestions = form.questions.filter(
      (question) => question.sectionId === section.id
    );

    sectionLabels.forEach((label) => {
      const key = `${section.id}-${label}`;
      const number = previousNumberMap[key] ?? 0;
      newNumberMap[key] = number;

      const shift = section.iterable ? 0 : 1;

      range(shift, shift + number + 1).forEach((i) => {
        const isPageWithNumber = section.iterable && i === 0;
        const questions = isPageWithNumber ? [] : sectionQuestions;

        questions.forEach((question) => {
          const type = question.type;
          const getInitializedAnswer =
            questionConfig[type].getInitializedAnswer;

          const newAnswer: Record<string, any>[] = [
            ...(newAnswers[question.id]?.[label] ?? []),
          ];

          const answer = previousAnswers[question.id]?.[label]?.[i - 1];
          newAnswer[i - 1] = answer ?? getInitializedAnswer(question);

          newAnswers[question.id] = {
            ...newAnswers[question.id],
            [label]: newAnswer,
          };
        });

        const { title, subtitle } = getTitleAndSubtitle(section, label, i);

        pages.push({
          title,
          subtitle,
          section,
          label,
          questions,
          number: i,
        });
      });
    });
  });

  return { pages, newAnswers, newNumberMap };
};

import { castArray, range } from "lodash";
import { questionConfig } from "../../questions";
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
  const newAnswers: Record<string, any> = {};
  const newNumberMap: Record<string, number> = {};

  form.sections.forEach((section) => {
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

// export const getAnswers = (
//   pages: Page[],
//   answers: Record<string, any>,
//   numberMap: Record<string, number>
// ) => {
//   const newAnswers: Record<string, any> = {};

//   pages.forEach((page) => {
//     if (page.section.iterable && page.number === 0) {
//       return;
//     }

//     page.questions.forEach((question) => {
//       const type = question.type;
//       const getInitializedAnswer = questionConfig[type].getInitializedAnswer;

//       const key = `${page.section.id}-${page.label}`;
//       const number = numberMap[key];

//       const newAnswer: Record<string, any>[] = [];

//       range(number).forEach((i) => {
//         const answer = answers[question.id]?.[page.label]?.[i];
//         newAnswer[i] = answer ?? getInitializedAnswer(question);
//       });

//       newAnswers[question.id] = {
//         ...newAnswers[question.id],
//         [page.label]: newAnswer,
//       };
//     });
//   });

//   return newAnswers;
// };

// export const getNumberMap = (
//   pages: Page[],
//   numberMap: Record<string, number>
// ) => {
//   const newNumberMap: Record<string, number> = {};

//   pages.forEach((page) => {
//     const key = `${page.section.id}-${page.label}`;
//     const number = numberMap[key] ?? 0;

//     newNumberMap[key] = number;
//   });

//   return newNumberMap;
// };

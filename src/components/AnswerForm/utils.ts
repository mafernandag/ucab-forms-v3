import { castArray } from "lodash";
import { DEFAULT_LABEL } from "../../questions/constants";
import { BaseQuestion, QuestionWithOptions } from "../../questions/types";
import { isEmpty } from "../../questions/utils";
import { Section } from "../../types";

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

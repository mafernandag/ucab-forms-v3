import { castArray } from "lodash";
import { DEFAULT_LABEL } from "../../questions/constants";
import { isEmpty } from "../../questions/utils";
import { Section } from "../../types";

export const getSectionLabels = (
  section: Section,
  answers: Record<string, any>
) => {
  if (section.dynamicLabels) {
    const label = section.dynamicLabelsSectionLabel || DEFAULT_LABEL;
    const answer = answers[section.dynamicLabelsQuestion]?.[label];

    if (isEmpty(answer)) {
      return [];
    }

    const dynamicLabels = castArray(answer);
    return dynamicLabels;
  }

  return section.labels.length ? section.labels : [DEFAULT_LABEL];
};

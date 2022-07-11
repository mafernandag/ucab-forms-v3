import { pick } from "lodash";
import { Section } from "../types";
import { DEFAULT_LABEL } from "./constants";
import { BaseQuestion } from "./types";

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

export const getSectionLabels = (section: Section) => {
  return section.labels.length ? section.labels : [DEFAULT_LABEL];
};

export const isEmpty = (value: any) => {
  return (
    value === undefined || value === null || value === "" || value.length === 0
  );
};

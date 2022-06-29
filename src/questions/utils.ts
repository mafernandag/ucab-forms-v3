import { pick } from "lodash";
import { BaseQuestion } from "./types";

export const getBaseQuestion = (question: BaseQuestion) => {
  const baseQuestion: BaseQuestion = pick(question, [
    "id",
    "title",
    "type",
    "required",
    "conditioned",
    "index",
    "sectionId",
  ]);

  return baseQuestion;
};

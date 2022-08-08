import { isEmpty } from "../../../questions/utils";

export const isEmptyAnswer = (
  answer: Record<string, any[]> | undefined,
  labels: string[]
) => {
  return (
    !answer ||
    labels.every((label) => !answer[label] || answer[label].every(isEmpty))
  );
};

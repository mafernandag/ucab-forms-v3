import { questionConfig } from "../questions";

export const getResponseCountText = (count) => {
  if (count === 1) {
    return "1 respuesta";
  }

  return `${count} respuestas`;
};

export const stringifyAnswers = (answers, questions) => {
  const newAnswers = {};

  for (const questionId in answers) {
    const answer = answers[questionId];

    if (!answer) {
      continue;
    }

    const question = questions.find((q) => q.id === questionId);

    if (!question) {
      continue;
    }

    for (const label in answer) {
      const stringify = questionConfig[question.type].stringify;
      const value = stringify(answer[label]);
      newAnswers[`${questionId}-${label}`] = value !== "" ? value : null;
    }
  }

  return newAnswers;
};

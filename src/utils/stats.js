import { questionConfig } from "../questions";

export const getResponseCountText = (count) => {
  if (count === 1) {
    return "1 respuesta";
  }

  return `${count} respuestas`;
};

export const getAnswersCountText = (count) => {
  if (count === 1) {
    return "1 persona";
  }

  return `${count} personas`;
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
      const value = answer[label].map((v) => stringify(v));
      newAnswers[`${questionId}-${label}`] = value.some(Boolean) ? value : null;
    }
  }

  return newAnswers;
};

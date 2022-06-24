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

    if (answer !== 0 && (!answer || answer.length === 0)) {
      newAnswers[questionId] = null;
      continue;
    }

    const question = questions.find((q) => q.id === questionId);

    if (!question) {
      continue;
    }

    const stringify = questionConfig[question.type].stringify;
    newAnswers[questionId] = stringify(answer);
  }

  return newAnswers;
};

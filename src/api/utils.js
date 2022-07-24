export const convertAnswersAfterGet = (answers) => {
  for (const questionId in answers) {
    for (const label in answers[questionId]) {
      const answer = [];
      for (const index in answers[questionId][label]) {
        answer[index] = answers[questionId][label][index];
      }

      answers[questionId][label] = answer;
    }
  }
};

export const convertAnswersBeforeSet = (answers) => {
  for (const questionId in answers) {
    for (const label in answers[questionId]) {
      const answer = {};
      for (const index in answers[questionId][label]) {
        answer[index] = answers[questionId][label][index];
      }

      answers[questionId][label] = answer;
    }
  }
};

import { Box, Typography } from "@mui/material";
import RequiredMark from "./RequiredMark";
import { questionConfig } from "../questions";

const Question = ({ label, answers, question, setAnswers, number }) => {
  const type = question.type;
  const MyQuestion = questionConfig[type].Question;

  const answer = answers[question.id][label][number - 1];

  const updateAnswer = (answer) => {
    const newAnswers = {
      ...answers,
      [question.id]: {
        ...answers[question.id],
        [label]: [...answers[question.id][label]],
      },
    };

    newAnswers[question.id][label][number - 1] = answer;
    setAnswers(newAnswers);
  };

  return (
    <Box>
      <Typography mb={2}>
        {question.title}
        <RequiredMark question={question} />
      </Typography>
      <MyQuestion
        question={question}
        answer={answer}
        updateAnswer={updateAnswer}
      />
    </Box>
  );
};

export default Question;

import { Box, Typography } from "@mui/material";
import RequiredMark from "./RequiredMark";
import { questionConfig } from "../questions";

const Question = ({ label, answers, question, setAnswers }) => {
  const type = question.type;
  const MyQuestion = questionConfig[type].Question;

  const answer = answers[question.id][label];

  const updateAnswer = (answer) => {
    setAnswers({
      ...answers,
      [question.id]: {
        ...answers[question.id],
        [label]: answer,
      },
    });
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

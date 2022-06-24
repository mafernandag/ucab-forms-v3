import { Box, Typography } from "@mui/material";
import RequiredMark from "./RequiredMark";
import { questionConfig } from "../questions";

const Question = ({ answers, question, setAnswers }) => {
  const type = question.type;
  const MyQuestion = questionConfig[type].question;

  const answer = answers[question.id];

  const updateAnswer = (answer) => {
    setAnswers({ ...answers, [question.id]: answer });
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

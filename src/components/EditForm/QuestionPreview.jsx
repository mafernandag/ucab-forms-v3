import { useMemo } from "react";
import { Card, Typography } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import AllQuestionsPreview from "../AllQuestionsPreview";
import RequiredMark from "../RequiredMark";

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { currentQuestion, setCurrentQuestion } = useForm();

  return useMemo(() => {
    const handleClick = () => {
      setCurrentQuestion(question.id);
      setOpenDrawer(true);
    };

    return (
      <Card
        sx={{ p: 3, cursor: "pointer" }}
        onClick={handleClick}
        elevation={question.id === currentQuestion ? 5 : 0}
        variant={question.id === currentQuestion ? "elevation" : "outlined"}
      >
        <Typography mb={2}>
          {question.title}
          <RequiredMark question={question} />
        </Typography>
        <AllQuestionsPreview question={question} />
      </Card>
    );
  }, [currentQuestion, question, setOpenDrawer, setCurrentQuestion]);
};

export default EditQuestion;

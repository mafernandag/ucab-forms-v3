import { useMemo } from "react";
import { Box, Fab, Stack, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { defaultQuestion } from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import { insertQuestion } from "../../api/questions";
import QuestionPreview from "./QuestionPreview";
import { calculateNewIndex } from "../../utils/questions";

const Questions = ({ setOpenDrawer }) => {
  const { form, questions, current, setCurrent } = useForm();

  return useMemo(() => {
    const addQuestion = () => {
      const newIndex = calculateNewIndex(questions, current);

      const newQuestion = { index: newIndex, ...defaultQuestion };

      const questionId = insertQuestion(form.id, newQuestion);

      setCurrent(questionId);
      setOpenDrawer(true);
    };

    return (
      <Box>
        <Stack spacing={2}>
          {questions.map((question) => (
            <QuestionPreview
              key={question.id}
              question={question}
              setOpenDrawer={setOpenDrawer}
            />
          ))}
        </Stack>
        <Tooltip title="Agregar pregunta" arrow>
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: "8%", right: "5%" }}
            onClick={addQuestion}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Box>
    );
  }, [current, form.id, questions, setCurrent, setOpenDrawer]);
};

export default Questions;

import { Box, Button } from "@mui/material";
import { Slider } from "./components";
import { SliderQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: SliderQuestionProps) => {
  const activate = () => {
    updateAnswer(question.min);
  };

  const deactivate = () => {
    updateAnswer("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
      <Slider
        disabled={answer === ""}
        question={question}
        value={answer || question.min}
        onChange={updateAnswer}
      />
      {!question.required &&
        (answer === "" ? (
          <Button sx={{ alignSelf: "flex-end" }} onClick={activate}>
            Activar selección
          </Button>
        ) : (
          <Button sx={{ alignSelf: "flex-end" }} onClick={deactivate}>
            Borrar selección
          </Button>
        ))}
    </Box>
  );
};

export default Question;

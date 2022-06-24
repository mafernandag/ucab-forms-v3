import { TextField } from "@mui/material";
import { TextareaQuestionProps } from "./types";

const Question = ({
  answer,
  question,
  updateAnswer,
}: TextareaQuestionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateAnswer(value);
  };

  return (
    <TextField
      variant="standard"
      placeholder="Respuesta"
      multiline
      fullWidth
      required={question.required}
      value={answer}
      onChange={handleChange}
      type={question.specialType === "email" ? "email" : "text"}
      autoComplete={question.specialType}
    />
  );
};

export default Question;

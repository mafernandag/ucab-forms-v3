import { TextField } from "@mui/material";
import { TextQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: TextQuestionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateAnswer(value);
  };

  return (
    <TextField
      variant="standard"
      placeholder="Respuesta"
      required={question.required}
      value={answer}
      onChange={handleChange}
      type={question.specialType === "email" ? "email" : "text"}
      autoComplete={question.specialType}
    />
  );
};

export default Question;

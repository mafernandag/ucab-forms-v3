import { TextField } from "@mui/material";
import { NumericQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: NumericQuestionProps) => {
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
      type="number"
      inputProps={{
        step: "0.01",
      }}
    />
  );
};

export default Question;

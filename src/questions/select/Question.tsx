import { Divider, MenuItem, SelectChangeEvent } from "@mui/material";
import { SelectQuestionProps } from "./types";
import { Select } from "./components";

const Question = ({ answer, question, updateAnswer }: SelectQuestionProps) => {
  const handleChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    updateAnswer(value);
  };

  return (
    <Select
      variant="standard"
      required={question.required}
      displayEmpty
      value={answer}
      onChange={handleChange}
    >
      <MenuItem sx={{ color: "text.secondary" }} value="">
        Seleccione una opción
      </MenuItem>
      <Divider />
      {question.options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Question;

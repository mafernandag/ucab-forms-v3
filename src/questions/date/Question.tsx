import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { DateQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: DateQuestionProps) => {
  // TODO: Check the possibility of null value
  const handleChange = (value: Date | null) => {
    updateAnswer(value as Date);
  };

  return (
    <DatePicker
      value={answer || null}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          required={question.required}
        />
      )}
      okText="Aceptar"
      cancelText="Cancelar"
      toolbarTitle="Seleccionar fecha"
    />
  );
};

export default Question;

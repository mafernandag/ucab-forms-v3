import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { DateQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: DateQuestionProps) => {
  const handleChange = (value: Date | null) => {
    if (!value) {
      return updateAnswer("");
    }

    updateAnswer(value);
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

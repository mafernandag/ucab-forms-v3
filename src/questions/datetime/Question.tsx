import { DateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { DateTimeQuestionProps } from "./types";

const Question = ({
  answer,
  question,
  updateAnswer,
}: DateTimeQuestionProps) => {
  // TODO: Check the possibility of null value
  const handleChange = (value: Date | null) => {
    updateAnswer(value as Date);
  };

  return (
    <DateTimePicker
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
      toolbarTitle="Seleccionar fecha y hora"
    />
  );
};

export default Question;

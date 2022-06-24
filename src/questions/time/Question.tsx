import { TimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { TimeQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: TimeQuestionProps) => {
  // TODO: Check the possibility of null value
  const handleChange = (value: Date | null) => {
    updateAnswer(value as Date);
  };

  return (
    <TimePicker
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
      toolbarTitle="Seleccionar hora"
    />
  );
};

export default Question;

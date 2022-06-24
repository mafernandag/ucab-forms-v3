import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { BaseQuestion } from "../types";

interface Props {
  disabled?: boolean;
  question: BaseQuestion;
  updateQuestion: (question: BaseQuestion) => void;
}

const RequiredCheckbox = ({ disabled, question, updateQuestion }: Props) => {
  const handleChange = (e: React.SyntheticEvent, checked: boolean) => {
    const newQuestion = { ...question, required: checked };
    updateQuestion(newQuestion);
  };

  return (
    <Box>
      <FormControlLabel
        control={<Checkbox />}
        disabled={disabled}
        checked={question.required}
        onChange={handleChange}
        label="Obligatoria"
      />
    </Box>
  );
};

export default RequiredCheckbox;

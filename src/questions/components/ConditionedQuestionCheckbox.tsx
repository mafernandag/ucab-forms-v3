import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { ConditionedQuestion } from "../types";

interface Props {
  disabled?: boolean;
  question: ConditionedQuestion;
  updateQuestion: (question: ConditionedQuestion) => void;
}

const ConditionedQuestionCheckbox = ({
  disabled,
  question,
  updateQuestion,
}: Props) => {
  const handleChange = (e: React.SyntheticEvent, checked: boolean) => {
    const newQuestion: ConditionedQuestion = {
      ...question,
      conditioned: checked,
    };

    updateQuestion(newQuestion);
  };

  return (
    <Box>
      <FormControlLabel
        control={<Checkbox />}
        disabled={disabled}
        checked={question.conditioned}
        onChange={handleChange}
        label="Pregunta condicionada"
      />
    </Box>
  );
};

export default ConditionedQuestionCheckbox;

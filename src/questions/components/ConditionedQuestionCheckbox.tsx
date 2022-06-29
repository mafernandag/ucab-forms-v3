import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { ConditionedQuestion } from "../types";

interface Props {
  question: ConditionedQuestion;
  updateQuestion: (question: ConditionedQuestion) => void;
}

const ConditionedQuestionCheckbox = ({ question, updateQuestion }: Props) => {
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
        checked={question.conditioned}
        onChange={handleChange}
        label="Pregunta condicionada"
      />
    </Box>
  );
};

export default ConditionedQuestionCheckbox;

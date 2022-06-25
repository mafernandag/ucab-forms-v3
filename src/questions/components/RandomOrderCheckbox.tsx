import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { QuestionWithOptions } from "../types";

interface Props {
  question: QuestionWithOptions;
  updateQuestion: (question: QuestionWithOptions) => void;
}

const RandomOrderCheckbox = ({ question, updateQuestion }: Props) => {
  const handleChange = (e: React.SyntheticEvent, checked: boolean) => {
    const newQuestion: QuestionWithOptions = {
      ...question,
      randomOrder: checked,
    };
    updateQuestion(newQuestion);
  };

  return (
    <Box>
      <FormControlLabel
        control={<Checkbox />}
        checked={question.randomOrder}
        onChange={handleChange}
        label="Orden aleatorio"
      />
    </Box>
  );
};

export default RandomOrderCheckbox;

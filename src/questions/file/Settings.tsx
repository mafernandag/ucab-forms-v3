import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { RequiredCheckbox } from "../components";
import { FileSettingsProps } from "./types";

const Settings = ({ question, updateQuestion }: FileSettingsProps) => {
  const handleChange = (e: React.SyntheticEvent, checked: boolean) => {
    const newQuestion = { ...question, multipleFiles: checked };
    updateQuestion(newQuestion);
  };

  return (
    <Box>
      <FormControlLabel
        control={<Checkbox />}
        checked={question.multipleFiles}
        onChange={handleChange}
        label="Múltiples archivos"
      />
      <RequiredCheckbox question={question} updateQuestion={updateQuestion} />
    </Box>
  );
};

export default Settings;

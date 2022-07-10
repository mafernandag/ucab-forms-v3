import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { CheckboxSettingsProps } from "./types";
import { RandomOrderCheckbox, RequiredCheckbox } from "../components";

const Settings = ({ question, updateQuestion }: CheckboxSettingsProps) => {
  const handleChangeOption =
    (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const option = e.target.value;
      const options = [...question.options];
      options[i] = option;

      const newQuestion = { ...question, options };
      updateQuestion(newQuestion);
    };

  const addOption = () => {
    const option = "Opción " + (question.options.length + 1);
    const options = [...question.options, option];

    const newQuestion = { ...question, options };
    updateQuestion(newQuestion);
  };

  const deleteOption = (i: number) => () => {
    const options = [...question.options];
    options.splice(i, 1);

    const newQuestion = { ...question, options };
    updateQuestion(newQuestion);
  };

  const addOther = () => {
    const newQuestion = { ...question, other: true };
    updateQuestion(newQuestion);
  };

  const removeOther = () => {
    const newQuestion = { ...question, other: false };
    updateQuestion(newQuestion);
  };

  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Opciones</FormLabel>
        <FormGroup sx={{ mb: 1 }}>
          {question.options.map((option, i) => (
            <Box
              key={i}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <FormControlLabel
                disabled
                control={<Checkbox />}
                value={option}
                label={
                  <TextField
                    variant="standard"
                    value={option}
                    onChange={handleChangeOption(i)}
                  />
                }
              />
              <Tooltip title="Eliminar opción" arrow>
                <IconButton onClick={deleteOption(i)}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
          {question.other && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormControlLabel
                disabled
                control={<Checkbox />}
                value="otros"
                label="Otros"
              />
              <Tooltip title="Eliminar" arrow>
                <IconButton onClick={removeOther}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </FormGroup>
        <Button size="small" onClick={addOption}>
          Agregar opción
        </Button>
        {!question.other && (
          <Button size="small" onClick={addOther}>
            Agregar "Otros"
          </Button>
        )}
      </FormControl>
      <Box>
        <RandomOrderCheckbox
          question={question}
          updateQuestion={updateQuestion}
        />
        <RequiredCheckbox question={question} updateQuestion={updateQuestion} />
      </Box>
    </>
  );
};

export default Settings;

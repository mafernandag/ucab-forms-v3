import {
  Box,
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  TextField,
  Tooltip,
  RadioGroup,
} from "@mui/material";
import {
  Clear as ClearIcon,
  ExitToAppRounded as GoToIcon,
} from "@mui/icons-material";
import { RadioSettingsProps } from "./types";
import RandomOrderCheckbox from "../components/RandomOrderCheckbox";
import { RequiredCheckbox } from "../components";
import ConditionedQuestion from "../components/ConditionedQuestionCheckbox";
import SelectSectionDialog from "../../components/EditForm/SelectSectionDialog";
import { useState } from "react";

const Settings = ({ question, updateQuestion }: RadioSettingsProps) => {
  const [openSelectSection, setOpenSelectSection] = useState(false);
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
  //Here should be according to the i question
  const goToSectionOption = () => {
    setOpenSelectSection(true);
  };
  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Opciones</FormLabel>
        <RadioGroup sx={{ mb: 1 }}>
          {question.options.map((option, i) => (
            <Box>
              <Box
                key={i}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  disabled
                  control={<Radio />}
                  value={option}
                  label={
                    <TextField
                      variant="standard"
                      value={option}
                      onChange={handleChangeOption(i)}
                    />
                  }
                />
                <Tooltip title="Eliminar">
                  <IconButton onClick={deleteOption(i)}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {question.conditioned && (
                <Button
                  variant="text"
                  startIcon={<GoToIcon />}
                  onClick={goToSectionOption}
                  size="small"
                >
                  Llevar a sección
                </Button>
              )}
            </Box>
          ))}
          {question.other && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <FormControlLabel
                disabled
                control={<Radio />}
                value="otros"
                label="Otros"
              />
              <Tooltip title="Eliminar">
                <IconButton onClick={removeOther}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </RadioGroup>
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
        {question.required && (
          <ConditionedQuestion
            question={question}
            updateQuestion={updateQuestion}
          />
        )}
      </Box>
      <SelectSectionDialog
        open={openSelectSection}
        setOpen={setOpenSelectSection}
      />
    </>
  );
};

export default Settings;

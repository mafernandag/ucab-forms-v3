import { Box, MenuItem, TextField } from "@mui/material";
import { RequiredCheckbox } from "../components";
import { sliderMinValues, sliderMaxValues } from "./constants";
import { SliderSettingsProps } from "./types";

const Settings = ({ question, updateQuestion }: SliderSettingsProps) => {
  const handleChange =
    (property: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newQuestion = { ...question, [property]: value };
      updateQuestion(newQuestion);
    };

  return (
    <>
      <Box>
        <TextField
          select
          variant="standard"
          label="Desde"
          value={question.min}
          onChange={handleChange("min")}
          sx={{ width: 100, mr: 2 }}
        >
          {sliderMinValues.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="standard"
          label="Hasta"
          value={question.max}
          onChange={handleChange("max")}
          sx={{ width: 100 }}
        >
          {sliderMaxValues.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <TextField
        variant="standard"
        value={question.minLabel}
        label={`Etiqueta para ${question.min} (opcional)`}
        onChange={handleChange("minLabel")}
      />
      <TextField
        variant="standard"
        label={`Etiqueta para ${question.max} (opcional)`}
        value={question.maxLabel}
        onChange={handleChange("maxLabel")}
      />
      <RequiredCheckbox question={question} updateQuestion={updateQuestion} />
    </>
  );
};

export default Settings;

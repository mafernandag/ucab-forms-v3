import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { CheckboxPreviewProps } from "./types";

const Preview = ({ question }: CheckboxPreviewProps) => {
  return (
    <FormGroup>
      {question.options.map((option, i) => (
        <FormControlLabel
          key={i}
          disabled
          value={option}
          control={<Checkbox />}
          label={option}
        />
      ))}
      {question.other && (
        <FormControlLabel
          disabled
          value="otros"
          control={<Checkbox />}
          label="Otros"
        />
      )}
    </FormGroup>
  );
};

export default Preview;

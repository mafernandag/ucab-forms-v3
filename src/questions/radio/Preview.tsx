import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { RadioPreviewProps } from "./types";

const Preview = ({ question }: RadioPreviewProps) => {
  return (
    <RadioGroup>
      {question.options.map((option, i) => (
        <FormControlLabel
          key={i}
          disabled
          value={option}
          control={<Radio />}
          label={option}
        />
      ))}
      {question.other && (
        <FormControlLabel
          disabled
          value="otros"
          control={<Radio />}
          label="Otros"
        />
      )}
    </RadioGroup>
  );
};

export default Preview;

import {
  Box,
  Slider as MuiSlider,
  SliderProps as MuiSliderProps,
  Typography,
} from "@mui/material";
import { SliderQuestion } from "../types";

type SliderProps = Omit<MuiSliderProps, "onChange"> & {
  question: SliderQuestion;
  onChange?: (value: number) => void;
};

interface SliderMark {
  value: number;
  label: number;
}

const Slider = ({ question, onChange, ...props }: SliderProps) => {
  const getSliderMarks = () => {
    const marks: SliderMark[] = [];

    for (let i = question.min; i <= question.max; i++) {
      marks.push({ value: i, label: i });
    }

    return marks;
  };

  const handleChange = (e: Event, value: number | number[]) => {
    onChange?.(value as number);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        align="center"
        variant="body2"
        sx={{ maxWidth: "25%", mb: 1 }}
      >
        {question.minLabel}
      </Typography>
      <MuiSlider
        valueLabelDisplay="auto"
        marks={getSliderMarks()}
        min={question.min}
        max={question.max}
        sx={{ mx: 2 }}
        onChange={handleChange}
        {...props}
      />
      <Typography
        align="center"
        variant="body2"
        sx={{ maxWidth: "25%", mb: 1 }}
      >
        {question.maxLabel}
      </Typography>
    </Box>
  );
};

export default Slider;

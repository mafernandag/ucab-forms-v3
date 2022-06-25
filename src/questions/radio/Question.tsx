import { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { RadioQuestionProps } from "./types";

const Question = ({ answer, question, updateAnswer }: RadioQuestionProps) => {
  const [other, setOther] = useState("");

  const handleChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateAnswer(value);
  };

  const handleChangeOther = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (answer === other) {
      updateAnswer(value);
    }

    setOther(e.target.value);
  };

  const handleReset = () => {
    updateAnswer("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <RadioGroup value={answer} onChange={handleChangeRadio}>
        {question.options.map((option, i) => (
          <FormControlLabel
            key={i}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
        {question.other && (
          <FormControlLabel
            value={other}
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Otros: </Typography>
                <TextField
                  variant="standard"
                  value={other}
                  onChange={handleChangeOther}
                />
              </Box>
            }
          />
        )}
      </RadioGroup>
      {!question.required && (
        <Button sx={{ alignSelf: "flex-end" }} onClick={handleReset}>
          Borrar selección
        </Button>
      )}
    </Box>
  );
};

export default Question;

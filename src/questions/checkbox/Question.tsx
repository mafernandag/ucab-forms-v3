import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { CheckboxAnswer, CheckboxQuestionProps } from "./types";

const Question = ({
  answer,
  question,
  updateAnswer,
}: CheckboxQuestionProps) => {
  const [other, setOther] = useState("");

  const handleChangeCheckbox =
    (option: string) => (e: React.SyntheticEvent, checked: boolean) => {
      let newAnswer: CheckboxAnswer;

      if (checked) {
        newAnswer = [...answer, option];
      } else {
        newAnswer = answer.filter((o) => o !== option);
      }

      updateAnswer(newAnswer);
    };

  const handleChangeOther = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (answer.includes(other)) {
      const newAnswer = answer.filter((o) => o !== other);
      newAnswer.push(value);
      updateAnswer(newAnswer);
    }

    setOther(e.target.value);
  };

  return (
    <FormGroup>
      {question.options.map((option, i) => (
        <FormControlLabel
          key={i}
          control={<Checkbox />}
          label={option}
          checked={answer.includes(option)}
          onChange={handleChangeCheckbox(option)}
        />
      ))}
      {question.other && (
        <FormControlLabel
          value={other}
          control={<Checkbox />}
          checked={answer.includes(other)}
          onChange={handleChangeCheckbox(other)}
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
    </FormGroup>
  );
};

export default Question;

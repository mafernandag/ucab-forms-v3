import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { sortBy } from "lodash";
import { CheckboxAnswer, CheckboxQuestionProps } from "./types";

const Question = ({
  answer,
  question,
  updateAnswer,
}: CheckboxQuestionProps) => {
  const getInitialState = () => {
    if (answer.every((value) => question.options.includes(value))) {
      return "";
    }

    return answer.find((value) => !question.options.includes(value)) || "";
  };

  const [other, setOther] = useState(getInitialState);

  const getNewAnswer = (answer: CheckboxAnswer, option: string) => {
    const selectedOptions = [...answer, option];
    return sortBy(selectedOptions, (option) => {
      const index = question.options.indexOf(option);
      return index === -1 ? Infinity : index;
    });
  };

  const handleChangeCheckbox =
    (option: string) => (e: React.SyntheticEvent, checked: boolean) => {
      let newAnswer: CheckboxAnswer;

      if (checked) {
        newAnswer = getNewAnswer(answer, option);
      } else {
        newAnswer = answer.filter((o) => o !== option);
      }

      updateAnswer(newAnswer);
    };

  const handleChangeOther = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (answer.includes(other)) {
      const filteredAnswer = answer.filter((o) => o !== other);
      const newAnswer = getNewAnswer(filteredAnswer, value);
      updateAnswer(newAnswer);
    }

    setOther(value);
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
              <Typography>Otro: </Typography>
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

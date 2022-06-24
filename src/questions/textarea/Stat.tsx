import { Typography } from "@mui/material";
import { TextareaStatProps } from "./types";

const Stat = ({ answers, question }: TextareaStatProps) => {
  return (
    <>
      {answers.map((answer, i) => (
        <Typography key={i} variant="body2">
          {answer[question.id]}
        </Typography>
      ))}
    </>
  );
};

export default Stat;

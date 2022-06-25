import { Typography } from "@mui/material";
import { TextStatProps } from "./types";

const Stat = ({ answers, question }: TextStatProps) => {
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

import { Typography } from "@mui/material";
import { TextareaResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: TextareaResponseByQuestionProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

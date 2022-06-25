import { Typography } from "@mui/material";
import { TextResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: TextResponseByQuestionProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

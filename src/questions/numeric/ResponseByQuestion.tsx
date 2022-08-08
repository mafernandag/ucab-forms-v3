import { Typography } from "@mui/material";
import { NumericResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: NumericResponseByQuestionProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

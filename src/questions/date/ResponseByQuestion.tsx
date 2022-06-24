import { Typography } from "@mui/material";
import { DateResponseByQuestionProps } from "./types";

// This works because "value" was already stringified in the ResponseByQuestion component
// We should probably use stringify here too
const ResponseByQuestion = ({ value }: DateResponseByQuestionProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

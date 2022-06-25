import { Typography } from "@mui/material";
import { TimeResponseByQuestionProps } from "./types";

// This works because "value" was already stringified in the ResponseByQuestion component
// We should probably use stringify here too
const ResponseByQuestion = ({ value }: TimeResponseByQuestionProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

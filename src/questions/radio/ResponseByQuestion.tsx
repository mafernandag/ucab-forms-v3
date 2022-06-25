import { Typography } from "@mui/material";
import { RadioResponseByPersonProps } from "./types";

const ResponseByQuestion = ({ value }: RadioResponseByPersonProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

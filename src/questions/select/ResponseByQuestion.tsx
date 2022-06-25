import { Typography } from "@mui/material";
import { SelectResponseByPersonProps } from "./types";

const ResponseByQuestion = ({ value }: SelectResponseByPersonProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByQuestion;

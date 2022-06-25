import { Typography } from "@mui/material";
import { TextareaResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: TextareaResponseByPersonProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByPerson;

import { Typography } from "@mui/material";
import { RadioResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: RadioResponseByPersonProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByPerson;

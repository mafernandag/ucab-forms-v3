import { Typography } from "@mui/material";
import { SelectResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: SelectResponseByPersonProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByPerson;

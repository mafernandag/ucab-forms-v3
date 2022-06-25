import { Typography } from "@mui/material";
import { TextResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: TextResponseByPersonProps) => {
  return <Typography>{value}</Typography>;
};

export default ResponseByPerson;

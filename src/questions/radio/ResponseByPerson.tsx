import { Typography } from "@mui/material";
import { RadioResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: RadioResponseByPersonProps) => {
  return <Typography variant="body2">{value}</Typography>;
};

export default ResponseByPerson;

import { Typography } from "@mui/material";
import { NumericResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: NumericResponseByPersonProps) => {
  return <Typography variant="body2">{value}</Typography>;
};

export default ResponseByPerson;

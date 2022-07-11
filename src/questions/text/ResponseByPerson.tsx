import { Typography } from "@mui/material";
import { TextResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: TextResponseByPersonProps) => {
  return <Typography variant="body2">{value}</Typography>;
};

export default ResponseByPerson;

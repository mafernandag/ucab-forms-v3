import { Typography } from "@mui/material";
import { DateResponseByPersonProps } from "./types";
import { stringify } from "./utils";

const ResponseByPerson = ({ value }: DateResponseByPersonProps) => {
  const text = stringify(value);
  return <Typography>{text}</Typography>;
};

export default ResponseByPerson;

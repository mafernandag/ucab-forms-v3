import { Typography } from "@mui/material";
import { DateResponseByPersonProps } from "./types";
import { stringify } from "./utils";

const ResponseByPerson = ({ value }: DateResponseByPersonProps) => {
  const text = stringify(value);
  return <Typography variant="body2">{text}</Typography>;
};

export default ResponseByPerson;

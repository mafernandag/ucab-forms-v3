import { Typography } from "@mui/material";
import { DateTimeResponseByPersonProps } from "./types";
import { stringify } from "./utils";

const ResponseByPerson = ({ value }: DateTimeResponseByPersonProps) => {
  const text = stringify(value);
  return <Typography variant="body2">{text}</Typography>;
};

export default ResponseByPerson;

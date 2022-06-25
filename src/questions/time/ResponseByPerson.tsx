import { Typography } from "@mui/material";
import { TimeResponseByPersonProps } from "./types";
import { stringify } from "./utils";

const ResponseByPerson = ({ value }: TimeResponseByPersonProps) => {
  const text = stringify(value);
  return <Typography>{text}</Typography>;
};

export default ResponseByPerson;

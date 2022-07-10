import { Typography } from "@mui/material";
import { TimeResponseByPersonProps } from "./types";
import { stringify } from "./utils";

const ResponseByPerson = ({ value }: TimeResponseByPersonProps) => {
  const text = stringify(value);
  return <Typography variant="body2">{text}</Typography>;
};

export default ResponseByPerson;

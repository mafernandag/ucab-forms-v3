import { Typography } from "@mui/material";
import {
  SortableResponseByPersonProps,
  SortableResponseByQuestionProps,
} from "../types";

type Props = SortableResponseByPersonProps | SortableResponseByQuestionProps;

const SortableResponse = ({ value }: Props) => {
  return (
    <>
      {value.map((option, i) => (
        <Typography variant="body2" key={i}>
          {i + 1}. {option}
        </Typography>
      ))}
    </>
  );
};

export default SortableResponse;

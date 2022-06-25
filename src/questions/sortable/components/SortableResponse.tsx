import { Card, Stack, Typography } from "@mui/material";
import {
  SortableResponseByPersonProps,
  SortableResponseByQuestionProps,
} from "../types";

type Props = SortableResponseByPersonProps | SortableResponseByQuestionProps;

const SortableResponse = ({ value }: Props) => {
  return (
    <Stack spacing={1}>
      {value.map((option, i) => (
        <Card key={i} sx={{ p: 2 }}>
          <Typography>{option}</Typography>
        </Card>
      ))}
    </Stack>
  );
};

export default SortableResponse;

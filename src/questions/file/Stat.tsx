import { Stack } from "@mui/material";
import { FilesResponse } from "./components";
import { FileStatProps } from "./types";

const Stat = ({ answers, question }: FileStatProps) => {
  return (
    <Stack spacing={2}>
      {answers.map((a, i) => (
        <FilesResponse key={i} files={a[question.id]} />
      ))}
    </Stack>
  );
};

export default Stat;

import { Stack, Typography } from "@mui/material";
import { flatten } from "lodash";
import { FilesResponse } from "./components";
import { FileStatProps } from "./types";

const Stat = ({ answers, question, labels }: FileStatProps) => {
  return (
    <Stack spacing={2}>
      {labels.map((label) => (
        <Stack spacing={1} key={label}>
          <Typography variant="body2" fontWeight={500}>
            {label}
          </Typography>
          {answers.map(
            (answer, i) =>
              flatten(answer[question.id]?.[label]).length > 0 && (
                <FilesResponse
                  key={i}
                  files={flatten(answer[question.id][label])}
                />
              )
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export default Stat;

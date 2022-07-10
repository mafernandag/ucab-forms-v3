import { Stack, Typography } from "@mui/material";
import { getSectionLabels } from "../utils";
import { FilesResponse } from "./components";
import { FileStatProps } from "./types";

const Stat = ({ answers, section, question }: FileStatProps) => {
  const sectionLabels = getSectionLabels(section);

  return (
    <Stack spacing={2}>
      {sectionLabels.map((label) => (
        <Stack spacing={1} key={label}>
          <Typography variant="body2" fontWeight={500}>
            {label}
          </Typography>
          {answers.map(
            (answer, i) =>
              answer[question.id]?.[label]?.length > 0 && (
                <FilesResponse key={i} files={answer[question.id][label]} />
              )
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export default Stat;

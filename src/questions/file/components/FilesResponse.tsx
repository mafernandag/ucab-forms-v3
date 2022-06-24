import { Box, Link, Stack } from "@mui/material";
import { FileDbAnswer } from "../types";

interface Props {
  files: FileDbAnswer;
}

const FilesResponse = ({ files }: Props) => {
  return (
    <Stack sx={{ alignItems: "flex-start" }} spacing={2}>
      {files?.map((file, i) => {
        if (file.type.includes("image")) {
          return (
            <Box
              component="img"
              key={i}
              src={file.url}
              alt="response"
              sx={{ maxWidth: "100%" }}
            />
          );
        }

        if (file.type.includes("audio")) {
          return (
            <Box key={i}>
              <audio controls>
                <source src={file.url} type={file.type} />
              </audio>
            </Box>
          );
        }

        if (file.type.includes("video")) {
          return (
            <Box key={i}>
              <video width="100%" controls>
                <source src={file.url} type={file.type} />
              </video>
            </Box>
          );
        }

        return (
          <Link
            key={i}
            target="_blank"
            rel="noopener noreferrer"
            href={file.url}
          >
            {file.name}
          </Link>
        );
      })}
    </Stack>
  );
};

export default FilesResponse;

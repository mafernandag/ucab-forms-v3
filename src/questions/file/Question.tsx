import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { FileQuestionProps } from "./types";
import { UploadButton } from "./components";

const Question = ({ answer, question, updateAnswer }: FileQuestionProps) => {
  const handleRemoveFile = (i: number) => () => {
    const newAnswer = answer.filter((f, j) => j !== i);
    updateAnswer(newAnswer);
  };

  const handleChangeFiles = (files: FileList) => {
    const filesArray = Array.from(files);

    if (question.multipleFiles) {
      const newAnswer = [...answer, ...filesArray];
      return updateAnswer(newAnswer);
    }

    updateAnswer(filesArray);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        {answer.map((file, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography noWrap>{file.name}</Typography>
            <Tooltip title="Eliminar" arrow>
              <IconButton onClick={handleRemoveFile(i)}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
      <UploadButton
        inputId={question.id}
        multiple={question.multipleFiles}
        onChange={handleChangeFiles}
      />
    </Box>
  );
};

export default Question;

import { TextField } from "@mui/material";
import { TextareaPreviewProps } from "./types";

const Preview = (props: TextareaPreviewProps) => {
  return (
    <TextField
      disabled
      variant="standard"
      value="Texto de respuesta larga"
      fullWidth
    />
  );
};

export default Preview;

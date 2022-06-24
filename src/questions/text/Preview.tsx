import { TextField } from "@mui/material";
import { TextPreviewProps } from "./types";

const Preview = (props: TextPreviewProps) => {
  return (
    <TextField disabled variant="standard" value="Texto de respuesta breve" />
  );
};

export default Preview;

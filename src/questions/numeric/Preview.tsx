import { TextField } from "@mui/material";
import { NumericPreviewProps } from "./types";

const Preview = (props: NumericPreviewProps) => {
  return <TextField disabled variant="standard" value="Valor numérico" />;
};

export default Preview;

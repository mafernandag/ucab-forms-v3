import { TimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { TimePreviewProps } from "./types";

const Preview = (props: TimePreviewProps) => {
  return (
    <TimePicker
      label="Hora"
      disabled
      value={null}
      onChange={() => {}}
      renderInput={(params) => <TextField variant="standard" {...params} />}
    />
  );
};

export default Preview;

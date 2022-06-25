import { DateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { DateTimePreviewProps } from "./types";

const Preview = (props: DateTimePreviewProps) => {
  return (
    <DateTimePicker
      label="Fecha y Hora"
      disabled
      value={null}
      onChange={() => {}}
      renderInput={(params) => <TextField variant="standard" {...params} />}
    />
  );
};

export default Preview;

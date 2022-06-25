import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { DatePreviewProps } from "./types";

const Preview = (props: DatePreviewProps) => {
  return (
    <DatePicker
      label="Día, mes, año"
      disabled
      value={null}
      onChange={() => {}}
      renderInput={(params) => <TextField variant="standard" {...params} />}
    />
  );
};

export default Preview;

import { MenuItem } from "@mui/material";
import { Select } from "./components";
import { SelectPreviewProps } from "./types";

const Preview = ({ question }: SelectPreviewProps) => {
  return (
    <Select variant="standard" displayEmpty defaultValue="">
      {question.options.map((option, i) => (
        <MenuItem disabled key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Preview;

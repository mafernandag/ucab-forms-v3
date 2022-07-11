import { Box } from "@mui/material";
import { SortableSettingsProps } from "./types";
import {
  EnumeratedOptions,
  RandomOrderCheckbox,
  RequiredCheckbox,
} from "../components";

const Settings = (props: SortableSettingsProps) => {
  return (
    <>
      <EnumeratedOptions {...props} />
      <Box>
        <RandomOrderCheckbox {...props} />
        <RequiredCheckbox disabled {...props} />
      </Box>
    </>
  );
};

export default Settings;

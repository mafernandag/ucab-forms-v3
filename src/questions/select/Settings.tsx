import { Box } from "@mui/material";
import { SelectSettingsProps } from "./types";
import {
  EnumeratedOptions,
  RandomOrderCheckbox,
  RequiredCheckbox,
} from "../components";

const Settings = (props: SelectSettingsProps) => {
  return (
    <>
      <EnumeratedOptions {...props} />
      <Box>
        <RandomOrderCheckbox {...props} />
        <RequiredCheckbox {...props} />
      </Box>
    </>
  );
};

export default Settings;

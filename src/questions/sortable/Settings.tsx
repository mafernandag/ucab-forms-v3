import { SortableSettingsProps } from "./types";
import { EnumeratedOptions, RequiredCheckbox } from "../components";
import RandomOrderCheckbox from "../components/RandomOrderCheckbox";
import { Box } from "@mui/system";

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

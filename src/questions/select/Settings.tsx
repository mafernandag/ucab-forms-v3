import { Box } from "@mui/material";
import { SelectSettingsProps } from "./types";
import { EnumeratedOptions, RequiredCheckbox } from "../components";
import RandomOrderCheckbox from "../components/RandomOrderCheckbox";
import ConditionedQuestion from "../components/ConditionedQuestionCheckbox";

const Settings = (props: SelectSettingsProps) => {
  return (
    <>
      <EnumeratedOptions {...props} />
      <Box>
        <RandomOrderCheckbox {...props} />
        <RequiredCheckbox {...props} />
        <ConditionedQuestion {...props} />
      </Box>
    </>
  );
};

export default Settings;

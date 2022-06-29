import { SortableSettingsProps } from "./types";
import { EnumeratedOptions, RequiredCheckbox } from "../components";
import RandomOrderCheckbox from "../components/RandomOrderCheckbox";
import ConditionedQuestion from "../components/ConditionedQuestionCheckbox";
import { Box } from "@mui/system";

const Settings = (props: SortableSettingsProps) => {
  return (
    <>
      <EnumeratedOptions {...props} />
      <Box>
        <RandomOrderCheckbox {...props} />
        <RequiredCheckbox disabled {...props} />
        <ConditionedQuestion {...props} />
      </Box>
    </>
  );
};

export default Settings;

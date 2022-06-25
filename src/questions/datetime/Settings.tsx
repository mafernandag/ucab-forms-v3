import { RequiredCheckbox } from "../components";
import { DateTimeSettingsProps } from "./types";

const Settings = (props: DateTimeSettingsProps) => {
  return <RequiredCheckbox {...props} />;
};

export default Settings;

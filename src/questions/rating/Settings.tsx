import { RequiredCheckbox } from "../components";
import { RatingSettingsProps } from "./types";

const Settings = (props: RatingSettingsProps) => {
  return <RequiredCheckbox {...props} />;
};

export default Settings;

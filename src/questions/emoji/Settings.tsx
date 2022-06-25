import { RequiredCheckbox } from "../components";
import { EmojiSettingsProps } from "./types";

const Settings = (props: EmojiSettingsProps) => {
  return <RequiredCheckbox {...props} />;
};

export default Settings;

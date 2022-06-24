import { RequiredCheckbox, SpecialAutocomplete } from "../components";
import { TextSettingsProps } from "./types";

const Settings = ({ question, updateQuestion }: TextSettingsProps) => {
  const handleChange = (value: string) => {
    const newQuestion = { ...question, specialType: value };
    updateQuestion(newQuestion);
  };

  return (
    <>
      <SpecialAutocomplete
        value={question.specialType}
        onChange={handleChange}
      />
      <RequiredCheckbox question={question} updateQuestion={updateQuestion} />
    </>
  );
};

export default Settings;

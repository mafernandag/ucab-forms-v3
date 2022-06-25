import { useForm } from "../../../hooks/useForm";
import { questionConfig } from "../../../questions";

const EditOptions = ({ question, debouncedSave }) => {
  const { setQuestions } = useForm();

  const updateQuestion = (newQuestion) => {
    debouncedSave(newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const type = question.type;

  const Settings = questionConfig[type].settings;

  return <Settings question={question} updateQuestion={updateQuestion} />;
};

export default EditOptions;

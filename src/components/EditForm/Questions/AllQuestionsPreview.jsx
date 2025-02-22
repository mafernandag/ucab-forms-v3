import { questionConfig } from "../../../questions";

const QuestionPreview = ({ question }) => {
  const type = question.type;
  const Preview = questionConfig[type].Preview;

  return <Preview question={question} />;
};

export default QuestionPreview;

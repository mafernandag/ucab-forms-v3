import { Slider } from "./components";
import { SliderResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({
  question,
  value,
}: SliderResponseByQuestionProps) => {
  return <Slider disabled question={question} value={value as number} />;
};

export default ResponseByQuestion;

import { Slider } from "./components";
import { SliderResponseByPersonProps } from "./types";

const ResponseByPerson = ({ question, value }: SliderResponseByPersonProps) => {
  return <Slider disabled question={question} value={value as number} />;
};

export default ResponseByPerson;

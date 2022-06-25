import { Slider } from "./components";
import { SliderPreviewProps } from "./types";

const Preview = ({ question }: SliderPreviewProps) => {
  return <Slider disabled value={question.min} question={question} />;
};

export default Preview;

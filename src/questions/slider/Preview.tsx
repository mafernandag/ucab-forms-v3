import { Slider } from "./components";
import { SliderPreviewProps } from "./types";

const Preview = ({ question }: SliderPreviewProps) => {
  return <Slider disabled defaultValue={question.min} question={question} />;
};

export default Preview;

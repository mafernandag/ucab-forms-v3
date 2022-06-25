import { Rating } from "./components";
import { RatingResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: RatingResponseByQuestionProps) => {
  return <Rating readOnly value={value || 0} />;
};

export default ResponseByQuestion;

import { Rating } from "./components";
import { RatingResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: RatingResponseByQuestionProps) => {
  return <Rating readOnly value={value} />;
};

export default ResponseByQuestion;

import { Rating } from "./components";
import { RatingQuestionProps } from "./types";

const Question = ({ answer, updateAnswer }: RatingQuestionProps) => {
  return <Rating value={answer || 0} onChange={updateAnswer} />;
};

export default Question;

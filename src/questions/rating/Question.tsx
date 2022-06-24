import { Rating } from "./components";
import { RatingQuestionProps } from "./types";

const Question = ({ answer, updateAnswer }: RatingQuestionProps) => {
  return <Rating value={answer} onChange={updateAnswer} />;
};

export default Question;

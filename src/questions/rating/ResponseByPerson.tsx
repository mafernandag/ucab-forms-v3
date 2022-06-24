import { Rating } from "./components";
import { RatingResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: RatingResponseByPersonProps) => {
  return <Rating readOnly value={value} />;
};

export default ResponseByPerson;

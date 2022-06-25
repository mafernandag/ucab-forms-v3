import { Rating } from "./components";
import { RatingResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: RatingResponseByPersonProps) => {
  return <Rating readOnly value={value || 0} />;
};

export default ResponseByPerson;

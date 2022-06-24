import SortableList from "./components/SortableList";
import { SortableQuestionProps } from "./types";

const Question = ({ answer, updateAnswer }: SortableQuestionProps) => {
  return <SortableList items={answer} onChange={updateAnswer} />;
};

export default Question;

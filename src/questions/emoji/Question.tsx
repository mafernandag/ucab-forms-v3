import { Emoji } from "./components";
import { EmojiQuestionProps } from "./types";

const Question = ({ answer, updateAnswer }: EmojiQuestionProps) => {
  return <Emoji value={answer || 0} onChange={updateAnswer} />;
};

export default Question;

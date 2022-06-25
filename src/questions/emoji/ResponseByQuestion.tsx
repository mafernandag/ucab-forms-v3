import { Emoji } from "./components";
import { EmojiResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: EmojiResponseByQuestionProps) => {
  return <Emoji readOnly value={value || 0} />;
};

export default ResponseByQuestion;

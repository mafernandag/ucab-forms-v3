import { Emoji } from "./components";
import { EmojiResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: EmojiResponseByPersonProps) => {
  return <Emoji readOnly value={value || 0} />;
};

export default ResponseByPerson;

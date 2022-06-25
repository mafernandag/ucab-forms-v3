import { FilesResponse } from "./components";
import { FileResponseByQuestionProps } from "./types";

const ResponseByQuestion = ({ value }: FileResponseByQuestionProps) => {
  return <FilesResponse files={value} />;
};

export default ResponseByQuestion;

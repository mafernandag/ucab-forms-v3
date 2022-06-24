import { FilesResponse } from "./components";
import { FileResponseByPersonProps } from "./types";

const ResponseByPerson = ({ value }: FileResponseByPersonProps) => {
  return <FilesResponse files={value} />;
};

export default ResponseByPerson;

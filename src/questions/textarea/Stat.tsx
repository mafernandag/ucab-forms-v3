import { SimpleTable } from "../components";
import { getRows } from "../utils";
import { TextareaStatProps } from "./types";

const Stat = ({ answers, question, labels }: TextareaStatProps) => {
  const rows = getRows({
    labels,
    answers,
    question,
  });

  return <SimpleTable labels={labels} rows={rows} />;
};

export default Stat;

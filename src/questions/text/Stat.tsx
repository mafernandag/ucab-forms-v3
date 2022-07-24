import { SimpleTable } from "../components";
import { getRows } from "../utils";
import { TextStatProps } from "./types";

const Stat = ({ answers, question, labels }: TextStatProps) => {
  const rows = getRows({
    labels,
    answers,
    question,
  });

  return <SimpleTable labels={labels} rows={rows} />;
};

export default Stat;

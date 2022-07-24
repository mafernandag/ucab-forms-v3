import { SimpleTable } from "../components";
import { getRows } from "../utils";
import { TimeStatProps } from "./types";

const Stat = ({ answers, question, labels }: TimeStatProps) => {
  const rows = getRows({
    labels,
    answers,
    question,
  });

  return <SimpleTable labels={labels} rows={rows} />;
};

export default Stat;

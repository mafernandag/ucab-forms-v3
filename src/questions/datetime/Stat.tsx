import { SimpleTable } from "../components";
import { getRows } from "../utils";
import { DateTimeStatProps } from "./types";

const Stat = ({ answers, question, labels }: DateTimeStatProps) => {
  const rows = getRows({
    labels,
    answers,
    question,
  });

  return <SimpleTable labels={labels} rows={rows} />;
};

export default Stat;

import { DateStatProps } from "./types";
import { SimpleTable } from "../components";
import { getRows } from "../utils";

const Stat = ({ answers, question, labels }: DateStatProps) => {
  const rows = getRows({
    labels,
    answers,
    question,
  });

  return <SimpleTable labels={labels} rows={rows} />;
};

export default Stat;

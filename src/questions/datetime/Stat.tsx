import { useMemo } from "react";
import { SimpleTable } from "../components";
import { DateTimeStatProps } from "./types";
import { stringify } from "./utils";

const Stat = ({ answers, question, labels }: DateTimeStatProps) => {
  const rows = useMemo(() => {
    const filteredAnswers = answers.filter((answer) =>
      labels.some((label) => answer[question.id]?.[label])
    );

    return filteredAnswers.map((answer) =>
      labels.reduce<Record<string, string>>((previous, current) => {
        previous[current] = stringify(answer[question.id][current]) || "-";
        return previous;
      }, {})
    );
  }, [answers, question.id, labels]);

  return <SimpleTable labels={labels} rows={rows} />;
};

export default Stat;

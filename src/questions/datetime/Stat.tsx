import { useMemo } from "react";
import { SimpleTable } from "../components";
import { getSectionLabels } from "../utils";
import { DateTimeStatProps } from "./types";
import { stringify } from "./utils";

const Stat = ({ answers, section, question }: DateTimeStatProps) => {
  const sectionLabels = getSectionLabels(section);

  const rows = useMemo(() => {
    const filteredAnswers = answers.filter((answer) =>
      sectionLabels.some((label) => answer[question.id]?.[label])
    );

    return filteredAnswers.map((answer) =>
      sectionLabels.reduce<Record<string, string>>((previous, current) => {
        previous[current] = stringify(answer[question.id][current]) || "-";
        return previous;
      }, {})
    );
  }, [answers, question.id, sectionLabels]);

  return <SimpleTable labels={sectionLabels} rows={rows} />;
};

export default Stat;

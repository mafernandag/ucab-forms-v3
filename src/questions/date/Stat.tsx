import { useMemo } from "react";
import { getSectionLabels } from "../utils";
import { DateStatProps } from "./types";
import { stringify } from "./utils";
import { SimpleTable } from "../components";

const Stat = ({ answers, section, question }: DateStatProps) => {
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

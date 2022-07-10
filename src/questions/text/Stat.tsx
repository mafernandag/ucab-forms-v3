import { useMemo } from "react";
import { SimpleTable } from "../components";
import { getSectionLabels } from "../utils";
import { TextStatProps } from "./types";

const Stat = ({ answers, section, question }: TextStatProps) => {
  const sectionLabels = getSectionLabels(section);

  const rows = useMemo(() => {
    const filteredAnswers = answers.filter((answer) =>
      sectionLabels.some((label) => answer[question.id]?.[label])
    );

    return filteredAnswers.map((answer) =>
      sectionLabels.reduce<Record<string, string>>((previous, current) => {
        previous[current] = answer[question.id][current] || "-";
        return previous;
      }, {})
    );
  }, [answers, question.id, sectionLabels]);

  return <SimpleTable labels={sectionLabels} rows={rows} />;
};

export default Stat;

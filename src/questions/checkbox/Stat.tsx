import { CheckboxStatProps } from "./types";
import { BarDiagram } from "../components";
import { getSectionLabels } from "../utils";

const Stat = ({ answers, section, question }: CheckboxStatProps) => {
  const sectionLabels = getSectionLabels(section);

  const datasets = sectionLabels.map((label) => {
    return {
      label,
      data: question.options.map((option) => {
        return answers.filter((answer) =>
          answer[question.id]?.[label]?.includes(option)
        ).length;
      }),
    };
  });

  return <BarDiagram labels={question.options} datasets={datasets} />;
};

export default Stat;

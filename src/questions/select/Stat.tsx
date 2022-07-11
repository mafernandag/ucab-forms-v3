import { SelectStatProps } from "./types";
import { getSectionLabels } from "../utils";
import { CircularDiagram } from "../components";

const Stat = ({ answers, section, question }: SelectStatProps) => {
  const sectionLabels = getSectionLabels(section);

  const datasets = sectionLabels.map((label) => {
    return {
      label,
      data: question.options.map((option) => {
        return answers.filter(
          (answer) => answer[question.id]?.[label] === option
        ).length;
      }),
    };
  });

  return <CircularDiagram labels={question.options} datasets={datasets} />;
};

export default Stat;

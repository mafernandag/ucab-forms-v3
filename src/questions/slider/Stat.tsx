import { SliderStatProps } from "./types";
import { getSectionLabels } from "../utils";
import { BarDiagram } from "../components";

const Stat = ({ answers, section, question }: SliderStatProps) => {
  const sectionLabels = getSectionLabels(section);
  const values: number[] = [];

  for (let i = question.min; i <= question.max; i++) {
    values.push(i);
  }

  const diagramLabels = values.map((value) => value.toString());

  const datasets = sectionLabels.map((label) => {
    return {
      label,
      data: values.map((value) => {
        return answers.filter(
          (answer) => answer[question.id]?.[label] === value
        ).length;
      }),
    };
  });

  return <BarDiagram labels={diagramLabels} datasets={datasets} />;
};

export default Stat;

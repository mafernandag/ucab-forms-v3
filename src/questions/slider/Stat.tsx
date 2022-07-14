import { SliderStatProps } from "./types";
import { BarDiagram } from "../components";

const Stat = ({ answers, question, labels }: SliderStatProps) => {
  const values: number[] = [];

  for (let i = question.min; i <= question.max; i++) {
    values.push(i);
  }

  const diagramLabels = values.map((value) => value.toString());

  const datasets = labels.map((label) => {
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

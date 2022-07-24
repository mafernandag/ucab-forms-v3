import { SliderStatProps } from "./types";
import { BarDiagram } from "../components";
import { getDatasets } from "../utils";

const Stat = ({ answers, question, labels }: SliderStatProps) => {
  const values: number[] = [];

  for (let i = question.min; i <= question.max; i++) {
    values.push(i);
  }

  const datasets = getDatasets({
    labels,
    answers,
    questionId: question.id,
    values,
  });

  const diagramLabels = values.map((value) => value.toString());

  return <BarDiagram labels={diagramLabels} datasets={datasets} />;
};

export default Stat;

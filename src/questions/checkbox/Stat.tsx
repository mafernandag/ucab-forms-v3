import { CheckboxStatProps } from "./types";
import { Chart } from "../components";
import { getDatasets } from "../utils";

const Stat = ({ answers, question, labels }: CheckboxStatProps) => {
  const datasets = getDatasets({
    labels,
    answers,
    questionId: question.id,
    values: question.options,
    other: question.other,
  });

  const chartLabels = [...question.options];

  if (question.other) {
    chartLabels.push("Otro");
  }

  return <Chart labels={chartLabels} datasets={datasets} />;
};

export default Stat;

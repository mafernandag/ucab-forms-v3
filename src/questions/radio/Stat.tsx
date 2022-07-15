import { RadioStatProps } from "./types";
import { CircularDiagram } from "../components";
import { isEmpty } from "../utils";

const Stat = ({ answers, question, labels }: RadioStatProps) => {
  const datasets = labels.map((label) => {
    const dataset = {
      label,
      data: question.options.map((option) => {
        return answers.filter(
          (answer) => answer[question.id]?.[label] === option
        ).length;
      }),
    };

    if (question.other) {
      dataset.data.push(
        answers.filter((answer) => {
          const value = answer[question.id]?.[label];
          return !question.options.includes(value) && !isEmpty(value);
        }).length
      );
    }

    return dataset;
  });

  const chartLabels = [...question.options];

  if (question.other) {
    chartLabels.push("Otro");
  }

  return <CircularDiagram labels={chartLabels} datasets={datasets} />;
};

export default Stat;

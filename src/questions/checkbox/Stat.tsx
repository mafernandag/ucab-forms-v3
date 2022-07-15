import { CheckboxStatProps } from "./types";
import { BarDiagram } from "../components";

const Stat = ({ answers, question, labels }: CheckboxStatProps) => {
  const datasets = labels.map((label) => {
    const dataset = {
      label,
      data: question.options.map((option) => {
        return answers.filter((answer) =>
          answer[question.id]?.[label]?.includes(option)
        ).length;
      }),
    };

    if (question.other) {
      const value = answers.filter((answer) => {
        return answer[question.id]?.[label]?.some(
          (option) => !question.options.includes(option)
        );
      }).length;

      dataset.data.push(value);
    }

    return dataset;
  });

  const chartLabels = [...question.options];

  if (question.other) {
    chartLabels.push("Otro");
  }

  return <BarDiagram labels={chartLabels} datasets={datasets} />;
};

export default Stat;

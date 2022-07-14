import { CheckboxStatProps } from "./types";
import { BarDiagram } from "../components";

const Stat = ({ answers, question, labels }: CheckboxStatProps) => {
  const datasets = labels.map((label) => {
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

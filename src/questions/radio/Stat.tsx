import { RadioStatProps } from "./types";
import { CircularDiagram } from "../components";

const Stat = ({ answers, question, labels }: RadioStatProps) => {
  const datasets = labels.map((label) => {
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

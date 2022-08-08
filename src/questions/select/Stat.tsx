import { SelectStatProps } from "./types";
import { Chart } from "../components";
import { getDatasets } from "../utils";

const Stat = ({ answers, question, labels }: SelectStatProps) => {
  const datasets = getDatasets({
    labels,
    answers,
    questionId: question.id,
    values: question.options,
  });

  return <Chart labels={question.options} datasets={datasets} />;
};

export default Stat;

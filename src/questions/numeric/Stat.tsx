import { StatisticsTable } from "./components";
import { NumericStatProps } from "./types";
import { getStatistics } from "./utils";

const Stat = ({ answers, question, labels }: NumericStatProps) => {
  const statistics = getStatistics({ answers, question, labels });

  const tableLabels = labels.length > 1 ? [...labels, "General"] : [labels[0]];

  return <StatisticsTable labels={tableLabels} statistics={statistics} />;
};

export default Stat;

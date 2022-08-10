import { Stack } from "@mui/material";
import { Histogram, StatisticsTable } from "./components";
import { NumericStatProps } from "./types";
import { getHistogramData, getStatistics } from "./utils";

const Stat = ({ answers, question, labels }: NumericStatProps) => {
  const statistics = getStatistics({ answers, question, labels });

  const tableLabels = labels.length > 1 ? [...labels, "General"] : [labels[0]];

  const data = getHistogramData({ answers, question, label: labels[0] });

  return (
    <Stack spacing={2}>
      {labels.map((label) => (
        <Histogram
          key={label}
          label={label}
          xValues={data.x}
          yValues={data.y}
        />
      ))}
      <StatisticsTable labels={tableLabels} statistics={statistics} />
    </Stack>
  );
};

export default Stat;

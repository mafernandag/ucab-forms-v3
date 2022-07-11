import { useMemo } from "react";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChartData, ChartOptions } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BACKGROUND_COLORS, BORDER_COLORS } from "../constants";

interface Props {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  variant?: "pie" | "doughnut";
}

const CircularDiagram = ({ labels, datasets, variant = "pie" }: Props) => {
  const theme = useTheme();
  const fontColor =
    theme.palette.mode === "light"
      ? theme.palette.text.secondary
      : theme.palette.text.primary;

  const data: ChartData<typeof variant, number[], string> = useMemo(() => {
    return {
      labels,
      datasets: datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: BACKGROUND_COLORS,
        borderColor: BORDER_COLORS,
        borderWidth: 1,
      })),
    };
  }, [labels, datasets]);

  const options: ChartOptions = useMemo(() => {
    return {
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              return labels[tooltipItems[0].dataIndex];
            },
            label: (tooltipItem) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
            },
          },
        },
        datalabels: {
          formatter: (value, ctx) => {
            if (value > 0) {
              const datasetIndex = ctx.datasetIndex;
              // @ts-ignore
              const total = ctx.chart.getDatasetMeta(datasetIndex).total;
              const percentage = ((value * 100) / total).toFixed(2) + "%";
              return percentage;
            }

            return "";
          },
          color: fontColor,
        },
      },
    };
  }, [fontColor, labels]);

  return (
    <Container maxWidth="sm">
      {variant === "pie" ? (
        <Pie
          data={data as ChartData<"pie", number[], string>}
          plugins={[ChartDataLabels]}
          options={options}
        />
      ) : (
        <Doughnut
          data={data as ChartData<"doughnut", number[], string>}
          plugins={[ChartDataLabels]}
          options={options}
        />
      )}
    </Container>
  );
};

export default CircularDiagram;

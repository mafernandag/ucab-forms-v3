import { useMemo } from "react";
import { Container, Theme, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BACKGROUND_COLORS, BORDER_COLORS } from "../constants";

interface Props {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  variant?: "horizontal" | "vertical";
}

const BarDiagram = ({ labels, datasets, variant = "vertical" }: Props) => {
  const theme = useTheme();
  const upMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const fontColor =
    theme.palette.mode === "light"
      ? theme.palette.text.secondary
      : theme.palette.text.primary;

  ChartJS.defaults.color = fontColor;

  const data: ChartData<"bar", number[], string> = useMemo(() => {
    return {
      labels,
      datasets: datasets.map((dataset, i) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: BACKGROUND_COLORS[i],
        borderColor: BORDER_COLORS[i],
      })),
    };
  }, [labels, datasets]);

  const max = useMemo(() => {
    return Math.max(...datasets.map(({ data }) => Math.max(...data)));
  }, [datasets]);

  const options: ChartOptions = useMemo(() => {
    return {
      indexAxis: variant === "vertical" ? "x" : "y",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      aspectRatio: upMd ? 1.5 : 0.75,
      plugins: {
        datalabels: {
          align: "start",
          anchor: "end",
          formatter: (value, ctx) => {
            let sum = 0;
            const datasetIndex = ctx.datasetIndex;
            const dataArray = ctx.chart.data.datasets[datasetIndex].data;
            dataArray.forEach((data) => {
              if (typeof data === "number") {
                sum += data;
              }
            });
            let percentage = " ";
            if (value > 0) {
              percentage = ((value * 100) / sum).toFixed(2) + "%";
            }
            return percentage;
          },
          color: fontColor,
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
          pan: {
            enabled: true,
          },
          limits: {
            [variant === "vertical" ? "y" : "x"]: {
              min: 0,
              max: max || 1,
            },
          },
        },
      },
    };
  }, [fontColor, max, upMd, variant]);

  return (
    <Container maxWidth="sm">
      <Bar data={data} plugins={[ChartDataLabels]} options={options} />
    </Container>
  );
};

export default BarDiagram;

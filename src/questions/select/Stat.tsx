import { Container } from "@mui/material";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { SelectStatProps } from "./types";
import { ChartData, ChartOptions } from "chart.js";

const Stat = ({ answers, question }: SelectStatProps) => {
  const data: ChartData<"pie", number[], string> = {
    labels: question.options,
    datasets: [
      {
        label: "Respuestas",
        data: question.options.map(
          (option) => answers.filter((a) => a[question.id] === option).length
        ),
        backgroundColor: [
          "rgba(255, 64, 129, 0.2)",
          "rgba(0, 230, 118, 0.2)",
          "rgba(255, 241, 118, 0.2)",
          "rgba(132, 255, 255, 0.2)",
          "rgba(179, 136, 255, 0.2)",
          "rgba(255, 145, 128, 0.2)",
          "rgba(83, 109, 254, 0.2)",
          "rgba(29, 233, 182, 0.2)",
          "rgba(186, 104, 200, 0.2)",
          "rgba(244, 143, 177, 0.2)",
          "rgba(255, 204, 128, 0.2)",
          "rgba(124, 77, 255, 0.2)",
          "rgba(204, 255, 144, 0.2)",
        ],
        borderColor: [
          "rgba(255, 64, 129, 1)",
          "rgba(0, 230, 118, 1)",
          "rgba(255, 241, 118, 1)",
          "rgba(132, 255, 255, 1)",
          "rgba(179, 136, 255, 1)",
          "rgba(255, 145, 128, 1)",
          "rgba(83, 109, 254, 1)",
          "rgba(29, 233, 182, 1)",
          "rgba(186, 104, 200, 1)",
          "rgba(244, 143, 177, 1)",
          "rgba(255, 204, 128, 1)",
          "rgba(124, 77, 255, 1)",
          "rgba(204, 255, 144, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          if (value > 0) {
            // @ts-ignore
            const total = ctx.chart.getDatasetMeta(0).total;
            const percentage = ((value * 100) / total).toFixed(2) + "%";
            return percentage;
          }

          return "";
        },
        color: "#fff",
      },
    },
  };

  return (
    <Container maxWidth="sm">
      <Pie data={data} plugins={[ChartDataLabels]} options={options} />
    </Container>
  );
};

export default Stat;

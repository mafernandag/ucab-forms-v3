import { Container } from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CheckboxStatProps } from "./types";
import { ChartData, ChartOptions } from "chart.js";

const Stat = ({ answers, question }: CheckboxStatProps) => {
  const data: ChartData<"bar", number[], string> = {
    labels: question.options,
    datasets: [
      {
        label: "Respuestas",
        data: question.options.map(
          (option) =>
            answers.filter((a) => a[question.id]?.includes(option)).length
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
      },
    ],
  };

  const options: ChartOptions = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        align: "start",
        anchor: "end",
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.forEach((data) => {
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
        color: "#fff",
      },
    },
  };

  return (
    <Container maxWidth="sm">
      <Bar data={data} plugins={[ChartDataLabels]} options={options} />
    </Container>
  );
};

export default Stat;

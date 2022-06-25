import { Container } from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartOptions } from "chart.js";
import { RatingStatProps } from "./types";
import { ratingLabels } from "./constants";

const Stat = ({ answers, question }: RatingStatProps) => {
  const values = [1, 2, 3, 4, 5];

  const data = {
    labels: ratingLabels.slice(1),
    datasets: [
      {
        label: "Respuestas",
        data: values.map(
          (v) => answers.filter((a) => a[question.id] === v).length
        ),
        backgroundColor: [
          "rgba(255, 64, 129, 0.2)",
          "rgba(0, 230, 118, 0.2)",
          "rgba(255, 241, 118, 0.2)",
          "rgba(132, 255, 255, 0.2)",
          "rgba(179, 136, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 64, 129, 1)",
          "rgba(0, 230, 118, 1)",
          "rgba(255, 241, 118, 1)",
          "rgba(132, 255, 255, 1)",
          "rgba(179, 136, 255, 1)",
        ],
      },
    ],
  };

  const options: ChartOptions = {
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

import { Container, Stack, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format } from "date-fns";
import {
  CHECKBOX,
  DATE,
  DATETIME,
  FILE,
  RADIO,
  RATING,
  SELECT,
  SLIDER,
  SORTABLE,
  TEXT,
  TEXTAREA,
  TIME,
  ratingLabels,
} from "../../constants/questions";
import { getResponseCountText } from "../../utils/stats";
import FilesResponse from "./FilesResponse";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const QuestionStat = ({ question, responses }) => {
  const responseCount = responses.filter(
    (r) =>
      (r[question.id] || r[question.id] === 0) && r[question.id].length !== 0
  ).length;

  const responseCountText = getResponseCountText(responseCount);

  let data = {};
  let options = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.forEach((data) => {
            sum += data;
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

  if ([RADIO, SELECT].includes(question.type)) {
    data = {
      labels: question.options,
      datasets: [
        {
          label: "Respuestas",
          data: question.options.map(
            (option) =>
              responses.filter((r) => r[question.id] === option).length
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
  }

  if (question.type === CHECKBOX) {
    data = {
      labels: question.options,
      datasets: [
        {
          label: "Respuestas",
          data: question.options.map(
            (option) =>
              responses.filter((r) => r[question.id]?.includes(option)).length
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
  }

  if (question.type === SLIDER) {
    const labels = [];

    for (let i = question.min; i <= question.max; i++) {
      labels.push(i);
    }

    data = {
      labels,
      datasets: [
        {
          label: "Respuestas",
          data: labels.map(
            (n) => responses.filter((r) => r[question.id] === n).length
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
          ],
        },
      ],
    };
  }

  if (question.type === RATING) {
    const values = [1, 2, 3, 4, 5];

    data = {
      labels: ratingLabels.slice(1),
      datasets: [
        {
          label: "Respuestas",
          data: values.map(
            (v) => responses.filter((r) => r[question.id] === v).length
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
  }

  switch (question.type) {
    case TEXT:
    case TEXTAREA:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id]}
            </Typography>
          ))}
        </>
      );
    case DATE:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id]
                ? format(r[question.id].toDate(), "dd/MM/yyyy")
                : ""}
            </Typography>
          ))}
        </>
      );
    case TIME:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id] ? format(r[question.id].toDate(), "hh:mm a") : ""}
            </Typography>
          ))}
        </>
      );
    case DATETIME:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id]
                ? format(r[question.id].toDate(), "dd/MM/yyyy hh:mm a")
                : ""}
            </Typography>
          ))}
        </>
      );
    case RADIO:
    case SELECT:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          {responseCount > 0 && (
            <Container maxWidth="sm">
              <Pie data={data} plugins={[ChartDataLabels]} options={options} />
            </Container>
          )}
        </>
      );
    case CHECKBOX:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          <Container maxWidth="sm">
            <Bar
              data={data}
              plugins={[ChartDataLabels]}
              options={{
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
                        sum += data;
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
              }}
            />
          </Container>
        </>
      );
    case SLIDER:
    case RATING:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          <Container maxWidth="sm">
            <Bar
              data={data}
              plugins={[ChartDataLabels]}
              options={{
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
                        sum += data;
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
              }}
            />
          </Container>
        </>
      );
    case FILE:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          {responseCount > 0 && (
            <Stack spacing={2}>
              {responses.map((r, i) => (
                <FilesResponse key={i} files={r[question.id]} />
              ))}
            </Stack>
          )}
        </>
      );
    case SORTABLE:
      return (
        <>
          <Typography
            color="text.secondary"
            variant="caption"
            display="block"
            mb={1}
          >
            {responseCountText}
          </Typography>
          <Container maxWidth="sm">
            <table
              style={{
                width: "100%",
                border: "1px solid white",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <tr>
                <td />
                {question.options.map((o, i) => (
                  <td style={{ fontWeight: "bold" }} key={i}>
                    {i + 1}
                  </td>
                ))}
              </tr>
              {question.options.map((option, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: "bold" }}>{option}</td>
                  {question.options.map((o, j) => (
                    <td key={j}>
                      {
                        responses.filter((r) => r[question.id][j] === option)
                          .length
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </table>
          </Container>
        </>
      );
    default:
      return null;
  }
};

export default QuestionStat;

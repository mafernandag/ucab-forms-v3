import { Typography } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { getResponseCountText } from "../../../utils/stats";
import { questionTypesConfig } from "../../../questions/config";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const QuestionStat = ({ question, responses }) => {
  const responseCount = responses.filter((r) => {
    return (
      (r[question.id] || r[question.id] === 0) && r[question.id].length !== 0
    );
  }).length;

  const responseCountText = getResponseCountText(responseCount);

  const type = question.type;
  const Stat = questionTypesConfig[type].stat;

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
      <Stat question={question} answers={responses} />
    </>
  );
};

export default QuestionStat;

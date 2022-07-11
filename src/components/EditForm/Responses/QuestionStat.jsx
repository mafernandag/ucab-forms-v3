import { Typography } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { getResponseCountText } from "../../../utils/stats";
import { questionTypesConfig } from "../../../questions/config";
import { useMemo } from "react";
import { getSectionLabels, isEmpty } from "../../../questions/utils";

const legendMarginPlugin = {
  id: "legendMargin",
  beforeInit: (chart) => {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function () {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
};

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  zoomPlugin,
  legendMarginPlugin
);

const QuestionStat = ({ question, section, answers }) => {
  const responseCount = useMemo(() => {
    const sectionLabels = getSectionLabels(section);

    const filteredAnswers = answers.filter((answer) =>
      sectionLabels.some((label) => !isEmpty(answer[question.id]?.[label]))
    );

    return filteredAnswers.length;
  }, [section, answers, question.id]);

  const responseCountText = getResponseCountText(responseCount);

  const type = question.type;
  const Stat = questionTypesConfig[type].Stat;

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
        <Stat question={question} section={section} answers={answers} />
      )}
    </>
  );
};

export default QuestionStat;

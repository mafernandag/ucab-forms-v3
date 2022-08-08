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
import { getAnswersCountText } from "../../../../utils/stats";
import { questionTypesConfig } from "../../../../questions/config";
import { useMemo } from "react";
import { getSectionLabels } from "../../../../questions/utils";
import { useForm } from "../../../../hooks/useForm";
import { isEmptyAnswer } from "../utils";

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
  const { questions } = useForm();

  const sectionLabels = useMemo(() => {
    return getSectionLabels(section, questions);
  }, [questions, section]);

  const responseCount = useMemo(() => {
    const filteredAnswers = answers.filter(
      (answer) => !isEmptyAnswer(answer[question.id], sectionLabels)
    );

    return filteredAnswers.length;
  }, [answers, question.id, sectionLabels]);

  const responseCountText = getAnswersCountText(responseCount);

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
        <Stat question={question} answers={answers} labels={sectionLabels} />
      )}
    </>
  );
};

export default QuestionStat;

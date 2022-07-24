import { RatingStatProps } from "./types";
import { ratingLabels } from "./constants";
import { BarDiagram } from "../components";
import { flatMap } from "lodash";

const Stat = ({ answers, question, labels }: RatingStatProps) => {
  const diagramLabels = ratingLabels.slice(1);
  const values = [1, 2, 3, 4, 5];

  const datasets = labels.map((label) => {
    const flattenedAnswers = flatMap(answers, (answer) => {
      return answer[question.id]?.[label];
    });

    return {
      label,
      data: values.map((value) => {
        return flattenedAnswers.filter((answer) => answer === value).length;
      }),
    };
  });

  return <BarDiagram labels={diagramLabels} datasets={datasets} />;
};

export default Stat;

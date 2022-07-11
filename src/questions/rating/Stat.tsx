import { RatingStatProps } from "./types";
import { ratingLabels } from "./constants";
import { getSectionLabels } from "../utils";
import { BarDiagram } from "../components";

const Stat = ({ answers, section, question }: RatingStatProps) => {
  const sectionLabels = getSectionLabels(section);
  const diagramLabels = ratingLabels.slice(1);
  const values = [1, 2, 3, 4, 5];

  const datasets = sectionLabels.map((label) => {
    return {
      label,
      data: values.map((value) => {
        return answers.filter(
          (answer) => answer[question.id]?.[label] === value
        ).length;
      }),
    };
  });

  return <BarDiagram labels={diagramLabels} datasets={datasets} />;
};

export default Stat;

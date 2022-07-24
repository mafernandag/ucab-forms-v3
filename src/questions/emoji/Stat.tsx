import { EmojiStatProps } from "./types";
import { emojiLabels } from "./constants";
import { BarDiagram } from "../components";
import { getDatasets } from "../utils";

const Stat = ({ answers, question, labels }: EmojiStatProps) => {
  const diagramLabels = emojiLabels.slice(1);
  const values = [1, 2, 3, 4, 5];

  const datasets = getDatasets({
    labels,
    answers,
    questionId: question.id,
    values,
  });

  return <BarDiagram labels={diagramLabels} datasets={datasets} />;
};

export default Stat;

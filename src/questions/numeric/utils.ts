import { countBy, flatMapDeep, mean, range, sum } from "lodash";
import { BaseQuestion } from "../types";
import { getBaseQuestion } from "../utils";
import {
  NumericQuestion,
  NumericAnswer,
  NumericDbAnswer,
  NumericStatProps,
} from "./types";

export const stringify = (value: NumericDbAnswer) => {
  return value.toString();
};

export const getSerializableValue = (value: NumericDbAnswer) => {
  return value || "";
};

export const getInitializedAnswer = (question: NumericQuestion) => {
  return "";
};

export const checkRequired = (value: NumericAnswer) => {
  return value !== "";
};

export const checkFormat = (value: NumericAnswer) => {
  return true;
};

export const getInitializedFields = (
  question: BaseQuestion,
  newType: string
) => {
  const baseQuestion = getBaseQuestion(question);

  const newQuestion: NumericQuestion = {
    ...baseQuestion,
    type: newType,
  };

  return newQuestion;
};

const getMedian = (values: number[]) => {
  const sortedValues = values.sort((a, b) => a - b);
  const middle = Math.floor(sortedValues.length / 2);
  const isEven = sortedValues.length % 2 === 0;

  if (isEven) {
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
  }

  return sortedValues[middle];
};

const getModes = (values: number[]) => {
  const counts = countBy(values);
  const maxCount = Math.max(...Object.values(counts));
  const modes = Object.keys(counts).filter((key) => counts[key] === maxCount);

  return modes;
};

const getVariance = (values: number[]) => {
  const meanValue = mean(values);
  const squaredDifferences = values.map((value) => {
    return (value - meanValue) ** 2;
  });

  const variance = sum(squaredDifferences) / (values.length - 1);

  return variance;
};

const getStatisticsFromValues = (values: number[]) => {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const meanValue = mean(values);
  const median = getMedian(values);
  const modes = getModes(values);
  const sumValue = sum(values);
  const variance = getVariance(values);
  const standardDeviation = Math.sqrt(variance);

  return {
    min: minValue,
    max: maxValue,
    sum: sumValue,
    mean: meanValue,
    modes,
    median,
    variance,
    standardDeviation,
  };
};

const getTotalStatistics = ({ answers, question }: NumericStatProps) => {
  const flattened = flatMapDeep(answers, (answer) => {
    return answer[question.id] && Object.values(answer[question.id]);
  });

  const numbers = flattened.filter(Boolean).map(Number);
  return getStatisticsFromValues(numbers);
};

export const getStatistics = ({
  answers,
  question,
  labels,
}: NumericStatProps) => {
  const statistics = labels.map((label) => {
    const flattened = flatMapDeep(answers, (answer) => {
      return answer[question.id]?.[label];
    });

    const numbers = flattened.filter(Boolean).map(Number);
    return getStatisticsFromValues(numbers);
  });

  if (labels.length > 1) {
    statistics.push(getTotalStatistics({ answers, question, labels }));
  }

  return [
    {
      label: "Mínimo",
      values: statistics.map((stat) =>
        isFinite(stat.min) ? stat.min.toString() : "N/A"
      ),
    },
    {
      label: "Máximo",
      values: statistics.map((stat) =>
        isFinite(stat.max) ? stat.max.toString() : "N/A"
      ),
    },
    {
      label: "Suma",
      values: statistics.map((stat) =>
        isFinite(stat.sum) ? stat.sum.toString() : "N/A"
      ),
    },
    {
      label: "Media",
      values: statistics.map((stat) =>
        isFinite(stat.mean) ? stat.mean.toFixed(2) : "N/A"
      ),
    },
    {
      label: "Moda",
      values: statistics.map((stat) =>
        stat.modes.length > 0 ? stat.modes.join(", ") : "N/A"
      ),
    },
    {
      label: "Mediana",
      values: statistics.map((stat) =>
        isFinite(stat.median) ? stat.median.toString() : "N/A"
      ),
    },
    {
      label: "Varianza",
      values: statistics.map((stat) =>
        isFinite(stat.variance) ? stat.variance.toFixed(2) : "N/A"
      ),
    },
    {
      label: "Desviación estándar",
      values: statistics.map((stat) =>
        isFinite(stat.standardDeviation)
          ? stat.standardDeviation.toFixed(2)
          : "N/A"
      ),
    },
  ];
};

interface HistogramDataProps {
  answers: Record<string, Record<string, string[]>>[];
  question: NumericQuestion;
  label: string;
}

export const getHistogramData = ({
  answers,
  question,
  label,
}: HistogramDataProps) => {
  const flattened = flatMapDeep(answers, (answer) => {
    return answer[question.id]?.[label];
  });

  const numbers = flattened.filter(Boolean).map(Number);

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const n = 1 + 3.3 * Math.log(numbers.length);
  const step = Math.ceil((max - min) / n);

  const bins = range(min, max + step, step);

  const histogram: Record<string, number> = {};

  bins.forEach((bin) => {
    histogram[bin] = 0;

    numbers.forEach((number) => {
      if (number >= bin && number < bin + step) {
        histogram[bin]++;
      }
    });
  });

  return { x: bins, y: Object.values(histogram) };
};

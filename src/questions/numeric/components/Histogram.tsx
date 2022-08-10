import { useMemo } from "react";
import { Theme, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart as ChartJS, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { BACKGROUND_COLORS, BORDER_COLORS } from "../../constants";

interface Props {
  label: string;
  xValues: number[];
  yValues: number[];
}

const Histogram = ({ label, xValues, yValues }: Props) => {
  const theme = useTheme();
  const upMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const fontColor =
    theme.palette.mode === "light"
      ? theme.palette.text.secondary
      : theme.palette.text.primary;

  ChartJS.defaults.color = fontColor;

  const options: ChartOptions = useMemo(() => {
    return {
      elements: {
        bar: {
          backgroundColor: BACKGROUND_COLORS[0],
          borderColor: BORDER_COLORS[0],
          borderWidth: 1,
          barPercentage: 1,
          categoryPercentage: 1,
        },
      },
      aspectRatio: upMd ? 1.5 : 0.75,
    };
  }, [upMd]);

  return (
    <Bar
      data={{
        labels: xValues,
        datasets: [
          {
            label: label,
            data: yValues,
          },
        ],
      }}
      options={options}
    />
  );
};

export default Histogram;

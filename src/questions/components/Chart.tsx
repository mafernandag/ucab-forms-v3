import { Container, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import BarDiagram from "./BarDiagram";
import CircularDiagram from "./CircularDiagram";

interface Props {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

const Chart = (props: Props) => {
  const [variant, setVariant] = useState("bar-vertical");

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
      }}
    >
      {variant === "bar-vertical" && (
        <BarDiagram {...props} variant="vertical" />
      )}
      {variant === "bar-horizontal" && (
        <BarDiagram {...props} variant="horizontal" />
      )}
      {variant === "pie" && <CircularDiagram {...props} variant="pie" />}
      {variant === "doughnut" && (
        <CircularDiagram {...props} variant="doughnut" />
      )}
      <ToggleButtonGroup
        color="primary"
        value={variant}
        exclusive
        onChange={(event, value) => value && setVariant(value)}
        size="small"
        sx={{ textTransform: "none" }}
      >
        <ToggleButton
          value="bar-vertical"
          sx={{ textTransform: "none", px: { xs: 1, sm: 2 } }}
        >
          Vertical
        </ToggleButton>
        <ToggleButton
          value="bar-horizontal"
          sx={{ textTransform: "none", px: { xs: 1, sm: 2 } }}
        >
          Horizontal
        </ToggleButton>
        <ToggleButton
          value="pie"
          sx={{ textTransform: "none", px: { xs: 1, sm: 2 } }}
        >
          Circular
        </ToggleButton>
        <ToggleButton
          value="doughnut"
          sx={{ textTransform: "none", px: { xs: 1, sm: 2 } }}
        >
          Dona
        </ToggleButton>
      </ToggleButtonGroup>
    </Container>
  );
};

export default Chart;

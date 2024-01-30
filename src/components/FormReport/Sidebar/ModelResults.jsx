import { Box, Stack, Typography, Button, Divider } from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
} from "@mui/icons-material";
import ModelSection from "./ModelSection";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "./TooltipTitle";

const ModelResults = ({ testAccuracy }) => {
  const { labeledQuestions, deletedColumns } = useContext(ReportContext);

  const handleButtonClick = () => {};

  const handleBackArrow = () => {
    //setSelectedModel(null);
  };

  return (
    <Stack spacing={4}>
      <Box>
        {/*         <ArrowIcon
          sx={{ marginTop: "8px", marginBottom: "8px" }}
          onClick={handleBackArrow}
        /> */}
        <Stack spacing={2} sx={{ paddingX: "12px", paddingY: "20px" }}>
          <Typography variant="body1" color="text.secondary">
            Modelo Seleccionado
          </Typography>
          <Typography variant="h6">Árboles de decisión</Typography>
          <Divider />
          <Typography variant="h6">Precision del modelo*</Typography>
          <Stack spacing={2} alignItems="center">
            {/* <Typography variant="h5">{testAccuracy.toFixed(2)}%</Typography> */}
            <Button onClick={handleButtonClick}>Aceptar</Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ModelResults;

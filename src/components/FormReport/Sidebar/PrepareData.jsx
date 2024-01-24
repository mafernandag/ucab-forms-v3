import { Box, Stack, Typography, Button, Tooltip } from "@mui/material";
import { ArrowBack as ArrowIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import CleanData from "./CleanData";

const PrepareData = ({ setOpenDrawer }) => {
  const [showDescription, setShowDescription] = useState(true);

  const handleButtonClick = () => {
    setShowDescription(!showDescription);
  };

  return (
    <Stack spacing={3}>
      {showDescription && (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Stack spacing={3} sx={{ paddingX: "12px", paddingTop: "10px" }}>
            <Typography variant="h6">1. Preparación de los datos</Typography>
            <Typography variant="body1" align="justify">
              Esta fase implica la recopilación, limpieza, integración y
              formateo de los datos para que sean adecuados para el modelado.
              <br />
              <br />
              Durante esta etapa, se identifican y manejan los datos faltantes
              para transformarlos en un formato que sea compatible con el modelo
              de minería de datos a utilizar. Además, se realizará la selección
              de características relevantes para asi crear un conjunto de datos
              final que servirá como base para el modelado y análisis
              subsiguientes.
            </Typography>
            <Button onClick={handleButtonClick}>Continuar</Button>
          </Stack>
        </Box>
      )}
      {!showDescription && <CleanData handleButtonClick={handleButtonClick} />}
    </Stack>
  );
};

export default PrepareData;

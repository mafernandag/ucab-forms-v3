import {
  Box,
  Stack,
  Typography,
  Button,
  Tooltip,
  RadioGroup,
  Radio,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import React, { useState, useContext } from "react";
import TooltipTitle from "./Sidebar/TooltipTitle";
import { ReportContext } from "../../pages/PrepareData";
import MaterialTable from "@material-table/core";

const CrossValidation = () => {
  const [targetVariable, setTargetVariable] = useState(null);
  const [selectTarget, setSelectTarget] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { labeledQuestions, deletedColumns } = useContext(ReportContext);
  const [results, setResults] = useState({});

  const targetVariableButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetVariable }),
      });
      const data = await response.json();

      const modelType = data.model_type;
      const bestModel = data.best_model;
      const bestParams = data.best_params;
      const bestStability = data.best_stability;
      setResults(data.results);

      console.log(modelType, bestModel, bestParams, bestStability);
      console.log(results);
      setLoading(false);
      setShowResults(true);
    } catch (error) {
      console.log("error in CrossValidation:", error);
    }
  };

  const data = Object.keys(results)
    .map((key) => ({
      model: key,
      ...results[key],
      best_params: JSON.stringify(results[key].best_params),
    }))
    .sort((a, b) => b.stability - a.stability);

  const columns = [
    { title: "Modelo", field: "model" },
    { title: "Puntuación de Validación Cruzada (%)", field: "best_score" },
    //{ title: "Best Params", field: "best_params" },
    { title: "Puntuación del Conjunto de Prueba (%)", field: "test_score" },
    //{ title: "Stability", field: "stability" },
  ];

  const handleButtonClick = () => {
    setSelectTarget(true);
  };

  return (
    <Box>
      {!selectTarget ? (
        <Stack alignItems={"center"} spacing={2}>
          <Typography variant="body1" align="center">
            Si no está seguro qué modelo de mineria de datos le conviene
            utilizar, realice un análisis de los datos primero para mostrar
            estadísticas y determinar el mejor modelo.
          </Typography>
          <Button variant="contained" onClick={handleButtonClick}>
            Realizar Análisis
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h6">Determinar el mejor modelo</Typography>
          <TooltipTitle
            title="Seleccione la variable a predecir (variable objetivo)"
            tooltip="Esta opción le permite seleccionar la variable que desea predecir con su modelo. Esta variable se conoce como la 'variable objetivo' o 'variable dependiente'. Debe ser una de las columnas en su conjunto de datos. Por ejemplo, si está construyendo un modelo para predecir precios de vivienda, su variable objetivo podría ser la columna 'Precio'. El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
            size="body1"
            color="text.secondary"
          />
          <RadioGroup
            value={targetVariable}
            onChange={(event) => setTargetVariable(event.target.value)}
          >
            {labeledQuestions
              .filter((question) => deletedColumns[question.id])
              .map((question, i) => (
                <FormControlLabel
                  key={i}
                  control={<Radio />}
                  value={question.title}
                  label={
                    <Typography variant="body1">{question.title}</Typography>
                  }
                />
              ))}
          </RadioGroup>
          <Button onClick={targetVariableButtonClick}>Procesar</Button>
          {loading && <CircularProgress />}
          {showResults && (
            <MaterialTable title="Resultados" data={data} columns={columns} />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default CrossValidation;

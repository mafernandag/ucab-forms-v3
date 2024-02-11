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
import React, { useState, useContext, useEffect } from "react";
import TooltipTitle from "./Sidebar/TooltipTitle";
import { ReportContext } from "../../pages/PrepareData";
import MaterialTable from "@material-table/core";
import { useReport } from "../../hooks/useReport";
import { useParams } from "react-router-dom";

const CrossValidation = () => {
  const { labeledQuestions, deletedColumns } = useReport();
  const { reportId } = useParams();
  const [targetVariable, setTargetVariable] = useState(null);
  const [selectTarget, setSelectTarget] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [data, setData] = useState([]);
  const [modelType, setModelType] = useState(null);
  const [bestModels, setBestModels] = useState(null);

  const targetVariableButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetVariable, reportId }),
      });
      const data = await response.json();

      if (data.model_type === "classification") {
        setModelType("Clasificación");
      } else if (data.model_type === "regression") {
        setModelType("Regresión");
      }

      setBestModels(data.best_models);
      //const bestStability = data.best_stability;
      setResults(data.results);

      setLoading(false);
      setShowResults(true);
    } catch (error) {
      console.log("error in CrossValidation:", error);
    }
  };

  useEffect(() => {
    console.log(modelType, bestModels, results);
  }, [modelType, bestModels, results]);

  useEffect(() => {
    if (results) {
      const newData = Object.keys(results)
        .map((key) => ({
          model: key,
          ...results[key],
          best_params: JSON.stringify(results[key].best_params),
        }))
        .sort((a, b) => a.stability - b.stability);
      setData(newData);
    }
  }, [results]);

  const columns = [
    { title: "Modelo", field: "model" },
    {
      title:
        modelType === "Regresión"
          ? "Puntuación de Validación Cruzada"
          : "Puntuación de Validación Cruzada (%)",
      field: "best_score",
    },
    //{ title: "Best Params", field: "best_params" },
    {
      title:
        modelType === "Regresión"
          ? "Puntuación del Conjunto de Prueba"
          : "Puntuación del Conjunto de Prueba (%)",
      field: "test_score",
    },
    { title: "Estabilidad", field: "stability" },
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
            utilizar, realice un análisis (validación cruzada) de los datos
            primero para mostrar estadísticas y determinar el mejor modelo.
          </Typography>
          <Button variant="contained" onClick={handleButtonClick}>
            Realizar Análisis
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h6">
            Determinar el mejor modelo de mineria de datos para su encuesta
          </Typography>
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
          <Stack
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ paddingBottom: "18px" }}
          >
            <Typography variant="body2" color="text.secondary">
              Tiempo aproximado de espera: 2 minutos
            </Typography>
            <Button onClick={targetVariableButtonClick} variant="contained">
              Procesar
            </Button>
            {loading && <CircularProgress />}
          </Stack>
          {showResults && !loading && (
            <Stack spacing={2}>
              <Typography variant="h6">Resultados</Typography>
              <Typography>
                Tipo de modelo a utilizar: <b>{modelType}</b>
              </Typography>
              <Typography>
                Mejor modelo:{" "}
                <b>{bestModels.map(([modelName]) => modelName).join(", ")}</b>
              </Typography>
              <MaterialTable
                title="Validación Cruzada"
                data={data}
                columns={columns}
                options={{
                  padding: "dense",
                }}
              />
              <Typography component="div">
                {/* La validación cruzada evalúa la habilidad del modelo para
                predecir nuevos datos. */}{" "}
                Para seleccionar el mejor modelo, tanto en clasificación como en
                regresión, se consideran la Puntuación del Conjunto de Prueba y
                la Estabilidad.
              </Typography>{" "}
              <Typography>
                Un modelo con alta puntuación de prueba y baja estabilidad es
                probablemente bueno. Sin embargo, si existe una gran diferencia
                entre la Puntuación de Validación Cruzada y la Puntuación del
                Conjunto de Prueba, es posible que el modelo esté sobreajustado.
              </Typography>
              <Typography component="div">
                <ul>
                  <li>
                    <b>Puntuación de Validación Cruzada</b>: Mejor puntuación
                    del modelo en el entrenamiento.
                  </li>
                  {/* <li>
                    <b>best_params</b>: Parámetros que dieron la mejor puntuación.
                  </li> */}
                  <li>
                    <b>Puntuación del Conjunto de Prueba</b>: Puntuación del
                    modelo en el conjunto de prueba, que son datos que el modelo
                    no ha visto durante el entrenamiento.
                  </li>
                  <li>
                    <b>Estabilidad</b>: Mide la consistencia del rendimiento del
                    modelo.
                  </li>
                </ul>
              </Typography>
              <Typography variant="body2">
                Advertencia: Las puntuaciones utilizadas para los modelos de
                regresión no tienen un límite superior y no están restringidas a
                un rango de 0 a 100. Una puntuación más alta indica un mejor
                rendimiento del modelo, pero el valor exacto depende de la
                escala de la variable objetivo y de la cantidad de error en las
                predicciones del modelo. Por lo tanto, no se debe interpretar la
                puntuación de un modelo de regresión como un porcentaje.
              </Typography>
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default CrossValidation;

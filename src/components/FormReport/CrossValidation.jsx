import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  CircularProgress,
  FormGroup,
  Checkbox,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowIcon } from "@mui/icons-material";
import React, { useState, useContext, useEffect } from "react";
import TooltipTitle from "./TooltipTitle";
import { ReportContext } from "../../pages/PrepareData";
import MaterialTable from "@material-table/core";
import { useReport } from "../../hooks/useReport";
import { useParams } from "react-router-dom";
import { set } from "lodash";

const CrossValidation = () => {
  const { labeledQuestions, deletedColumns } = useReport();
  const { reportId } = useParams();
  const [targetVariable, setTargetVariable] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPredictionResults, setShowPredictionResults] = useState(false);
  const [showClusteringResults, setShowClusteringResults] = useState(false);
  const [results, setResults] = useState({});
  const [data, setData] = useState([]);
  const [modelType, setModelType] = useState(null);
  const [bestModels, setBestModels] = useState(null);
  const [isSelectingOperation, setIsSelectingOperation] = useState(true);
  const [operationType, setOperationType] = useState(null);
  const [clusteringModel, setClusteringModel] = useState("");

  const [selectAll, setSelectAll] = useState(true);
  const [chosenColumns, setChosenColumns] = useState(
    Object.entries(deletedColumns).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {})
  );

  const handlePredictionModelButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetVariable, reportId, chosenColumns }),
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
      setShowPredictionResults(true);
    } catch (error) {
      console.log("error in CrossValidation:", error);
    }
  };

  const handleClusteringModelButtonClick = async () => {
    if (operationType === "agrupar") {
      setLoading(true);
      try {
        const response = await fetch("/cv_clustering", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reportId, chosenColumns }),
        });
        const data = await response.json();
        setClusteringModel(data["model"]);
        setLoading(false);
        setShowClusteringResults(true);
      } catch (error) {
        console.log("error in CrossValidation:", error);
      }
    }
  };

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
    {
      title:
        modelType === "Regresión"
          ? "Puntuación del Conjunto de Prueba"
          : "Puntuación del Conjunto de Prueba (%)",
      field: "test_score",
    },
    { title: "Estabilidad", field: "stability" },
  ];

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const newChosenColumns = {};
    labeledQuestions
      .filter((question) => deletedColumns[question.id])
      .forEach((question) => {
        newChosenColumns[question.id] = event.target.checked;
      });
    setChosenColumns(newChosenColumns);
  };

  const handleDescriptionButtonClick = () => {
    setShowDescription(true);
  };

  const handleBackButton = () => {
    setChosenColumns(
      Object.entries(deletedColumns).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {})
    );
    setSelectAll(true);
    setTargetVariable(null);
    setShowPredictionResults(false);
    setShowClusteringResults(false);
    setIsSelectingOperation(true);
  };

  const handleSelectOperation = () => {
    setIsSelectingOperation(false);
  };

  return (
    <Box sx={{ p: 1 }}>
      {!showDescription ? (
        <Stack alignItems={"center"} spacing={2}>
          <Typography align="center">
            Si no está seguro qué modelo de mineria de datos le conviene
            utilizar, realice un análisis (validación cruzada) de los datos
            primero para mostrar estadísticas y determinar el mejor modelo.
          </Typography>
          <Button variant="contained" onClick={handleDescriptionButtonClick}>
            Realizar Análisis
          </Button>
        </Stack>
      ) : (
        <Box>
          {isSelectingOperation ? (
            <Stack spacing={2}>
              <Typography>
                ¿Qué acción te gustaría realizar en tus datos?
              </Typography>
              <RadioGroup
                value={operationType}
                onChange={(event) => setOperationType(event.target.value)}
              >
                <FormControlLabel
                  control={<Radio />}
                  value={"predecir"}
                  label={<Typography>Predecir valores futuros</Typography>}
                />
                <FormControlLabel
                  control={<Radio />}
                  value={"agrupar"}
                  label={<Typography>Agrupar datos similares</Typography>}
                />
              </RadioGroup>
              <Stack
                spacing={3}
                justifyContent="center"
                alignItems="center"
                sx={{ pb: 2 }}
              >
                <Button
                  onClick={handleSelectOperation}
                  variant="contained"
                  disabled={operationType === null}
                >
                  Siguiente
                </Button>
                {loading && <CircularProgress />}
              </Stack>
            </Stack>
          ) : (
            <Box>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="start"
                alignItems="center"
                sx={{ pb: 1 }}
              >
                <IconButton onClick={handleBackButton}>
                  <ArrowIcon />
                </IconButton>
                <Typography variant="h6">
                  Determinar el mejor modelo de mineria de datos para su
                  encuesta
                </Typography>
              </Stack>
              {operationType === "predecir" ? (
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ py: 1 }} color="text.secondary">
                      1. Seleccione las columnas a incluir en el análisis
                    </Typography>
                    {/* SELECCION COLUMNAS */}
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        }
                        label="Seleccionar Todo"
                      />
                      {labeledQuestions
                        .filter((question) => deletedColumns[question.id])
                        .map((question, i) => (
                          <FormControlLabel
                            sx={{ py: 0.7 }}
                            key={i}
                            control={
                              <Checkbox
                                checked={chosenColumns[question.id]}
                                onChange={(e) => {
                                  setChosenColumns({
                                    ...chosenColumns,
                                    [question.id]: e.target.checked,
                                  });
                                  if (!e.target.checked) {
                                    setSelectAll(false);
                                  } else {
                                    const allChecked = Object.values({
                                      ...chosenColumns,
                                      [question.id]: e.target.checked,
                                    }).every(Boolean);
                                    setSelectAll(allChecked);
                                  }
                                }}
                              />
                            }
                            label={<Typography>{question.title}</Typography>}
                          />
                        ))}
                      {Object.values(chosenColumns).filter(Boolean).length <
                        2 && (
                        <Alert severity="warning">
                          Debe haber al menos dos columnas seleccionadas.
                        </Alert>
                      )}
                    </FormGroup>
                  </Box>
                  <TooltipTitle
                    title="2. Seleccione la variable a predecir (variable objetivo)"
                    tooltip="Esta opción le permite seleccionar la variable que desea predecir con su modelo. Esta variable se conoce como la 'variable objetivo' o 'variable dependiente'. Debe ser una de las columnas en su conjunto de datos. Por ejemplo, si está construyendo un modelo para predecir precios de vivienda, su variable objetivo podría ser la columna 'Precio'. El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
                    size="body1"
                    color="text.secondary"
                  />
                  {/* VARIABLE OBJETIVO */}
                  <RadioGroup
                    value={targetVariable}
                    onChange={(event) => setTargetVariable(event.target.value)}
                  >
                    {labeledQuestions
                      .filter((question) => chosenColumns[question.id])
                      .map((question, i) => (
                        <FormControlLabel
                          key={i}
                          control={<Radio />}
                          value={question.title}
                          label={<Typography>{question.title}</Typography>}
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
                    <Button
                      onClick={handlePredictionModelButtonClick}
                      variant="contained"
                      disabled={
                        Object.values(chosenColumns).filter(Boolean).length <
                          2 || targetVariable === null
                      }
                    >
                      Procesar
                    </Button>
                    {loading && <CircularProgress />}
                  </Stack>
                  {showPredictionResults && !loading && (
                    <Stack spacing={2}>
                      <Typography variant="h6">Resultados</Typography>
                      <Typography>
                        Tipo de modelo a utilizar: <b>{modelType}</b>
                      </Typography>
                      <Typography>
                        Mejor modelo:{" "}
                        <b>
                          {bestModels
                            .map(([modelName]) => modelName)
                            .join(", ")}
                        </b>
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
                        Para seleccionar el mejor modelo, tanto en clasificación
                        como en regresión, se consideran la Puntuación del
                        Conjunto de Prueba y la Estabilidad.
                      </Typography>{" "}
                      <Typography>
                        Un modelo con alta puntuación de prueba y baja
                        estabilidad es probablemente bueno. Sin embargo, si
                        existe una gran diferencia entre la Puntuación de
                        Validación Cruzada y la Puntuación del Conjunto de
                        Prueba, es posible que el modelo esté sobreajustado.
                      </Typography>
                      <Typography component="div">
                        <ul>
                          <li>
                            <b>Puntuación de Validación Cruzada</b>: Mejor
                            puntuación del modelo en el entrenamiento.
                          </li>
                          {/* <li>
                    <b>best_params</b>: Parámetros que dieron la mejor puntuación.
                  </li> */}
                          <li>
                            <b>Puntuación del Conjunto de Prueba</b>: Puntuación
                            del modelo en el conjunto de prueba, que son datos
                            que el modelo no ha visto durante el entrenamiento.
                          </li>
                          <li>
                            <b>Estabilidad</b>: Mide la consistencia del
                            rendimiento del modelo.
                          </li>
                        </ul>
                      </Typography>
                      <Typography variant="body2">
                        Advertencia: Las puntuaciones utilizadas para los
                        modelos de regresión no tienen un límite superior y no
                        están restringidas a un rango de 0 a 100. Una puntuación
                        más alta indica un mejor rendimiento del modelo, pero el
                        valor exacto depende de la escala de la variable
                        objetivo y de la cantidad de error en las predicciones
                        del modelo. Por lo tanto, no se debe interpretar la
                        puntuación de un modelo de regresión como un porcentaje.
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              ) : (
                <Box>
                  <Typography sx={{ py: 1 }} color="text.secondary">
                    Seleccione las columnas a incluir en el análisis
                  </Typography>
                  {/* SELECCION COLUMNAS CLUSTERING */}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAllChange}
                        />
                      }
                      label="Seleccionar Todo"
                    />
                    {labeledQuestions
                      .filter((question) => deletedColumns[question.id])
                      .map((question, i) => (
                        <FormControlLabel
                          sx={{ py: 0.7 }}
                          key={i}
                          control={
                            <Checkbox
                              checked={chosenColumns[question.id]}
                              onChange={(e) => {
                                setChosenColumns({
                                  ...chosenColumns,
                                  [question.id]: e.target.checked,
                                });
                                if (!e.target.checked) {
                                  setSelectAll(false);
                                } else {
                                  const allChecked = Object.values({
                                    ...chosenColumns,
                                    [question.id]: e.target.checked,
                                  }).every(Boolean);
                                  setSelectAll(allChecked);
                                }
                              }}
                            />
                          }
                          label={<Typography>{question.title}</Typography>}
                        />
                      ))}
                    {Object.values(chosenColumns).filter(Boolean).length <
                      2 && (
                      <Alert severity="warning">
                        Debe haber al menos dos columnas seleccionadas.
                      </Alert>
                    )}
                  </FormGroup>
                  <Stack
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ py: 2 }}
                  >
                    <Button
                      onClick={handleClusteringModelButtonClick}
                      variant="contained"
                      disabled={
                        Object.values(chosenColumns).filter(Boolean).length < 2
                      }
                    >
                      Procesar
                    </Button>
                    {loading && <CircularProgress />}
                  </Stack>

                  {showClusteringResults && !loading && (
                    <>
                      <Divider sx={{ my: 2 }} variant="middle" />
                      <Typography variant="h6" sx={{ pt: 1 }}>
                        Resultados
                      </Typography>
                      <Stack spacing={3} sx={{ pt: 2, pb: 3 }}>
                        <Typography>
                          El modelo más adecuado para realizar agrupamiento es:
                        </Typography>
                        <Typography variant="h5" textAlign="center">
                          {clusteringModel}
                        </Typography>
                        <Typography>
                          {(() => {
                            switch (clusteringModel) {
                              case "K-Modes":
                                return "El modelo K-Modes es ideal para el agrupamiento de datos categóricos. Este modelo es una variante del K-Means que, en lugar de utilizar la media de los clusters para el cálculo de la distancia, utiliza modas, lo que permite trabajar con datos categóricos.";
                              case "K-Prototypes":
                                return "El modelo K-Prototypes es útil para el agrupamiento de datos mixtos, es decir, datos numéricos y categóricos. Este modelo combina los enfoques de K-Means y K-Modes, permitiendo manejar ambos tipos de datos al mismo tiempo.";
                              case "K-Means":
                                return "El modelo K-Means es ampliamente utilizado para el agrupamiento de datos numéricos. Este modelo agrupa los datos en K grupos distintos, donde K es un número predefinido. Los grupos se forman minimizando la varianza dentro de cada grupo.";
                              default:
                                return "";
                            }
                          })()}
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CrossValidation;

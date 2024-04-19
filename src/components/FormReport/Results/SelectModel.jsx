import {
  Box,
  Stack,
  Typography,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Divider,
  FormGroup,
  Checkbox,
  Alert,
} from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
  ExpandMore,
} from "@mui/icons-material";
import ModelSection from "./ModelSection";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "../TooltipTitle";
import { useReport } from "../../../hooks/useReport";
import { useParams } from "react-router-dom";
import Chart from "../../../questions/components/Chart";
import ModelResults from "./ModelResults";
import { set } from "lodash";

const SelectModel = () => {
  const {
    labeledQuestions,
    deletedColumns,
    setModelProcessed,
    modelProcessed,
    setPredictionData,
  } = useReport();
  const { reportId } = useParams();

  const [selectedModel, setSelectedModel] = useState(null);
  const [modelCategory, setModelCategory] = useState(null);
  const [targetVariable, setTargetVariable] = useState(null);
  const [testSize, setTestSize] = useState(30);
  const [testAccuracy, setTestAccuracy] = useState(null);
  const [graphInfo, setGraphInfo] = useState(null);
  const [bestK, setBestK] = useState(null);
  const [clusteringScore, setClusteringScore] = useState(null);
  const [clusterData, setClusterData] = useState([]);
  const [centroidData, setCentroidData] = useState([]);

  const [loadingModelResults, setLoadingModelResults] = useState(false);

  const [selectAll, setSelectAll] = useState(true);
  const [chosenColumns, setChosenColumns] = useState(
    Object.entries(deletedColumns).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {})
  );

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

  const sections = [
    {
      category: "Clasificación",
      tooltip:
        "Se utilizan para predecir la pertenencia de una observación a una categoría o clase específica.",
      models: [
        { id: "1", label: "Árboles de decisión" },
        { id: "2", label: "Bosque Aleatorio" },
        { id: "3", label: "Potenciación del Gradiente" },
        { id: "4", label: "K Vecinos Más Próximos" },
      ],
    },
    {
      category: "Regresión",
      tooltip:
        "Se utilizan para predecir valores numéricos continuos. Estos modelos son útiles cuando se desea estimar o predecir una variable dependiente en función de una o más variables independientes.",
      models: [
        { id: "5", label: "Regresión Lineal" },
        { id: "6", label: "Bosque Aleatorio" },
        { id: "7", label: "K Vecinos Más Próximos" },
        { id: "8", label: "Árboles de decisión" },
      ],
    },
    {
      category: "Agrupamiento",
      tooltip:
        "Se utilizan para agrupar datos similares en conjuntos o clusters. Estos modelos son útiles cuando se desea identificar patrones o estructuras ocultas en los datos, sin la necesidad de tener etiquetas o categorías predefinidas.",
      models: [
        { id: "9", label: "K-Means" },
        { id: "10", label: "K-modes" },
        { id: "11", label: "K-prototypes" },
      ],
    },
  ];

  const handleButtonClick = async () => {
    console.log(testSize, targetVariable, selectedModel);
    setLoadingModelResults(true);
    try {
      const response = await fetch("/modelSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          targetVariable,
          selectedModel,
          testSize,
          chosenColumns,
        }),
      });
      const data = await response.json();
      console.log(data);
      setGraphInfo(data["graphData"]);
      if (selectedModel < 9) {
        setTestAccuracy(data["testAccuracy"].toFixed(2));
        setPredictionData(data["toPredict"]);
      } else {
        setBestK(data["bestK"]);
        setClusteringScore(data["score"]);
        setClusterData(JSON.parse(data["clusters"]));
        setCentroidData(JSON.parse(data["centroids"]));
      }
    } catch (error) {
      console.log("error in SelectModel:", error);
    }
    setModelProcessed(true);
    setLoadingModelResults(false);
  };

  const handleBackArrow = () => {
    setSelectedModel(null);
  };

  let selectedModelLabel = "";

  for (const section of sections) {
    for (const model of section.models) {
      if (model.id === selectedModel) {
        selectedModelLabel = model.label;
        break;
      }
    }

    if (selectedModelLabel) {
      break;
    }
  }

  const modelDescriptions = {
    11: (
      <>
        <Typography>
          A diferencia de otros modelos de agrupamiento, K-Prototypes puede
          manejar tanto variables numéricas como categóricas.
        </Typography>
        <Typography>
          <b>NOTA IMPORTANTE:</b> El algoritmo K-Prototypes debe utilizarse
          únicamente cuando los datos incluyen tanto variables numéricas como
          categóricas.
        </Typography>
      </>
    ),
    10: (
      <Typography>
        A diferencia de otros modelos de agrupamiento, K-Modes es adecuado para
        datos que contienen exclusivamente variables categóricas.
      </Typography>
    ),
    9: (
      <Typography>
        El algoritmo K-Means es adecuado para datos que contienen exclusivamente
        variables numéricas.
      </Typography>
    ),
  };

  return (
    <>
      {!modelProcessed ? (
        <Stack spacing={1} sx={{ p: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ pb: 1 }}>
              2. Análisis y Modelado
            </Typography>
            <Typography align="justify">
              En esta etapa se realiza el análisis de los datos limpios y se
              selecciona el modelo de minería de datos que será utilizado.
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={1} sx={{ p: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ pb: 1 }}>
              3. Evaluación e implementación
            </Typography>
            <Typography align="justify">
              En esta etapa se evalúa el rendimiento del modelo seleccionado y
              se muestran los resultados del mismo.
            </Typography>
          </Box>
        </Stack>
      )}

      <Divider />
      <Stack spacing={1}>
        {!modelProcessed && (
          <Box sx={{ p: 3 }}>
            {selectedModel == null ? (
              <Box>
                <Typography color="text.secondary">
                  Seleccione un modelo de minería de datos
                </Typography>
                <Stack
                  direction={"row"}
                  width={"100%"}
                  sx={{ textAlign: "-webkit-center" }}
                >
                  {!selectedModel &&
                    sections.map((section, k) => (
                      <ModelSection
                        key={k} // Add key prop with a unique value
                        category={section.category}
                        tooltip={section.tooltip}
                        models={section.models}
                        setSelectedModel={setSelectedModel}
                        selectedModel={selectedModel}
                        setModelCategory={setModelCategory}
                      />
                    ))}
                </Stack>
              </Box>
            ) : (
              <Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <ArrowIcon
                    sx={{ marginTop: "8px", marginBottom: "8px" }}
                    onClick={handleBackArrow}
                  />
                  <Typography variant="h6">
                    Modelo de {modelCategory}: {selectedModelLabel}
                  </Typography>
                </Stack>

                <Stack
                  spacing={2}
                  sx={{
                    px: 1,
                    pb: 2.3,
                    pt: 1.7,
                  }}
                >
                  <Box>
                    <Typography sx={{ py: 1 }}>
                      1. Seleccione las columnas a incluir en el entrenamiento
                      del modelo
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
                  {parseInt(selectedModel) < 9 ? (
                    <>
                      <Box>
                        <Box sx={{ py: 1 }}>
                          <TooltipTitle
                            title="2. Seleccione la variable a predecir (variable objetivo)"
                            tooltip="Esta opción le permite seleccionar la variable que desea predecir con su modelo. Esta variable se conoce como la 'variable objetivo' o 'variable dependiente'. Debe ser una de las columnas en su conjunto de datos. Por ejemplo, si está construyendo un modelo para predecir precios de vivienda, su variable objetivo podría ser la columna 'Precio'. El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
                            size="body1"
                          />
                          <Box sx={{ py: 0.5 }}>
                            {modelCategory === "Clasificación" ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Asegúrese de que la variable objetivo
                                seleccionada es categórica para modelos de
                                clasificación.
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Asegúrese de que la variable objetivo
                                seleccionada es numérica para modelos de
                                regresión.
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        {/* VARIABLE OBJETIVO */}
                        <RadioGroup
                          value={targetVariable}
                          onChange={(event) =>
                            setTargetVariable(event.target.value)
                          }
                        >
                          {labeledQuestions
                            .filter((question) => chosenColumns[question.id])
                            .map((question, i) => (
                              <FormControlLabel
                                key={i}
                                control={<Radio />}
                                value={question.title}
                                label={
                                  <Typography>{question.title}</Typography>
                                }
                              />
                            ))}
                        </RadioGroup>
                      </Box>
                      <div sx={{ width: "100%" }}>
                        <Accordion
                          sx={{
                            boxShadow: "none",
                            border: "none",
                            width: "100%",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography
                              color="text.secondary"
                              sx={{ paddingY: "5px" }}
                            >
                              Configuración avanzada
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={2}>
                              <TooltipTitle
                                title="Proporción del dataset para el conjunto de prueba"
                                tooltip="Proporción del dataset que se utilizará para el conjunto de prueba al dividir los datos en conjuntos de entrenamiento y prueba. Debe ser un número entre 0 y 100. Por ejemplo, si introduce 20, el 20% de los datos se utilizarán para el conjunto de prueba y el 80% restante para el conjunto de entrenamiento. Esta división ayuda a evaluar el rendimiento del modelo en datos no vistos durante el entrenamiento"
                                size="body1"
                              />
                              <TextField
                                type="number"
                                defaultValue={30}
                                variant="outlined"
                                onChange={(e) => setTestSize(e.target.value)}
                                error={
                                  testSize <= 0 ||
                                  testSize > 100 ||
                                  testSize === ""
                                }
                                helperText={
                                  testSize <= 0 ||
                                  testSize > 100 ||
                                  testSize === ""
                                    ? "Debe ser un número entre 0 y 100"
                                    : "Se recomienda un valor entre 20 y 30"
                                }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ marginBottom: "10px" }}
                              />
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </>
                  ) : (
                    <Stack spacing={1}>
                      <Typography>
                        Los modelos de clustering se usan para agrupar datos
                        similares sin la necesidad de especificar una variable a
                        predecir. Solo se requieren las variables descriptivas
                        del conjunto de datos como entrada a estos algoritmos.
                        La salida son los clusters o grupos identificados.
                      </Typography>

                      {modelDescriptions[selectedModel]}
                    </Stack>
                  )}

                  <Button
                    onClick={handleButtonClick}
                    disabled={
                      selectedModel > 8
                        ? false
                        : testSize <= 0 ||
                          testSize > 100 ||
                          testSize === "" ||
                          targetVariable === null ||
                          Object.values(chosenColumns).filter(Boolean).length <
                            2
                    }
                  >
                    Entrenar Modelo
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Stack>
      {modelProcessed && (
        <ModelResults
          testAccuracy={testAccuracy}
          selectedModelLabel={selectedModelLabel}
          graphInfo={graphInfo}
          targetVariable={targetVariable}
          modelCategory={modelCategory}
          selectedModel={selectedModel}
          bestK={bestK}
          clusteringScore={clusteringScore}
          clusterData={clusterData}
          centroidData={centroidData}
        />
      )}
      <Stack justifyContent="center" alignItems="center" sx={{ pb: 2 }}>
        {loadingModelResults && <CircularProgress xs={{ pb: 2 }} />}
      </Stack>
    </>
  );
};

export default SelectModel;

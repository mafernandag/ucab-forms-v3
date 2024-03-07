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
} from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
  ExpandMore,
} from "@mui/icons-material";
import ModelSection from "./ModelSection";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "../Sidebar/TooltipTitle";
import { useReport } from "../../../hooks/useReport";
import { useParams } from "react-router-dom";
import Chart from "../../../questions/components/Chart";
import ModelResults from "./ModelResults";

const SelectModel = () => {
  const {
    labeledQuestions,
    deletedColumns,
    setModelProcessed,
    modelProcessed,
  } = useReport();
  const { reportId } = useParams();
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelCategory, setModelCategory] = useState(null);
  const [targetVariable, setTargetVariable] = useState(null);
  const [testSize, setTestSize] = useState(30);
  const [testAccuracy, setTestAccuracy] = useState(null);
  const [graphInfo, setGraphInfo] = useState(null);

  const [loadingModelResults, setLoadingModelResults] = useState(false);

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
        { id: "9", label: "K-prototypes" },
        { id: "10", label: "K-modes" },
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
        }),
      });
      const data = await response.json();
      console.log(data);
      setTestAccuracy(data["testAccuracy"].toFixed(2));
      setGraphInfo(data["graphData"]);
      //console.log(graphData, graphLabels);
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

  return (
    <>
      {!modelProcessed ? (
        <Stack spacing={1} sx={{ p: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ pb: 1 }}>
              2. Análisis y Modelado
            </Typography>
            <Typography variant="body1" align="justify">
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
            <Typography variant="body1" align="justify">
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
                <Typography variant="body1" color="text.secondary">
                  Seleccione un modelo de minería de datos
                </Typography>
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
                    paddingX: "12px",
                    paddingBottom: "20px",
                    paddingTop: "16px",
                  }}
                >
                  {parseInt(selectedModel) < 9 ? (
                    <>
                      <TooltipTitle
                        title="Seleccione la variable a predecir (variable objetivo)"
                        tooltip="Esta opción le permite seleccionar la variable que desea predecir con su modelo. Esta variable se conoce como la 'variable objetivo' o 'variable dependiente'. Debe ser una de las columnas en su conjunto de datos. Por ejemplo, si está construyendo un modelo para predecir precios de vivienda, su variable objetivo podría ser la columna 'Precio'. El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
                        size="body1"
                      />
                      {modelCategory === "Clasificación" ? (
                        <Typography variant="body2" color="text.secondary">
                          Asegúrese de que la variable objetivo seleccionada es
                          categórica para modelos de clasificación.
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Asegúrese de que la variable objetivo seleccionada es
                          numérica para modelos de regresión.
                        </Typography>
                      )}
                      <RadioGroup
                        value={targetVariable}
                        onChange={(event) =>
                          setTargetVariable(event.target.value)
                        }
                      >
                        {labeledQuestions
                          .filter((question) => deletedColumns[question.id])
                          .map((question, i) => (
                            <FormControlLabel
                              key={i}
                              control={<Radio />}
                              value={question.title}
                              label={
                                <Typography variant="body1">
                                  {question.title}
                                </Typography>
                              }
                            />
                          ))}
                      </RadioGroup>

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
                              variant="body1"
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

                      {selectedModel === "9" && (
                        <>
                          <Typography>
                            A diferencia de otros modelos de agrupamiento,
                            K-Prototypes puede manejar tanto variables numéricas
                            como categóricas.
                          </Typography>
                          <Typography>
                            <b>NOTA IMPORTANTE:</b> El algoritmo K-Prototypes
                            debe utilizarse únicamente cuando los datos incluyen
                            tanto variables numéricas como categóricas. Si tus
                            datos contienen exclusivamente variables{" "}
                            <b>categóricas</b>, debes optar por el algoritmo{" "}
                            <b>K-Modes</b>. En cambio, si tus datos contienen
                            únicamente variables <b>numéricas</b>, el algoritmo
                            más adecuado es <b>K-Means</b>.
                          </Typography>
                        </>
                      )}
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
                          targetVariable === null
                    }
                  >
                    Entrenar Modelo
                  </Button>
                </Stack>
              </Box>
            )}
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
        )}
      </Stack>
      {modelProcessed && (
        <ModelResults
          testAccuracy={testAccuracy}
          selectedModelLabel={selectedModelLabel}
          graphInfo={graphInfo}
          targetVariable={targetVariable}
          modelCategory={modelCategory}
        />
      )}
      <Stack justifyContent="center" alignItems="center" sx={{ pb: 2 }}>
        {loadingModelResults && <CircularProgress />}
      </Stack>
    </>
  );
};

export default SelectModel;

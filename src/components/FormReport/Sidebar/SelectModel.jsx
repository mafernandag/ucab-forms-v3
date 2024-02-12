import {
  Box,
  Stack,
  Typography,
  Button,
  Tooltip,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  TextField,
  InputAdornment,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
  ExpandMore,
} from "@mui/icons-material";
import ModelSection from "./ModelSection";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "./TooltipTitle";
import { useReport } from "../../../hooks/useReport";
import { useParams } from "react-router-dom";

const SelectModel = () => {
  const { reportId } = useParams();
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelCategory, setModelCategory] = useState(null);
  const [targetVariable, setTargetVariable] = useState(null);
  const [testSize, setTestSize] = useState(20);
  const [testAccuracy, setTestAccuracy] = useState(null);
  const {
    labeledQuestions,
    deletedColumns,
    setModelProcessed,
    modelProcessed,
  } = useReport();

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
      tooltip: "",
      models: [
        { id: "5", label: "Regresión Lineal" },
        { id: "6", label: "Árboles de decisión" },
        { id: "7", label: "K Vecinos Más Próximos" },
      ],
    },
    /* {
      category: "Agrupamiento",
      tooltip: "",
      models: [
        { id: "3", label: "K-means" },
        { id: "4", label: "DBSCAN" },
      ],
    }, */
  ];

  const handleButtonClick = async () => {
    console.log(testSize, targetVariable, selectedModel);
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
      setTestAccuracy(data["testAccuracy"]);
      console.log(data);
    } catch (error) {
      console.log("error in SelectModel:", error);
    }
    setModelProcessed(true);
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
    <Stack spacing={1}>
      {!modelProcessed && (
        <Box>
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
                  Modelo: {selectedModelLabel}
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
                          defaultValue={20}
                          variant="outlined"
                          onChange={(e) => setTestSize(e.target.value)}
                          error={
                            testSize <= 0 || testSize > 100 || testSize === ""
                          }
                          helperText={
                            testSize <= 0 || testSize > 100 || testSize === ""
                              ? "Debe ser un número entre 0 y 100"
                              : "Se recomienda un valor entre 20 y 30"
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          sx={{ marginBottom: "10px" }}
                        />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <Button
                  onClick={handleButtonClick}
                  disabled={
                    testSize <= 0 ||
                    testSize > 100 ||
                    testSize === "" ||
                    targetVariable === null
                  }
                >
                  Aceptar
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
                  setModelCategory={setModelCategory}
                />
              ))}
          </Stack>
        </Box>
      )}

      {modelProcessed && (
        <Box>
          <TooltipTitle
            title="Precisión del modelo"
            size="h6"
            tooltip="Varia según la cantidad de datos en la encuesta, ya que el modelo puede que no sea capaz de aprender los patrones y relaciones subyacentes de manera efectiva si no se tienen los datos suficientes."
          />
          <Typography variant="h6">{testAccuracy}</Typography>
        </Box>
      )}
    </Stack>
  );
};

export default SelectModel;

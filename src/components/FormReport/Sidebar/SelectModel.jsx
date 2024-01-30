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
} from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
} from "@mui/icons-material";
import ModelSection from "./ModelSection";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "./TooltipTitle";

const SelectModel = ({ setTestAccuracy }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [targetVariable, setTargetVariable] = useState(null);
  const [testSize, setTestSize] = useState(20);
  const [validationSize, setValidationSize] = useState(10);
  const { labeledQuestions, deletedColumns, setModelProcessed } =
    useContext(ReportContext);

  const sections = [
    {
      category: "Clasificacion",
      tooltip:
        "Se utilizan para predecir la pertenencia de una observación a una categoría o clase específica.",
      models: [
        { id: "1", label: "Árboles de decisión" },
        { id: "2", label: "Redes neuronales artificiales" },
      ],
    },
    {
      category: "Agrupamiento",
      tooltip: "",
      models: [
        { id: "3", label: "K-means" },
        { id: "4", label: "DBSCAN" },
      ],
    },
    {
      category: "Regresión",
      tooltip: "",
      models: [
        { id: "5", label: "Regresión Lineal" },
        { id: "6", label: "Árboles de decisión" },
      ],
    },
  ];

  const handleButtonClick = async () => {
    console.log(testSize, validationSize, targetVariable, selectedModel);
    try {
      const response = await fetch("/modelSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetVariable,
          validationSize,
          selectedModel,
          testSize,
        }),
      });
      const data = await response.json();
      //setTestAccuracy(data["testAccuracy"]);
      console.log(data);
    } catch (error) {
      console.log("error in SelectModel:", error);
    }
    setModelProcessed(true);
  };

  const handleBackArrow = () => {
    setSelectedModel(null);
  };

  return (
    <Stack spacing={1}>
      {selectedModel == null ? (
        <Box>
          <Typography variant="body1" color="text.secondary">
            Seleccione un modelo de minería de datos
          </Typography>
        </Box>
      ) : (
        <Box>
          <ArrowIcon
            sx={{ marginTop: "8px", marginBottom: "8px" }}
            onClick={handleBackArrow}
          />
          <Stack spacing={2} sx={{ paddingX: "12px", paddingY: "20px" }}>
            <TooltipTitle
              title="Seleccione la variable a predecir (variable objetivo)"
              tooltip="Esta opción le permite seleccionar la variable que desea predecir con su modelo. Esta variable se conoce como la 'variable objetivo' o 'variable dependiente'. Debe ser una de las columnas en su conjunto de datos. Por ejemplo, si está construyendo un modelo para predecir precios de vivienda, su variable objetivo podría ser la columna 'Precio'. El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
              size="body1"
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
            <Divider variant="middle" />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ paddingBottom: "10px" }}
            >
              Configuración avanzada
            </Typography>
            <TooltipTitle
              title="Proporción del dataset para el conjunto de prueba"
              tooltip="Proporción del dataset que se utilizará para el conjunto de prueba al dividir los datos en conjuntos de entrenamiento, validación y prueba. Debe ser un número entre 0 y 100. Por ejemplo, si introduce 20, el 20% de los datos se utilizarán para el conjunto de validación, el 20% para el conjunto de prueba y el 60% restante para el conjunto de entrenamiento. Esta división ayuda a evaluar el rendimiento del modelo en datos no vistos durante el entrenamiento y ajustar los hiperparámetros del modelo."
              size="body1"
            />
            <TextField
              type="number"
              defaultValue={20}
              variant="outlined"
              onChange={(e) => setTestSize(e.target.value)}
              error={testSize <= 0 || testSize > 100 || testSize === ""}
              helperText={
                testSize <= 0 || testSize > 100 || testSize === ""
                  ? "Debe ser un número entre 0 y 100"
                  : "Se recomienda un valor entre 20 y 30"
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <TooltipTitle
              title="Proporción del dataset para el conjunto de validación"
              tooltip="Proporción del dataset que se utilizará para el conjunto de validación al dividir los datos en conjuntos de entrenamiento, validación y prueba. Debe ser un número entre 0 y 100. Por ejemplo, si introduce 20, el 20% de los datos se utilizarán para el conjunto de validación, el 20% para el conjunto de prueba y el 60% restante para el conjunto de entrenamiento. Esta división ayuda a evaluar el rendimiento del modelo en datos no vistos durante el entrenamiento y ajustar los hiperparámetros del modelo."
              size="body1"
            />
            <TextField
              type="number"
              defaultValue={10}
              variant="outlined"
              onChange={(e) => setValidationSize(e.target.value)}
              error={
                validationSize <= 0 ||
                validationSize > 100 ||
                validationSize === ""
              }
              helperText={
                validationSize <= 0 ||
                validationSize > 100 ||
                validationSize === ""
                  ? "Debe ser un número entre 0 y 100"
                  : "Se recomienda un valor entre 10 y 20"
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <Button
              onClick={handleButtonClick}
              disabled={
                validationSize <= 0 ||
                validationSize > 100 ||
                validationSize === "" ||
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
            />
          ))}
      </Stack>
    </Stack>
  );
};

export default SelectModel;

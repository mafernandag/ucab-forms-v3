import {
  Box,
  Stack,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Tooltip,
  Divider,
  TextField,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "./TooltipTitle";

const CleanData = ({ handleButtonClick }) => {
  const {
    deletedColumns,
    setDeletedColumns,
    labeledQuestions,
    setCleanedData,
    deletedRows,
    setLoadingProcessedData,
    loadingData,
    reportTitle,
  } = useContext(ReportContext);

  const [missingDataOption, setMissingDataOption] = useState("delete");
  const [removeDuplicateData, setRemoveDuplicateData] = useState(true);
  const [expandMultipleChoiceAnswers, setExpandMultipleChoiceAnswers] =
    useState(true);
  const [numericFillValue, setNumericFillValue] = useState(0);
  const [textFillValue, setTextFillValue] = useState("Vacio");

  const handleRadioChange = (event) => {
    setMissingDataOption(event.target.value);
  };

  const handleProcessingButtonClick = async () => {
    setLoadingProcessedData(true);
    const settings = {
      missingDataOption,
      removeDuplicateData,
      expandMultipleChoiceAnswers,
      numericFillValue,
      textFillValue,
    };
    console.log("sending deletedRows", deletedRows);
    try {
      const response = await fetch("/cleaningSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportTitle,
          settings,
          deletedColumns,
          deletedRows,
        }),
      });
      const res = await response.json();
      console.log("res from /cleaningSettings:", res);
      setCleanedData(JSON.parse(res["cleanDf"]));
      setLoadingProcessedData(false);
    } catch (error) {
      console.log("error in /cleaningSettings:", error);
    }
  };

  return (
    <Stack spacing={5}>
      <Box>
        <ArrowIcon
          sx={{ marginTop: "8px", marginBottom: "8px" }}
          onClick={handleButtonClick}
        />
        <Stack
          spacing={2}
          sx={{ paddingX: "12px", paddingTop: "10px", paddingBottom: "20px" }}
        >
          <Typography variant="h6">Preparación de los datos</Typography>
          <Typography variant="body1" color="text.secondary">
            Seleccione las preguntas a incluir en el modelo
          </Typography>
          {/* <Typography variant="body1">
            Se recomienda escoger preguntas con respuestas categoricas
          </Typography> */}
          <FormGroup>
            {labeledQuestions.map((question, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    checked={deletedColumns[question.id]}
                    onChange={(e) =>
                      setDeletedColumns({
                        ...deletedColumns,
                        [question.id]: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Typography variant="body1">{question.title}</Typography>
                }
              />
            ))}
          </FormGroup>
          <Typography variant="body2" color="text.secondary">
            Para eliminar respuestas, seleccione las filas desde la tabla de
            datos
          </Typography>
        </Stack>
        <Divider variant="middle" />
        <Stack spacing={2} sx={{ paddingX: "12px", paddingY: "20px" }}>
          <Typography variant="body1" color="text.secondary">
            Ajustes de limpieza de datos
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={removeDuplicateData}
                  onChange={(e) => setRemoveDuplicateData(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1">
                  Eliminar datos duplicados
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={expandMultipleChoiceAnswers}
                  onChange={(e) =>
                    setExpandMultipleChoiceAnswers(e.target.checked)
                  }
                />
              }
              label={
                <TooltipTitle
                  title="Expandir respuestas de opción múltiple"
                  tooltip="Se crearán nuevas columnas para así desglosar las respuestas de opción múltiple en datos individuales, lo cual facilita el análisis detallado de cada opción"
                  size="body1"
                />
              }
            />
          </FormGroup>
          <RadioGroup value={missingDataOption} onChange={handleRadioChange}>
            <Typography variant="body1" color="text.secondary" pb={"8px"}>
              Manejo de valores faltantes
            </Typography>
            <FormControlLabel
              control={<Radio />}
              value="delete"
              label={<Typography variant="body1">Eliminar fila</Typography>}
            />
            <FormControlLabel
              control={<Radio />}
              value="fill"
              label={
                <Typography variant="body1">
                  Rellenar con valores sustitutos
                </Typography>
              }
            />
            {missingDataOption === "fill" && (
              <Stack spacing={2} sx={{ margin: "10px 0 15px 30px" }}>
                <TextField
                  label="Valor para columnas númericas"
                  type="number"
                  defaultValue={0}
                  variant="standard"
                  onChange={(e) => setNumericFillValue(e.target.value)}
                  error={
                    missingDataOption === "fill" && numericFillValue === ""
                  }
                  helperText={
                    missingDataOption === "fill" &&
                    numericFillValue === "" &&
                    "Este campo es requerido"
                  }
                />
                <TextField
                  label="Valor para columnas de texto"
                  type="text"
                  defaultValue="Vacio"
                  variant="standard"
                  onChange={(e) => setTextFillValue(e.target.value)}
                  error={
                    missingDataOption === "fill" && textFillValue.trim() === ""
                  }
                  helperText={
                    missingDataOption === "fill" &&
                    textFillValue.trim() === "" &&
                    "Este campo es requerido"
                  }
                />
              </Stack>
            )}
            <FormControlLabel
              control={<Radio />}
              value="previousRow"
              label={
                <Typography variant="body1">
                  Rellenar con el valor de la fila anterior
                </Typography>
              }
            />
            <FormControlLabel
              control={<Radio />}
              value="nextRow"
              label={
                <Typography variant="body1">
                  Rellenar con el valor de la fila siguiente
                </Typography>
              }
            />
          </RadioGroup>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            sx={{ marginY: "8px" }}
            variant="contained"
            onClick={handleProcessingButtonClick}
            disabled={
              loadingData ||
              (missingDataOption === "fill" &&
                (numericFillValue === null ||
                  numericFillValue === undefined ||
                  numericFillValue === "" ||
                  !textFillValue.trim()))
            }
          >
            Procesar Datos
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default CleanData;

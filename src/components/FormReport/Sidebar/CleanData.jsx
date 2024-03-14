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
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import React, { useState, useContext } from "react";
import { ReportContext } from "../../../pages/PrepareData";
import TooltipTitle from "./TooltipTitle";
import { useReport } from "../../../hooks/useReport";
import { useNavigate } from "react-router-dom";

const CleanData = ({ handleButtonClick }) => {
  const navigate = useNavigate();
  const {
    deletedColumns,
    setDeletedColumns,
    labeledQuestions,
    setCleanedData,
    deletedRows,
    setLoadingProcessedData,
    loading,
    reportTitle,
  } = useReport();

  const [missingDataOption, setMissingDataOption] = useState("delete");
  const [outlierValuesOption, setOutlierValuesOption] = useState("delete");
  const [removeDuplicateData, setRemoveDuplicateData] = useState(true);
  const [expandMultipleChoiceAnswers, setExpandMultipleChoiceAnswers] =
    useState(true);
  const [numericFillValue, setNumericFillValue] = useState(0);
  const [textFillValue, setTextFillValue] = useState("No aplica");
  const [selectAll, setSelectAll] = useState(true);

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const newDeletedColumns = {};
    labeledQuestions.forEach((question) => {
      newDeletedColumns[question.id] = event.target.checked;
    });
    setDeletedColumns(newDeletedColumns);
  };

  const handleRadioMissingDataChange = (event) => {
    setMissingDataOption(event.target.value);
  };

  const handleRadioOutlierChange = (event) => {
    setOutlierValuesOption(event.target.value);
  };

  const handleProcessingButtonClick = async () => {
    setLoadingProcessedData(true);
    const settings = {
      missingDataOption,
      outlierValuesOption,
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
      console.log("redirecting to:", res["redirectUrl"]);
      navigate(res["redirectUrl"]);
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
          <Typography color="text.secondary">
            Seleccione las preguntas a incluir en el modelo
          </Typography>
          {/* <Typography >
            Se recomienda escoger preguntas con respuestas categoricas
          </Typography> */}
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
            {labeledQuestions.map((question, i) => (
              <FormControlLabel
                sx={{ paddingY: "6px" }}
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
                label={<Typography>{question.title}</Typography>}
              />
            ))}
            {Object.values(deletedColumns).filter(Boolean).length < 2 && (
              <Alert severity="warning">
                Debe haber al menos dos preguntas seleccionadas.
              </Alert>
            )}
          </FormGroup>
          <Typography variant="body2" color="text.secondary">
            Para eliminar respuestas, seleccione las filas desde la tabla de
            datos
          </Typography>
        </Stack>
        <Divider variant="middle" />
        <Stack spacing={2} sx={{ paddingX: "12px", paddingY: "20px" }}>
          <Typography color="text.secondary">
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
              label={<Typography>Eliminar datos duplicados</Typography>}
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
          {/* MANEJO DE VALORES FALTANTES */}
          <RadioGroup
            value={missingDataOption}
            onChange={handleRadioMissingDataChange}
          >
            <Typography color="text.secondary" pb={"8px"}>
              Manejo de valores faltantes
            </Typography>
            <FormControlLabel
              control={<Radio />}
              value="delete"
              label={<Typography>Eliminar fila</Typography>}
            />
            <FormControlLabel
              control={<Radio />}
              value="mean"
              label={
                <Typography>Rellenar con el promedio de la columna</Typography>
              }
            />
            <FormControlLabel
              control={<Radio />}
              value="fill"
              label={<Typography>Rellenar con valores sustitutos</Typography>}
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
                  defaultValue="No aplica"
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
                <Typography>
                  Rellenar con el valor de la fila anterior
                </Typography>
              }
            />
            <FormControlLabel
              control={<Radio />}
              value="nextRow"
              label={
                <Typography>
                  Rellenar con el valor de la fila siguiente
                </Typography>
              }
            />
          </RadioGroup>
          {/* MANEJO DE VALORES ATIPICOS */}
          <RadioGroup
            value={outlierValuesOption}
            onChange={handleRadioOutlierChange}
          >
            <Box sx={{ pb: 1 }}>
              <TooltipTitle
                title="Manejo de valores atípicos (outliers)"
                tooltip="Un valor atípico o outlier es un valor en un conjunto de datos que es muy diferente del resto de los valores"
                size="body1"
                color="text.secondary"
              />
            </Box>
            <FormControlLabel
              control={<Radio />}
              value="delete"
              label={<Typography>Eliminar fila</Typography>}
            />
            <FormControlLabel
              control={<Radio />}
              value="mean"
              label={
                <Typography>
                  Reemplazar con el promedio de la columna
                </Typography>
              }
            />
            <FormControlLabel
              control={<Radio />}
              value="ignore"
              label={<Typography>Ignorar</Typography>}
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
              loading ||
              (missingDataOption === "fill" &&
                (numericFillValue === null ||
                  numericFillValue === undefined ||
                  numericFillValue === "" ||
                  !textFillValue.trim())) ||
              Object.values(deletedColumns).filter(Boolean).length < 2
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

import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import TooltipTitle from "../Sidebar/TooltipTitle";
import { getGraphs } from "../../../api/reports";
import { useParams } from "react-router-dom";
import { useReport } from "../../../hooks/useReport";
import ResultGraph from "./ResultGraph";

const ModelResults = ({
  testAccuracy,
  selectedModelLabel,
  graphInfo,
  targetVariable,
  modelCategory,
}) => {
  const { id: formId, reportId } = useParams();
  const { setModelProcessed } = useReport();

  const [confusionMatrix, setConfusionMatrix] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [treeGraph, setTreeGraph] = useState(null);
  const [pairplot, setPairplot] = useState(null);
  const [loadingGraphs, setLoadingGraphs] = useState(true);
  const [currentTab, setCurrentTab] = useState("1");

  useEffect(() => {
    const fetchGraphs = async () => {
      const { confusionMatrix, tree, featureImportance, pairplot } =
        await getGraphs(formId, reportId);
      if (graphInfo.confusionMatrix) {
        setConfusionMatrix(confusionMatrix);
      }
      if (graphInfo.featureImportance) {
        setFeatureImportance(featureImportance);
      }
      if (graphInfo.tree) {
        setTreeGraph(tree);
      }
      if (graphInfo.pairplot) {
        setPairplot(pairplot);
      }
      setLoadingGraphs(false);
    };
    fetchGraphs();
  }, []);

  const handleBackArrow = () => {
    setModelProcessed(false);
  };

  const handleTabChange = (e, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ pb: 2 }}
            justifyContent={"space-between"}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <ArrowIcon
                sx={{ marginTop: "8px", marginBottom: "8px" }}
                onClick={handleBackArrow}
              />
              <Typography variant="h6">
                Resultados del Modelo: {selectedModelLabel}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Guardar Modelo
              </Typography>
              <SaveIcon />
            </Stack>
          </Stack>
          <Box sx={{ pb: 3 }}>
            <TooltipTitle
              title="Variable a predecir (variable objetivo)"
              tooltip="El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
              size="body1"
            />
            <Typography variant="h5">{targetVariable}</Typography>
          </Box>
          {modelCategory === "Regresión" && (
            <>
              <TooltipTitle
                title="Puntuación del modelo"
                size="body1"
                tooltip="Varia según la cantidad de datos en la encuesta, ya que el modelo puede que no sea capaz de aprender los patrones y relaciones subyacentes de manera efectiva si no se tienen los datos suficientes."
              />

              <Typography variant="h5">{testAccuracy} puntos</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
                *En el caso de los modelos de regresión, un puntaje más cercano
                a cero indica un mejor rendimiento del modelo.
              </Typography>
            </>
          )}
          {modelCategory === "Clasificación" && (
            <>
              <TooltipTitle
                title="Precisión del modelo"
                size="body1"
                tooltip="Varia según la cantidad de datos en la encuesta, ya que el modelo puede que no sea capaz de aprender los patrones y relaciones subyacentes de manera efectiva si no se tienen los datos suficientes."
              />
              <Typography variant="h5">{testAccuracy}%</Typography>
            </>
          )}
        </Box>
      </Stack>
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleTabChange}
            aria-label="model results tabs"
            centered
            variant="fullWidth"
          >
            <Tab label="Gráficos y Estadísticas" value="1" />
            {modelCategory === "Clasificación" ||
            modelCategory === "Regresión" ? (
              <Tab label="Realizar Predicciones" value="2" />
            ) : (
              <Tab label="Clustering" value="2" />
            )}
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stack spacing={3}>
            <Typography variant="h6">Gráficos y Estadísticas</Typography>
            {pairplot && (
              <ResultGraph
                imgUrl={pairplot}
                loadingGraphs={loadingGraphs}
                title={"Pairplot"}
                description={
                  "Permite visualizar la relación entre las diferentes variables en la encuesta."
                }
                imgStyle={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            {featureImportance && (
              <ResultGraph
                imgUrl={featureImportance}
                loadingGraphs={loadingGraphs}
                title={"Importancia de las características"}
                description={
                  "Este gráfico es útil para entender qué características están contribuyendo más a las predicciones del modelo."
                }
              />
            )}
            {treeGraph && (
              <ResultGraph
                imgUrl={treeGraph}
                loadingGraphs={loadingGraphs}
                title={"Árbol de Decisión"}
                description={
                  "Visualización del árbol de decisión que se utilizó para el modelo."
                }
                imgStyle={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            {confusionMatrix && (
              <ResultGraph
                imgUrl={confusionMatrix}
                loadingGraphs={loadingGraphs}
                title={"Matriz de Confusión"}
                description={
                  "Permite la visualización del rendimiento del modelo. Cada fila de la matriz representa las instancias en una clase predicha, mientras que cada columna representa las instancias en una clase real."
                }
              />
            )}
          </Stack>
        </TabPanel>
        {modelCategory === "Clasificación" || modelCategory === "Regresión" ? (
          <TabPanel value="2">Predicciones</TabPanel>
        ) : (
          <TabPanel value="2">Clustering</TabPanel>
        )}
      </TabContext>
    </>
  );
};

export default ModelResults;

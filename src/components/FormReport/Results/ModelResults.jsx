import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Tab,
  IconButton,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import TooltipTitle from "../TooltipTitle";
import { getGraphs } from "../../../api/reports";
import { useParams } from "react-router-dom";
import { useReport } from "../../../hooks/useReport";
import ResultGraph from "./ResultGraph";
import Predictions from "../Predictions/Predictions";
import ClusterData from "../Tables/ClusterData";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportPDF from "../ReportPDF";

const ModelResults = ({
  testAccuracy,
  selectedModelLabel,
  graphInfo,
  targetVariable,
  modelCategory,
  selectedModel,
  bestK,
  clusteringScore,
  clusterData,
  centroidData,
  resetValues,
}) => {
  const { id: formId, reportId } = useParams();
  const { setModelProcessed, reportTitle } = useReport();

  const [confusionMatrix, setConfusionMatrix] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [treeGraph, setTreeGraph] = useState(null);
  const [pairplot, setPairplot] = useState(null);
  const [elbowPlot, setElbowPlot] = useState(null);
  const [clusterPlot, setClusterPlot] = useState(null);
  const [loadingGraphs, setLoadingGraphs] = useState(true);
  const [currentTab, setCurrentTab] = useState("1");
  /* const [graphs, setGraphs] = useState([]); */

  useEffect(() => {
    const fetchGraphs = async () => {
      const {
        confusionMatrix,
        tree,
        featureImportance,
        pairplot,
        elbowPlot,
        clusterPlot,
      } = await getGraphs(formId, reportId);
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
      if (graphInfo.elbowPlot) {
        setElbowPlot(elbowPlot);
      }
      if (graphInfo.clusterPlot) {
        setClusterPlot(clusterPlot);
      }
      setLoadingGraphs(false);
      /* const graphData = [
        graphInfo.confusionMatrix
          ? { title: "Matriz de confusión", img: confusionMatrix }
          : null,
        graphInfo.featureImportance
          ? {
              title: "Importancia de las características",
              img: featureImportance,
            }
          : null,
        graphInfo.tree ? { title: "Árbol de Decisión", img: treeGraph } : null,
        graphInfo.pairplot ? { title: "Pairplot", img: pairplot } : null,
        graphInfo.elbowPlot
          ? { title: "Elbow Plot (Gráfico del Codo)", img: elbowPlot }
          : null,
        graphInfo.clusterPlot
          ? { title: "Gráfico de Agrupamiento", img: clusterPlot }
          : null,
      ].filter((graph) => graph !== null);
      setGraphs(graphData); */
    };
    fetchGraphs();
  }, []);

  const handleBackArrow = () => {
    setModelProcessed(false);
    resetValues();
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
                Resultados del Modelo: {selectedModelLabel} ({modelCategory})
              </Typography>
            </Stack>
            {/* <PDFDownloadLink
              document={
                <ReportPDF
                  title={reportTitle}
                  model={selectedModelLabel}
                  modeltype={modelCategory}
                  score={testAccuracy}
                  targetVariable={targetVariable}
                  bestK={bestK}
                  graphs={graphs}
                />
              }
              fileName="Reporte"
            >
              <Button endIcon={<DownloadIcon />} variant="contained">
                Exportar
              </Button>
            </PDFDownloadLink> */}
          </Stack>
          {modelCategory !== "Agrupamiento" && (
            <Box sx={{ pb: 3 }}>
              <TooltipTitle
                title="Variable a predecir (variable objetivo)"
                tooltip="El modelo se entrenará para usar las otras columnas (variables independientes) para predecir esta variable objetivo."
                size="body1"
              />
              <Typography variant="h5">{targetVariable}</Typography>
            </Box>
          )}
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
          {modelCategory === "Agrupamiento" && (
            <>
              <TooltipTitle
                title="Puntuación de silueta"
                size="body1"
                tooltip="La puntuación de silueta mide qué tan similar es un objeto a su propio clúster (cohesión) comparado con otros clústeres (separación). Un valor cercano a 1 indica que el objeto está bien emparejado con su propio clúster y mal emparejado con los vecinos."
              />
              <Typography variant="h5" sx={{ pb: 1, pt: 0.5 }}>
                {clusteringScore.toFixed(2)}
              </Typography>
              {clusteringScore < 0 && (
                <Typography sx={{ py: 1, pb: 1 }} color="text.secondary">
                  *Un puntaje negativo significa que{" "}
                  <b>los datos no son adecuados para el agrupamiento</b>. No
                  todos los conjuntos de datos pueden ser agrupados
                  efectivamente, y tratar de forzar una estructura de
                  agrupamiento en dichos datos puede llevar a resultados pobres.
                </Typography>
              )}
              <TooltipTitle
                title="Mejor K"
                size="body1"
                tooltip="K se refiere al numero de clusters o grupos que se desean formar. Este valor es seleccionado por el modelo para optimizar el rendimiento del agrupamiento."
              />
              <Typography variant="h5">{bestK}</Typography>
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
              <Tab label="Tabla de Datos Agrupados" value="2" />
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
              />
            )}
            {featureImportance && (
              <ResultGraph
                imgUrl={featureImportance}
                loadingGraphs={loadingGraphs}
                title={"Importancia de las características"}
                description={
                  "Este gráfico es útil para entender qué características están contribuyendo más a las predicciones del modelo. Si este no contiene valores, se sugiere escoger otro modelo."
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
                  "Permite la visualización del rendimiento del modelo. Los valores en la diagonal principal representan el número de predicciones correctas."
                }
              />
            )}
            {clusterPlot && (
              <ResultGraph
                imgUrl={clusterPlot}
                loadingGraphs={loadingGraphs}
                title={"Gráfico de Agrupamiento"}
                description={
                  "Permite visualizar la distribución de los datos agrupados."
                }
              />
            )}
            {elbowPlot && (
              <ResultGraph
                imgUrl={elbowPlot}
                loadingGraphs={loadingGraphs}
                title={"Elbow Plot (Gráfico del Codo)"}
                description={
                  "Permite visualizar el valor óptimo de K para el modelo de agrupamiento."
                }
              />
            )}
          </Stack>
        </TabPanel>
        {modelCategory === "Clasificación" || modelCategory === "Regresión" ? (
          <TabPanel value="2">
            <Predictions
              model={selectedModel}
              targetVariable={targetVariable}
            />
          </TabPanel>
        ) : (
          <TabPanel value="2">
            <ClusterData
              clusterData={clusterData}
              centroidData={centroidData}
            />
          </TabPanel>
        )}
      </TabContext>
    </>
  );
};

export default ModelResults;

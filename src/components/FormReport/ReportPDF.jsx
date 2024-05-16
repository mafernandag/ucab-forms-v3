import { useMemo, useState, useEffect } from "react";
import { Divider, Link, Typography, Box } from "@mui/material";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";

const ReportPDF = ({
  title,
  model,
  modeltype,
  score,
  targetVariable,
  bestK,
  graphs,
}) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 35,
      paddingBottom: 48,
      paddingHorizontal: 48,
      boxSizing: "border-box",
    },
    h1: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  console.log("graphs", graphs);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text tyle={styles.h1}>Titulo del reporte:</Text>
        <Text>{title}</Text>
        <Text tyle={styles.h1}>Modelo de mineria de datos utilizado:</Text>
        <Text>{model}</Text>
        <Text tyle={styles.h1}>Tipo de modelo:</Text>
        <Text>{modeltype}</Text>
        {score && (
          <>
            <Text tyle={styles.h1}>Puntaje del modelo:</Text>
            <Text>{score}</Text>
          </>
        )}
        {targetVariable && (
          <>
            <Text tyle={styles.h1}>Variable objetivo:</Text>
            <Text>{targetVariable}</Text>
          </>
        )}
        {bestK && (
          <>
            <Text tyle={styles.h1}>Mejor K:</Text>
            <Text>{bestK}</Text>
          </>
        )}
        <Text tyle={styles.h1}>Graficos:</Text>
        {graphs.map(
          (graph, index) =>
            graph.img && (
              <Box key={index}>
                <Text>{graph.title}</Text>
                <img
                  alt={graph.title}
                  src={graph.img}
                  sx={{ height: "auto", maxWidth: "70%" }}
                />
              </Box>
            )
        )}
      </Page>
    </Document>
  );
};

export default ReportPDF;

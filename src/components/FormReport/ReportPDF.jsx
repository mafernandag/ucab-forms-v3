import { useMemo, useState, useEffect } from "react";
import { Divider, Link, Typography } from "@mui/material";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";

const ReportPDF = () => {
  return (
    <Document>
      <Page>
        <Typography>Titulo del reporte:</Typography>
        <Text>Titulo</Text>
        <Text>Modelo de mineria de datos utilizado:</Text>
        <Text>Modelo</Text>
        <Text>Fecha de creacion:</Text>
        <Text>Fecha</Text>
      </Page>
    </Document>
  );
};

export default ReportPDF;

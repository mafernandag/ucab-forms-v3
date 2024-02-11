import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  Stack,
  Card,
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useForm } from "../hooks/useForm";
import { useReport } from "../hooks/useReport";
import Header from "../components/FormReport/Header";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import { getDataframe } from "../api/reports";
import { get, flatMap, sortBy } from "lodash";
import DrawerLayout from "../components/FormReport/DrawerLayout";
import ResponsesTable from "../components/EditForm/Responses/ResponsesTable";
import CustomThemeProvider from "../components/CustomThemeProvider";
import DataTable from "../components/FormReport/DataTable";
import { getSectionLabels } from "../questions/utils";
import { DEFAULT_LABEL } from "../questions/constants";
import CleanedDataTable from "../components/FormReport/CleanedDataTable";
import ModelResults from "../components/FormReport/Sidebar/ModelResults";
import SelectModel from "../components/FormReport/Sidebar/SelectModel";
import CrossValidation from "../components/FormReport/CrossValidation";
import { getCleanDf } from "../api/reports";

const Report = () => {
  const { form, loading: loadingForm } = useForm();
  const { id: formId, reportId } = useParams();
  const {
    cleanedData,
    setCleanedData,
    loading: loadingReport,
    reportTitle,
    setDeletedColumns,
    deletedColumns,
  } = useReport();
  const [loadingCleanDf, setLoadingCleanDf] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const fetchCleanDf = async () => {
      if (cleanedData === null) {
        const data = await getCleanDf(formId, reportId);
        setCleanedData(data);

        const dataColumns = Object.keys(data[0]).filter((key) => key !== "id");
        const newDeletedColumns = { ...deletedColumns };

        for (const key in newDeletedColumns) {
          // If the key is not present in the data columns, set the value to false
          if (!dataColumns.includes(key)) {
            newDeletedColumns[key] = false;
          }
        }
        setDeletedColumns(newDeletedColumns);
      }
      setLoadingCleanDf(false);
    };

    fetchCleanDf();
  }, [
    cleanedData,
    deletedColumns,
    formId,
    reportId,
    setCleanedData,
    setDeletedColumns,
  ]);

  if (loadingForm || loadingReport || loadingCleanDf) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <CustomThemeProvider form={form}>
      <Box sx={{ paddingX: "14%", paddingY: "2%" }}>
        <Header setOpenDrawer={setOpenDrawer} />
        {loadingReport && <LinearProgress sx={{ zIndex: 9999 }} />}
        <Stack spacing={3}>
          <Card sx={{ paddingX: "20px", paddingY: "10px" }}>
            <Typography variant="caption" color="text.secondary">
              Título del reporte
            </Typography>
            <Typography variant="h6">{reportTitle}</Typography>
          </Card>

          <Card sx={{ padding: "20px" }}>
            <SelectModel />
          </Card>

          <Card sx={{ padding: "20px" }}>
            <CrossValidation />
          </Card>

          <CleanedDataTable data={cleanedData} />
        </Stack>
      </Box>
    </CustomThemeProvider>
  );
};

export default Report;

import React, { useState, useEffect } from "react";
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
import CustomThemeProvider from "../components/CustomThemeProvider";
import CleanedDataTable from "../components/FormReport/Tables/CleanedDataTable";
import SelectModel from "../components/FormReport/Results/SelectModel";
import CrossValidation from "../components/FormReport/CrossValidation";
import { getCleanDf, changeTitle } from "../api/reports";
import AnswerPageText from "../components/AnswerPageText";
import { debounce } from "lodash";

const Report = () => {
  const { form, loading: loadingForm } = useForm();
  const { id: formId, reportId } = useParams();
  const {
    cleanedData,
    setCleanedData,
    loading: loadingReport,
    reportTitle,
    setReportTitle,
    setDeletedColumns,
    deletedColumns,
  } = useReport();
  const [loadingCleanDf, setLoadingCleanDf] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [closeCrossValidation, setCloseCrossValidation] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);

  useEffect(() => {
    const fetchCleanDf = async () => {
      if (cleanedData === null) {
        const data = await getCleanDf(formId, reportId);
        if (data === null) {
          setErrorMessage("No se encontró el reporte");
          setLoadingCleanDf(false);
          return;
        }
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

  if (errorMessage) {
    return <AnswerPageText>{errorMessage}</AnswerPageText>;
  }

  const handleTitleChange = (title) => {
    if (title === "") {
      setIsTitleEmpty(true);
    } else {
      setIsTitleEmpty(false);
      changeReportTitle(title);
    }
  };

  const changeReportTitle = debounce((title) => {
    setReportTitle(title);
    changeTitle(formId, reportId, title);
  }, 3000);

  return (
    <CustomThemeProvider form={form}>
      <Box sx={{ paddingX: "14%", paddingY: "2%" }}>
        <Header setOpenDrawer={setOpenDrawer} />
        {loadingReport && <LinearProgress sx={{ zIndex: 9999 }} />}
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <TextField
              label="Título del reporte"
              defaultValue={reportTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              variant="standard"
              fullWidth
              error={isTitleEmpty}
              helperText={isTitleEmpty ? "El título no puede estar vacío" : ""}
            />
          </Card>

          <Card>
            <SelectModel />
          </Card>

          {!closeCrossValidation && (
            <Card sx={{ padding: "20px" }}>
              <CrossValidation
                setCloseCrossValidation={setCloseCrossValidation}
              />
            </Card>
          )}

          <CleanedDataTable data={cleanedData} />
        </Stack>
      </Box>
    </CustomThemeProvider>
  );
};

export default Report;

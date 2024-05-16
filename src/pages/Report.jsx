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
import { useUser } from "../hooks/useUser";
import Header from "../components/FormReport/Header";
import { useParams } from "react-router-dom";
import CustomThemeProvider from "../components/CustomThemeProvider";
import CleanedDataTable from "../components/FormReport/Tables/CleanedDataTable";
import SelectModel from "../components/FormReport/Results/SelectModel";
import CrossValidation from "../components/FormReport/CrossValidation";
import { getCleanDf, changeTitle } from "../api/reports";
import AnswerPageText from "../components/AnswerPageText";
import { debounce, map, set } from "lodash";

const Report = () => {
  const user = useUser();
  const { form, loading: loadingForm } = useForm();
  const { id: formId, reportId } = useParams();
  const {
    report,
    cleanedData,
    setCleanedData,
    loading: loadingReport,
    reportTitle,
    setReportTitle,
    setDeletedColumns,
    deletedColumns,
    labeledQuestions,
    setLabeledQuestions,
  } = useReport();
  const [loadingCleanDf, setLoadingCleanDf] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
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
        let newLabeledQuestions = [...labeledQuestions];

        for (const key in newDeletedColumns) {
          // If the key is not present in the data columns, set the value to false
          if (!dataColumns.includes(key)) {
            newDeletedColumns[key] = false;
          }
        }
        // If a key in dataColumns is not present in newDeletedColumns, add it and set the value to true
        for (const key of dataColumns) {
          if (!(key in newDeletedColumns)) {
            const question = labeledQuestions.find((q) => key.includes(q.id));
            const title = question
              ? key.replace(question.id, question.title)
              : key;
            newLabeledQuestions.push({
              id: key,
              title: title,
              options: ["0", "1"],
            });
          }
        }
        setDeletedColumns(newDeletedColumns);
        newLabeledQuestions = newLabeledQuestions.filter((q) =>
          dataColumns.includes(q.id)
        );
        setLabeledQuestions(newLabeledQuestions);
      }
      setLoadingCleanDf(false);
    };
    fetchCleanDf();
  }, [deletedColumns, reportId]);

  if (loadingForm || loadingReport || loadingCleanDf) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (report.author.id !== user.id) {
    return (
      <AnswerPageText>
        No tienes permisos para acceder a este reporte
      </AnswerPageText>
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
    <Box sx={{ paddingX: "14%", paddingY: "2%" }}>
      <Header setOpenDrawer={setOpenDrawer} />
      {/* {loadingReport && <LinearProgress sx={{ zIndex: 9999 }} />} */}
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

        <Card sx={{ padding: "20px" }}>
          <CrossValidation />
        </Card>

        <CleanedDataTable data={cleanedData} />
      </Stack>
    </Box>
  );
};

export default Report;

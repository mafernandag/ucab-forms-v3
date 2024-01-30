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

export const ReportContext = React.createContext();

const Report = () => {
  const { form, loading, questions, sections } = useForm();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { id: formId } = useParams();
  const [deletedColumns, setDeletedColumns] = useState({});
  const [cleanedData, setCleanedData] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const [loadingProcessedData, setLoadingProcessedData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [modelProcessed, setModelProcessed] = useState(false);
  const [testAccuracy, setTestAccuracy] = useState(null);
  const [reportTitle, setReportTitle] = useState(null);

  //TODO: get the newDf from firebase if it already exist aka when cleanedData is true, and change the nav to /report/edit/:id

  useEffect(() => {
    if (form) {
      setReportTitle(form.title);
    }
  }, [form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formIdResponse = await fetch("/formId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId: formId }),
        });
        const formIdData = await formIdResponse.json();
        setLoadingData(false);
        console.log(formIdData);
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchData();
  }, [formId]);

  const labeledQuestions = useMemo(() => {
    const sortedQuestions = sortBy(questions, (question) => {
      const section = sections.find(
        (section) => section.id === question.sectionId
      );

      return section.index;
    });

    const labeledQuestions = flatMap(sortedQuestions, (question) => {
      const section = sections.find(
        (section) => section.id === question.sectionId
      );

      const sectionLabels = getSectionLabels(section, questions);

      return sectionLabels.map((label) => ({
        ...question,
        title:
          label !== DEFAULT_LABEL
            ? `${question.title} (${label})`
            : question.title,
        id: `${question.id}-${label}`,
      }));
    });

    return labeledQuestions;
  }, [questions, sections]);

  useEffect(() => {
    const initialCheckedState = {};
    labeledQuestions.forEach((question) => {
      initialCheckedState[question.id] = true;
    });
    setDeletedColumns(initialCheckedState);
  }, [labeledQuestions]);

  if (loading || loadingProcessedData) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  const handleReportTitle = (title) => {
    setReportTitle(title);
    console.log(reportTitle);
  };

  return (
    <CustomThemeProvider form={form}>
      <Box>
        <Header setOpenDrawer={setOpenDrawer} />
        {loadingData && <LinearProgress sx={{ zIndex: 9999 }} />}
        <ReportContext.Provider
          value={{
            deletedColumns,
            setDeletedColumns,
            labeledQuestions,
            setCleanedData,
            cleanedData,
            deletedRows,
            setDeletedRows,
            setLoadingProcessedData,
            loadingData,
            setModelProcessed,
            modelProcessed,
            reportTitle,
          }}
        >
          <DrawerLayout open={openDrawer} setOpen={setOpenDrawer}>
            {cleanedData === null ? (
              <Stack spacing={3}>
                <Card sx={{ padding: "20px" }}>
                  <TextField
                    label="Título del reporte"
                    defaultValue={reportTitle}
                    onChange={(e) => handleReportTitle(e.target.value)}
                    variant="standard"
                    fullWidth
                  />
                </Card>
                <Card>
                  <DataTable />
                </Card>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Card sx={{ paddingX: "20px", paddingY: "10px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Título del reporte
                  </Typography>
                  <Typography variant="h6">{reportTitle}</Typography>
                </Card>

                <Card sx={{ padding: "20px" }}>
                  <CrossValidation />
                </Card>
                <Card sx={{ padding: "20px" }}>
                  <SelectModel setTestAccuracy={setTestAccuracy} />
                </Card>
                <CleanedDataTable data={cleanedData} />
              </Stack>
            )}
          </DrawerLayout>
        </ReportContext.Provider>
      </Box>
    </CustomThemeProvider>
  );
};

export default Report;

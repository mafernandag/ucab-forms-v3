import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  Stack,
  Card,
  TextField,
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

export const ReportContext = React.createContext();

const Report = () => {
  const { form, loading, questions, sections } = useForm();
  const [data, setData] = useState([{}]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { id: formId } = useParams();
  const [deletedColumns, setDeletedColumns] = useState({});
  const [cleanedData, setCleanedData] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const [loadingProcessedData, setLoadingProcessedData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [modelProcessed, setModelProcessed] = useState(false);

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
          }}
        >
          <DrawerLayout open={openDrawer} setOpen={setOpenDrawer}>
            <Stack spacing={2}>
              <Card sx={{ paddingX: "20px", paddingY: "10px" }}>
                <Typography variant="caption">Título de la encuesta</Typography>
                <Typography variant="h6">{form.title}</Typography>
              </Card>
              <Card>
                {cleanedData === null ? (
                  <DataTable />
                ) : (
                  <CleanedDataTable data={cleanedData} />
                )}
              </Card>
            </Stack>
          </DrawerLayout>
        </ReportContext.Provider>
      </Box>
    </CustomThemeProvider>
  );
};

export default Report;

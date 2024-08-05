import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "./useForm";
import { getReport, getQuestionsFromCSV } from "../api/reports";
import { flatMap, sortBy } from "lodash";
import { DEFAULT_LABEL } from "../questions/constants";
import { getSectionLabels } from "../questions/utils";

const ReportContext = createContext();

const useReport = () => {
  return useContext(ReportContext);
};

const ReportProvider = ({ children }) => {
  const { form, questions, sections } = useForm();
  const { id: formId, reportId, isCsv } = useParams();
  const [report, setReport] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const [deletedColumns, setDeletedColumns] = useState({});
  const [cleanedData, setCleanedData] = useState(null);
  const [reportTitle, setReportTitle] = useState(null);
  const [loadingProcessedData, setLoadingProcessedData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [modelProcessed, setModelProcessed] = useState(false);
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    if (form) {
      setReportTitle(form.title);
    }
  }, [form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formIdResponse = await fetch(
          process.env.REACT_APP_API_URL + "/formId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ formId: formId }),
          }
        );
        const formIdData = await formIdResponse.json();
        setLoadingData(false);
        console.log(formIdData);
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchData();
  }, [formId, isCsv]);

  useEffect(() => {
    if (formId && reportId) {
      setLoadingReport(true);
      const unsubscribeReport = getReport(formId, reportId, (report) => {
        setReport(report);
        setLoadingReport(false);
      });
      return () => {
        unsubscribeReport();
      };
    }
  }, [formId, reportId]);

  const [labeledQuestions, setLabeledQuestions] = useState([]);

  useEffect(() => {
    if (isCsv) {
      const fetchData = async () => {
        const questions = await getQuestionsFromCSV(formId);
        setLabeledQuestions(questions);
      };
      fetchData();
    } else {
      const sortedQuestions = sortBy(questions, (question) => {
        const section = sections.find(
          (section) => section.id === question.sectionId
        );

        // Check if section is found
        if (section) {
          return section.index;
        } else {
          // Handle the case where section is not found
          console.error(
            `Section not found for question with sectionId: ${question.sectionId}`
          );
        }
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

      setLabeledQuestions(labeledQuestions);
    }
  }, [questions, sections, isCsv, formId]);

  useEffect(() => {
    const initialCheckedState = {};
    labeledQuestions.forEach((question) => {
      initialCheckedState[question.id] = true;
    });

    setDeletedColumns(initialCheckedState);
  }, [labeledQuestions]);

  const loading = useMemo(() => {
    return loadingData || loadingProcessedData || loadingReport;
  }, [loadingData, loadingProcessedData, loadingReport]);

  const value = {
    report,
    loading,
    deletedColumns,
    setDeletedColumns,
    labeledQuestions,
    setLabeledQuestions,
    cleanedData,
    setCleanedData,
    deletedRows,
    setDeletedRows,
    setLoadingProcessedData,
    setModelProcessed,
    modelProcessed,
    reportTitle,
    setReportTitle,
    predictionData,
    setPredictionData,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};

export { useReport, ReportProvider };

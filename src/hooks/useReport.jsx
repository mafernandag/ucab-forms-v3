import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "./useForm";
import { getReport } from "../api/reports";
import { flatMap, sortBy } from "lodash";
import { DEFAULT_LABEL } from "../questions/constants";
import { getSectionLabels } from "../questions/utils";

const ReportContext = createContext();

const useReport = () => {
  return useContext(ReportContext);
};

const ReportProvider = ({ children }) => {
  const { form, questions, sections } = useForm();
  const { id: formId, reportId } = useParams();
  const [report, setReport] = useState(null);
  const [deletedColumns, setDeletedColumns] = useState({});
  const [cleanedData, setCleanedData] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const [loadingProcessedData, setLoadingProcessedData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingReport, setLoadingReport] = useState(true);
  const [modelProcessed, setModelProcessed] = useState(false);
  const [reportTitle, setReportTitle] = useState(null);

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

  useEffect(() => {
    const unsubscribeReport = getReport(reportId, formId, (report) => {
      setReport(report);
      setLoadingReport(false);
    });
    return () => {
      unsubscribeReport();
    };
  }, [formId, reportId]);

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

  useEffect(() => {
    if (form) {
      setReportTitle(form.title);
    }
  }, [form]);

  const loading = useMemo(() => {
    return loadingData || loadingProcessedData || loadingReport;
  }, [loadingData, loadingProcessedData, loadingReport]);

  const value = {
    loading,
    deletedColumns,
    setDeletedColumns,
    labeledQuestions,
    cleanedData,
    setCleanedData,
    deletedRows,
    setDeletedRows,
    setLoadingProcessedData,
    //loadingData,
    //setLoadingData,
    setModelProcessed,
    modelProcessed,
    reportTitle,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};

export { useReport, ReportProvider };

import { useMemo, useContext } from "react";
import Table from "../../Table";
import { useForm } from "../../../hooks/useForm";
import { ReportContext } from "../../../pages/PrepareData";
import { Divider, Link, Typography } from "@mui/material";
import { useReport } from "../../../hooks/useReport";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { stringifyRows } from "./utils";
const CleanedDataTable = ({ data }) => {
  const { labeledQuestions } = useReport();

  const columns = useMemo(() => {
    return data.length > 0
      ? Object.keys(data[0])
          .filter((key) => key !== "id")
          .map((key) => {
            const question = labeledQuestions.find((q) => key.includes(q.id));
            const title = question
              ? key.replace(question.id, question.title)
              : key;
            return {
              title: title,
              field: key,
              emptyValue: "-",
              align: "left",
              render: (rowData) => (
                <>{<Typography>{rowData[key]}</Typography>}</>
              ),
            };
          })
      : [];
  }, [data, labeledQuestions]);

  const stringifyArrays = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  const cleanedData = data.map((item) => {
    const cleanedItem = {};
    for (const key in item) {
      cleanedItem[key] = stringifyArrays(item[key]);
    }
    return cleanedItem;
  });

  return (
    <Table
      title="Datos Procesados"
      columns={columns}
      data={cleanedData}
      options={{
        exportMenu: [
          {
            label: "Exportar PDF",
            exportFunc: (cols, datas) =>
              ExportPdf(cols, stringifyRows(datas), "Datos Procesados"),
          },
          {
            label: "Exportar CSV",
            exportFunc: (cols, datas) =>
              ExportCsv(cols, stringifyRows(datas), "Datos Procesados"),
          },
        ],
      }}
    />
  );
};

export default CleanedDataTable;

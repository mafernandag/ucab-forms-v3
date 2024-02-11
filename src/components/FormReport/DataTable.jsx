import { useMemo, useContext, useState, useEffect } from "react";
import { Divider, Link, Typography, Checkbox } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { flatMap, sortBy } from "lodash";
import Table from "../Table";
import { useForm } from "../../hooks/useForm";
import { stringifyAnswers } from "../../utils/stats";
import { DEFAULT_LABEL, FILE } from "../../questions/constants";
import { formatDateTime } from "../../utils/dates";
import { getSectionLabels } from "../../questions/utils";
import { stringifyRows } from "../EditForm/Responses/ResponsesTable/utils";
import { ReportContext } from "../../pages/PrepareData";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useReport } from "../../hooks/useReport";
const DataTable = () => {
  const { responses, questions } = useForm();
  const { deletedColumns, labeledQuestions, setDeletedRows } = useReport();

  const columns = useMemo(() => {
    return [
      ...labeledQuestions
        .filter((question) => deletedColumns[question.id])
        .map((question) => ({
          title: question.title,
          field: question.id,
          emptyValue: "-",
          align: "left",
          render: (rowData) => (
            <>
              {rowData[question.id].map((answer, i) => (
                <Typography key={i}>{answer}</Typography>
              ))}
            </>
          ),
          ...(question.type === FILE && {
            render: (rowData) => (
              <>
                {rowData[question.id].map((answer, i) => (
                  <>
                    {answer.split(", ").map((url) => (
                      <Link
                        key={url}
                        href={url}
                        noWrap
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: "block", maxWidth: "15ch" }}
                      >
                        {url}
                      </Link>
                    ))}
                    {i !== rowData[question.id].length - 1 && (
                      <Divider
                        key={`divider-${i}`}
                        sx={{
                          my: 1,
                          width: "15ch",
                        }}
                      />
                    )}
                  </>
                ))}
              </>
            ),
          }),
        })),
    ];
  }, [deletedColumns, labeledQuestions]);

  const auxData = useMemo(() => {
    return responses.map((response) => ({
      id: response.id,
      ...stringifyAnswers(response.answers, questions),
    }));
  }, [questions, responses]);

  const [data, setData] = useState(auxData);
  useEffect(() => {
    setData(auxData);
  }, [auxData]);

  useEffect(() => {
    const initialSelectedState = {};
    auxData.forEach((response) => {
      initialSelectedState[response.id] = true;
    });
    setDeletedRows(initialSelectedState);
  }, [auxData, setDeletedRows]);

  const getIconColor = (theme) => {
    if (theme.palette.mode === "light") {
      return theme.palette.text.secondary;
    }

    return "inherit";
  };

  return (
    <Table
      title="Previsualización de los datos"
      columns={columns}
      data={data}
      options={{
        selection: true,
        padding: "dense",
      }}
      actions={[
        {
          tooltip: "Eliminar las filas seleccionadas",
          icon: () => <DeleteIcon sx={{ color: getIconColor }} />,
          onClick: (evt, selectRows) => {
            const idsToDelete = selectRows.map((row) => {
              setDeletedRows((prevState) => ({
                ...prevState,
                [row.id]: false,
              }));
              console.log(row.id);
              return row.id;
            });
            const newDataAfterDelete = data.filter(
              (row) => !idsToDelete.includes(row.id)
            );
            setData(newDataAfterDelete);
          },
        },
      ]}
      /* options={{
        exportMenu: [
          {
            label: "Exportar PDF",
            exportFunc: (cols, datas) =>
              ExportPdf(cols, stringifyRows(datas), "Respuestas"),
          },
          {
            label: "Exportar CSV",
            exportFunc: (cols, datas) =>
              ExportCsv(cols, stringifyRows(datas), "Respuestas"),
          },
        ],
      }} */
    />
  );
};

export default DataTable;

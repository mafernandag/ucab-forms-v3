import { useMemo, useState, useEffect } from "react";
import { Divider, Link, Typography } from "@mui/material";
import Table from "../../Table";
import { useForm } from "../../../hooks/useForm";
import { stringifyAnswers } from "../../../utils/stats";
import { FILE } from "../../../questions/constants";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useReport } from "../../../hooks/useReport";
import { useParams } from "react-router-dom";
import { getCSVFile } from "../../../api/reports";
const DataTable = () => {
  const { isCsv, id: formId } = useParams();
  const { responses, questions } = useForm();
  const { deletedColumns, labeledQuestions, setDeletedRows } = useReport();
  const [csvColumns, setCsvColumns] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (isCsv) {
      const fetchData = async () => {
        const result = await getCSVFile(formId);
        setCsvColumns(result.columns);
        setCsvData(result.data);
      };

      fetchData();
    }
  }, [isCsv, formId]);

  const columns = useMemo(() => {
    if (!isCsv) {
      return [
        ...labeledQuestions
          .filter((question) => deletedColumns[question.id])
          .map((question) => ({
            title: question.title,
            field: question.id,
            emptyValue: "-",
            align: "left",
            render: (rowData) => {
              return (
                <>
                  {rowData[question.id].map((answer, i) => (
                    <Typography
                      key={i}
                      style={{
                        color: isOutlier(answer, question.id)
                          ? "#FF0000"
                          : "inherit",
                      }}
                    >
                      {answer}
                    </Typography>
                  ))}
                </>
              );
            },
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
    } else {
      return csvColumns
        .filter((question) => deletedColumns[question.id])
        .map((question) => ({
          title: question.title,
          field: question.id,
          emptyValue: "-",
          align: "left",
          render: (rowData) => (
            <>
              <Typography
                key={rowData.id}
                style={{
                  color: isOutlier(rowData[question.id], question.id)
                    ? "#FF0000"
                    : "inherit",
                }}
              >
                {rowData[question.id]}
              </Typography>
            </>
          ),
        }));
    }
  }, [deletedColumns, labeledQuestions, isCsv, csvColumns]);

  const auxData = useMemo(() => {
    if (!isCsv) {
      return responses.map((response) => ({
        id: response.id,
        ...stringifyAnswers(response.answers, questions),
      }));
    } else {
      return csvData;
    }
  }, [questions, responses, isCsv, csvData]);

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

  function isOutlier(value, columnId) {
    if (value === null) {
      return false;
    }
    const values = data
      .map((row) => row[columnId])
      .filter((value) => value !== null)
      .map((value) => Number(value));

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const standardDeviation = Math.sqrt(
      values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
        values.length
    );

    const zScore = (value - mean) / standardDeviation;
    return Math.abs(zScore) > 2;
  }

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
    />
  );
};

export default DataTable;

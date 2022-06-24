import { useMemo } from "react";
import { Link } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { format } from "date-fns";
import Table from "../../Table";
import { useForm } from "../../../hooks/useForm";
import { stringifyAnswers } from "../../../utils/stats";
import { FILE } from "../../../questions/constants";

const ResponsesTable = () => {
  const { responses, questions } = useForm();

  // TODO: Sort questions by section index
  const columns = useMemo(() => {
    return [
      { title: "Fecha de respuesta", field: "submittedAt" },
      ...questions.map((question) => ({
        title: question.title,
        field: question.id,
        emptyValue: "-",
        ...(question.type === FILE && {
          render: (rowData) => (
            <>
              {rowData[question.id].split(", ").map((url) => (
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
            </>
          ),
        }),
      })),
    ];
  }, [questions]);

  const data = useMemo(() => {
    return responses.map((response) => ({
      id: response.id,
      submittedAt: format(response.submittedAt, "dd/MM/yyyy HH:mm"),
      ...stringifyAnswers(response.answers, questions),
    }));
  }, [questions, responses]);

  return (
    <Table
      title="Respuestas"
      columns={columns}
      data={data}
      options={{
        exportMenu: [
          {
            label: "Exportar PDF",
            exportFunc: (cols, datas) => ExportPdf(cols, datas, "Respuestas"),
          },
          {
            label: "Exportar CSV",
            exportFunc: (cols, datas) => ExportCsv(cols, datas, "Respuestas"),
          },
        ],
      }}
    />
  );
};

export default ResponsesTable;

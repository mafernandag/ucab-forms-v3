import { useMemo } from "react";
import { Link, Typography } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { flatMap, sortBy } from "lodash";
import Table from "../../Table";
import { useForm } from "../../../hooks/useForm";
import { stringifyAnswers } from "../../../utils/stats";
import { DEFAULT_LABEL, FILE } from "../../../questions/constants";
import { formatDateTime } from "../../../utils/dates";
import { getSectionLabels } from "../../../questions/utils";

const ResponsesTable = () => {
  const { responses, sections, questions } = useForm();

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

  const columns = useMemo(() => {
    return [
      { title: "Fecha de respuesta", field: "submittedAt", align: "center" },
      ...labeledQuestions.map((question) => ({
        title: question.title,
        field: question.id,
        emptyValue: "-",
        align: "center",
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
  }, [labeledQuestions]);

  const data = useMemo(() => {
    return responses.map((response) => ({
      id: response.id,
      submittedAt: formatDateTime(response.submittedAt),
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

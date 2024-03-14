import { useMemo, useContext } from "react";
import Table from "../../Table";
import { useForm } from "../../../hooks/useForm";
import { ReportContext } from "../../../pages/PrepareData";
import { Divider, Link, Typography, Stack } from "@mui/material";
import { useReport } from "../../../hooks/useReport";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { stringifyRows } from "./utils";
const ClusterData = ({ clusterData, centroidData }) => {
  const clusterColumns = useMemo(() => {
    return clusterData.length > 0
      ? Object.keys(clusterData[0]).map((key) => {
          if (key === "Grupo") {
            return {
              title: key,
              field: key,
              defaultGroupOrder: 0,
              emptyValue: "-",
              align: "left",
              //render: (rowData) => (
              //  <>{<Typography>{rowData[key]}</Typography>}</>
              //),
            };
          }
          return {
            title: key,
            field: key,
            emptyValue: "-",
            align: "left",
            //render: (rowData) => <>{<Typography>{rowData[key]}</Typography>}</>,
          };
        })
      : [];
  }, [clusterData]);

  const stringifyArrays = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  const clusterRows = clusterData.map((item) => {
    const cleanedItem = {};
    for (const key in item) {
      cleanedItem[key] = stringifyArrays(item[key]);
    }
    return cleanedItem;
  });

  const centroidColumns = useMemo(() => {
    return centroidData.length > 0
      ? Object.keys(centroidData[0]).map((key) => {
          return {
            title: key,
            field: key,
            emptyValue: "-",
            align: "left",
            render: (rowData) => <>{<Typography>{rowData[key]}</Typography>}</>,
          };
        })
      : [];
  }, [centroidData]);

  const centroidRows = centroidData.map((item) => {
    const cleanedItem = {};
    for (const key in item) {
      cleanedItem[key] = stringifyArrays(item[key]);
    }
    return cleanedItem;
  });

  return (
    <Stack spacing={3}>
      <Table
        title="Datos Agrupados"
        columns={clusterColumns}
        data={clusterRows}
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
          padding: "dense",
          grouping: true,
        }}
      />
      <Table
        title="Centroides"
        columns={centroidColumns}
        data={centroidRows}
        options={{
          padding: "dense",
          pageSize: centroidRows.length,
          pageSizeOptions: [centroidRows.length],
          maxBodyHeight: `${clusterRows.length * 50}px`,
        }}
      />
    </Stack>
  );
};

export default ClusterData;

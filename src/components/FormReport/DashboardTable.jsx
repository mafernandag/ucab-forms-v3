import { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Add as AddIcon,
  ContentCopy,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Addchart as ReportIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { createReport, deleteReport, getUserReports } from "../../api/reports";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";
import Table from "../Table";
import { formatDateTime } from "../../utils/dates";
import { Typography } from "@mui/material";

const columns = [
  {
    title: "Título",
    field: "title",
  },
  {
    title: "Fecha de creación",
    field: "createdAt",
    type: "datetime",
    render: (rowData) => formatDateTime(rowData.createdAt),
  },
  {
    title: "Número de datos",
    field: "numRows",
    type: "numeric",
    align: "center",
  },
];

const DashboardTable = () => {
  const user = useUser();
  const openAlert = useAlert();
  const navigate = useNavigate();
  const [userReports, setUserReports] = useState([]);
  const [loadingUserReports, setLoadingUserReports] = useState(true);
  useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUserReports = async () => {
      const reports = await getUserReports(user.id);
      setUserReports(reports);
      setLoadingUserReports(false);
    };

    fetchUserReports();
  }, [user]);

  const reports = useMemo(() => {
    return userReports.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }, [userReports]);

  const handleDelete = (event, rowData) => {
    openAlert({
      title: "Eliminar encuesta",
      message: "¿Estás seguro de eliminar esta encuesta?",
      action: () => {
        deleteReport(rowData.id, rowData["formId"]);
        enqueueSnackbar("Encuesta eliminada", {
          variant: "success",
        });
      },
    });
  };

  const getIconColor = (theme) => {
    if (theme.palette.mode === "light") {
      return theme.palette.text.secondary;
    }

    return "inherit";
  };

  return (
    <Table
      columns={columns}
      data={reports}
      title="Mis reportes"
      isLoading={loadingUserReports}
      actions={[
        {
          icon: () => <EditIcon sx={{ color: getIconColor }} />,
          tooltip: "Editar",
          onClick: (event, rowData) => {
            navigate(`/report/edit/${rowData["formId"]}/${rowData.id}`);
          },
        },
        {
          icon: () => <DeleteIcon sx={{ color: getIconColor }} />,
          tooltip: "Eliminar",
          onClick: handleDelete,
        },
      ]}
      localization={{
        body: {
          emptyDataSourceMessage: "No hay encuestas que mostrar",
        },
      }}
    />
  );
};

export default DashboardTable;

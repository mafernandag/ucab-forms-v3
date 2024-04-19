import { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Addchart as ReportIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  createReportFromFile,
  deleteReport,
  getUserReports,
} from "../../api/reports";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";
import Table from "../Table";
import { formatDateTime } from "../../utils/dates";
import ReportDialog from "./ReportDialog";

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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribeUserReports = getUserReports(user.id, (reports) => {
      setUserReports(reports);
      setLoadingUserReports(false);
    });

    return () => {
      unsubscribeUserReports();
    };
  }, [user]);

  const reports = useMemo(() => {
    return userReports.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }, [userReports]);

  const handleDelete = (event, rowData) => {
    openAlert({
      title: "Eliminar reporte",
      message: "¿Estás seguro de eliminar este reporte?",
      action: () => {
        console.log(rowData.id, rowData["formId"]);
        deleteReport(rowData.id, rowData["formId"]);
        enqueueSnackbar("Reporte eliminado", {
          variant: "success",
        });
        setUserReports(
          userReports.filter((report) => report.id !== rowData.id)
        );
      },
    });
  };

  const getIconColor = (theme) => {
    if (theme.palette.mode === "light") {
      return theme.palette.text.secondary;
    }

    return "inherit";
  };

  const [open, setOpen] = useState(false);
  const openDialog = () => {
    setOpen(true);
  };

  return (
    <>
      <Table
        columns={columns}
        data={reports}
        title="Mis reportes"
        isLoading={loadingUserReports}
        actions={[
          {
            icon: () => <AddIcon sx={{ color: getIconColor }} />,
            tooltip: "Crear",
            isFreeAction: true,
            onClick: openDialog,
          },
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
            emptyDataSourceMessage: "No hay reportes que mostrar",
          },
        }}
      />
      <ReportDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default DashboardTable;

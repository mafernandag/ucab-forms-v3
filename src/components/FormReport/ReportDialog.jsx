import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import UploadCSVButton from "./UploadCSVButton";
import { createReportFromFile } from "../../api/reports";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

const ReportDialog = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const abortController = new AbortController();

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    abortController.abort();
  };

  const handleCSVFile = async (file) => {
    setLoading(true);
    const filesArray = Array.from(file);
    console.log(filesArray[0]);
    try {
      const reportId = await createReportFromFile(user, filesArray[0], {
        signal: abortController.signal,
      });
      if (abortController.signal.aborted) return;
      console.log(reportId);
      setLoading(false);
      setOpen(false);
      enqueueSnackbar("Archivo importado correctamente", {
        variant: "success",
      });
      navigate("/report/create/" + reportId + "/1");
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error(error);
        enqueueSnackbar("Error al crear el reporte", { variant: "error" });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear reporte usando un Archivo CSV</DialogTitle>
      <DialogContent>
        <Typography>
          Importa un archivo CSV para crear un reporte con los datos de la
          encuesta.
        </Typography>
        <Stack alignItems="center" spacing={3}>
          {!loading && (
            <UploadCSVButton inputId="report" onChange={handleCSVFile} />
          )}
          {loading && <CircularProgress />}
          {loading && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Dependiendo de la cantidad de datos, esto podrá tardar unos
              minutos...
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;

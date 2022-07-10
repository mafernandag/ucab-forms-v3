import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";

const SendDialog = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };

  const formUrl = window.location.href.replace("edit", "answer");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      enqueueSnackbar("URL copiada al portapapeles", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("No se pudo copiar la URL", { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar Encuesta</DialogTitle>
      <DialogContent>
        <TextField
          variant="standard"
          fullWidth
          defaultValue={formUrl}
          onFocus={(e) => e.target.select()}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
        <Button onClick={handleCopy}>Copiar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendDialog;

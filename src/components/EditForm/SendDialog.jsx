import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "../../hooks/useForm";
import { APP_URL } from "../../constants/urls";

const SendDialog = ({ open, setOpen }) => {
  const { form } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };

  const formUrl = `${APP_URL}/forms/answer/${form.id}`;

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

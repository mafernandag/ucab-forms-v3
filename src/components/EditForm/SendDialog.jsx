import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Container,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { QRCodeSVG } from "qrcode.react";

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <QRCodeSVG value={formUrl} />
        </Box>
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

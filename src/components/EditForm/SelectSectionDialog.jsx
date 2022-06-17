import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";

const SelectSectionDialogBody = ({ closeDialog }) => {
  const { form } = useForm();

  const { enqueueSnackbar } = useSnackbar();

  const openAlert = useAlert();

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Seleccionar sección
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Button>Sección A</Button>
          <Button>Sección B</Button>
          <Button>Sección C</Button>
          <Button>Sección D</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cerrar</Button>
      </DialogActions>
    </>
  );
};

const SelectSectionDialog = ({ open, setOpen }) => {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="sm" keepMounted={false}>
      <SelectSectionDialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default SelectSectionDialog;

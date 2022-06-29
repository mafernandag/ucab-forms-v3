import {
  Box,
  Button,
  Dialog,
  DialogContent,
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
        <Tooltip title="Cerrar" arrow>
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Button>Ninguna</Button>
          <Button>Sección A</Button>
          <Button>Sección B</Button>
          <Button>Sección C</Button>
          <Button>Sección D</Button>
        </Box>
      </DialogContent>
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

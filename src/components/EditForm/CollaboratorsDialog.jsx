import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  TextField,
  Tooltip,
} from "@mui/material";
import { AccountCircle, Close as CloseIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { addCollaborator, deleteCollaborator } from "../../api/forms";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";

const CollaboratorsDialogBody = ({ closeDialog }) => {
  const { form } = useForm();
  const [collaborator, setCollaborator] = useState("");
  const [adding, setAdding] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();
  const openAlert = useAlert();

  return useMemo(() => {
    const handleChangeCollaborator = (e) => {
      setCollaborator(e.target.value);
    };

    const handleAddCollaborator = async (e) => {
      e.preventDefault();

      if (
        user.email === collaborator ||
        form.collaborators.find((c) => c.email === collaborator)
      ) {
        return enqueueSnackbar("Este usuario ya es colaborador", {
          variant: "error",
        });
      }

      setAdding(true);

      const { error } = await addCollaborator(form, collaborator);

      setAdding(false);

      if (error) {
        return enqueueSnackbar("No hay usuarios con este email", {
          variant: "error",
        });
      }

      enqueueSnackbar("Colaborador agregado", { variant: "success" });
      setCollaborator("");
    };

    const handleDeleteCollaborator = (collaborator) => {
      openAlert({
        title: "Eliminar colaborador",
        message: "¿Estás seguro de eliminar este colaborador?",
        fullWidth: false,
        action: () => {
          deleteCollaborator(form, collaborator);

          enqueueSnackbar("Colaborador eliminado", {
            variant: "success",
          });
        },
      });
    };

    return (
      <>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Colaboradores
          <Tooltip title="Cerrar" arrow>
            <IconButton onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ background: "inherit" }}>
          <List sx={{ background: "inherit" }}>
            <ListSubheader sx={{ background: "inherit" }}>
              Agregar Colaboradores
            </ListSubheader>
            <ListItem
              component="form"
              onSubmit={handleAddCollaborator}
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                variant="standard"
                fullWidth
                type="email"
                placeholder="Email"
                value={collaborator}
                onChange={handleChangeCollaborator}
              />
              <Button
                disabled={!collaborator || adding}
                type="submit"
                sx={{ alignSelf: "flex-end" }}
              >
                Agregar
              </Button>
            </ListItem>
            <ListItem
              sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1 }}
            >
              <Tooltip title={form.author.email} arrow>
                <Chip icon={<AccountCircle />} label={form.author.name} />
              </Tooltip>
              {form.collaborators.map((collaborator) => (
                <Tooltip
                  key={collaborator.email}
                  title={collaborator.email}
                  arrow
                >
                  <Chip
                    label={collaborator.name}
                    onDelete={() => handleDeleteCollaborator(collaborator)}
                  />
                </Tooltip>
              ))}
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cerrar</Button>
        </DialogActions>
      </>
    );
  }, [
    adding,
    closeDialog,
    collaborator,
    enqueueSnackbar,
    form,
    openAlert,
    user.email,
  ]);
};

const CollaboratorsDialog = ({ open, setOpen }) => {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullWidth
      maxWidth="sm"
      keepMounted={false}
    >
      <CollaboratorsDialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default CollaboratorsDialog;

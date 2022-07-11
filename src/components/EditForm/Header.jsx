import { useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import {
  ContentCopy,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  MoreVert,
  PaletteRounded as PaletteIcon,
  People as PeopleIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { deleteForm, duplicateForm } from "../../api/forms";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";
import PersonalizationDialog from "./PersonalizationDialog";
import SettingsDialog from "./SettingsDialog";
import SendDialog from "./SendDialog";
import CollaboratorsDialog from "./CollaboratorsDialog";
import Header from "../Header";

const EditFormHeader = ({ setOpenDrawer }) => {
  const { form } = useForm();
  const user = useUser();
  const openAlert = useAlert();
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);
  const [openPersonalization, setOpenPersonalization] = useState(false);
  const [openSend, setOpenSend] = useState(false);
  const [openCollaborators, setOpenCollaborators] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const popupStateMore = usePopupState({
    variant: "popover",
    popupId: "more-menu-aaaa",
  });

  const handleClickOpenSettings = () => {
    popupStateMore.close();
    setOpenSettings(true);
  };

  const handleClickOpenSend = () => {
    popupStateMore.close();
    setOpenSend(true);
  };

  const handleClickOpenCollaborators = () => {
    popupStateMore.close();
    setOpenCollaborators(true);
  };

  const toggleDrawer = () => {
    setOpenDrawer((openDrawer) => !openDrawer);
  };

  const handleDeleteForm = () => {
    navigate("/dashboard");
    deleteForm(form.id);

    enqueueSnackbar("Encuesta eliminada", { variant: "success" });
  };

  const handleDuplicateForm = async () => {
    popupStateMore.close();
    setDuplicating(true);
    const { error, newFormId } = await duplicateForm(form, user);

    if (error) {
      setDuplicating(false);
      return enqueueSnackbar("Error al duplicar la encuesta", {
        variant: "error",
      });
    }

    enqueueSnackbar("Encuesta duplicada", { variant: "success" });
    navigate(`/dashboard`);
    navigate(`/forms/edit/${newFormId}`);
  };

  const openDeleteDialog = () => {
    popupStateMore.close();
    openAlert({
      title: "Eliminar encuesta",
      message: "¿Estás seguro de que quieres eliminar esta encuesta?",
      action: handleDeleteForm,
    });
  };

  const openPersonalizationDialog = () => {
    popupStateMore.close();
    setOpenPersonalization(true);
  };

  return (
    <>
      <Header
        leftIcons={
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        }
        rightIcons={
          upMd && (
            <>
              <Tooltip title="Configuración" arrow>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleClickOpenSettings}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                sx={{ px: 3, ml: 1, mr: 2 }}
                onClick={handleClickOpenSend}
              >
                Enviar
              </Button>
            </>
          )
        }
        moreMenu={
          <>
            <Tooltip title="Más" arrow>
              <IconButton
                size="large"
                color="inherit"
                edge="end"
                {...bindTrigger(popupStateMore)}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
            <Menu {...bindMenu(popupStateMore)} disableEnforceFocus>
              {!upMd && [
                <MenuItem key={"0"} onClick={handleClickOpenSend}>
                  <ListItemIcon>
                    <SendIcon fontSize="small" />
                  </ListItemIcon>
                  Enviar
                </MenuItem>,
                <MenuItem key={"1"} onClick={handleClickOpenSettings}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Configuración
                </MenuItem>,
              ]}
              <MenuItem onClick={handleClickOpenCollaborators}>
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                Colaboradores
              </MenuItem>
              <MenuItem onClick={handleDuplicateForm}>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                Duplicar encuesta
              </MenuItem>
              <MenuItem onClick={openDeleteDialog}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                Eliminar encuesta
              </MenuItem>
              <MenuItem onClick={openPersonalizationDialog}>
                <ListItemIcon>
                  <PaletteIcon fontSize="small" />
                </ListItemIcon>
                Personalizar encuesta
              </MenuItem>
            </Menu>
          </>
        }
      />
      <SettingsDialog open={openSettings} setOpen={setOpenSettings} />
      <PersonalizationDialog
        open={openPersonalization}
        setOpen={setOpenPersonalization}
      />
      <SendDialog open={openSend} setOpen={setOpenSend} />
      <CollaboratorsDialog
        open={openCollaborators}
        setOpen={setOpenCollaborators}
      />
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={duplicating}
      >
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default EditFormHeader;

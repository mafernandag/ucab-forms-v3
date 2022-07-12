import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
  useMediaQuery,
  Typography,
  Divider,
  Box,
  //Select,
  //MenuItem,
} from "@mui/material";
import {
  //AddPhotoAlternateRounded as AddImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
//import { saveForm } from "../../api/forms";
import { CirclePicker } from "react-color";
//import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";
import { useColorMode } from "../../hooks/useColorMode";
import colors from "../../theme/colors";

const PersonalizationDialogBody = ({
  closeDialog,
  discardDialog,
  setChanges,
}) => {
  //const { form } = useForm();
  //const [settings, setSettings] = useState(form.settings);
  const { formTheme, setFormTheme } = useColorMode();
  const theme = useTheme();
  //const [font, setFont] = useState("");

  return useMemo(() => {
    // const handleChange = (field) => (value) => {
    //   setChanges(true);
    //   const newSettings = { ...settings, [field]: value };
    //   setFont(field.target.value);
    //   setSettings(newSettings);
    // };
    // const handleChange = (event) => {
    //   setFont(event.target.value);
    // };
    // const handleSaveForm = () => {
    //   const formData = { ...form, settings };
    //   saveForm(formData);

    //   closeDialog();
    // };

    const handleMainChange = (color) => {
      const i = colors.main.indexOf(color.hex);
      setFormTheme((formTheme) => {
        return {
          ...formTheme,
          main: i,
        };
      });
    };

    const handleBackgroundChange = (color) => {
      setFormTheme((formTheme) => {
        const j = colors[theme.palette.mode][formTheme.main].indexOf(color.hex);
        const newFormTheme = {
          ...formTheme,
          background: j,
        };
        return newFormTheme;
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
          Personalizar encuesta
          <Tooltip title="Cerrar" arrow>
            <IconButton onClick={discardDialog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent sx={{ background: "inherit" }}>
          <Divider variant="fullWidth" />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "column",
              my: 2,
            }}
          >
            <Typography sx={{ fontSize: "22" }}>Color del tema</Typography>
            <CirclePicker colors={colors.main} onChange={handleMainChange} />
          </Box>

          <Divider variant="fullWidth" />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "column",
              my: 2,
            }}
          >
            <Typography sx={{ fontSize: "22" }}>Color de fondo</Typography>
            <CirclePicker
              colors={colors[theme.palette.mode][formTheme.main]}
              onChange={handleBackgroundChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={discardDialog}>Descartar</Button>
          {/* <Button onClick={handleSaveForm}>Guardar</Button> */}
        </DialogActions>
      </>
    );
  }, [
    //closeDialog,
    discardDialog,
    //settings,
    //form,
    formTheme,
    setFormTheme,
    theme.palette.mode,
  ]);
};

const PersonalizationDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const openAlert = useAlert();
  const [changes, setChanges] = useState(false);

  const closeDialog = () => {
    setChanges(false);
    setOpen(false);
  };

  const discardDialog = () => {
    if (changes) {
      openAlert({
        title: "¿Deseas descartar los cambios?",
        message: "Si descartas los cambios, se perderán",
        fullWidth: false,
        action: closeDialog,
      });
    } else {
      closeDialog();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={discardDialog}
      fullScreen={fullScreen}
      maxWidth="sm"
      keepMounted={false}
    >
      <PersonalizationDialogBody
        setChanges={setChanges}
        discardDialog={discardDialog}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};

export default PersonalizationDialog;

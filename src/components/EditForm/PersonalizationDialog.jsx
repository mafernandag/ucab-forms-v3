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
  Select,
  MenuItem,
} from "@mui/material";
import {
  AddPhotoAlternateRounded as AddImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { saveForm } from "../../api/forms";
import { CirclePicker } from "react-color";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";
import { useColorMode } from "../../hooks/useColorMode";

const PersonalizationDialogBody = ({
  closeDialog,
  discardDialog,
  setChanges,
}) => {
  const { form } = useForm();
  const [settings, setSettings] = useState(form.settings);
  const { formTheme, setFormTheme } = useColorMode();
  const [font, setFont] = useState("");

  return useMemo(() => {
    const handleChange = (field) => (value) => {
      setChanges(true);
      const newSettings = { ...settings, [field]: value };
      setFont(field.target.value);
      setSettings(newSettings);
    };
    // const handleChange = (event) => {
    //   setFont(event.target.value);
    // };
    const handleSaveForm = () => {
      const formData = { ...form, settings };
      saveForm(formData);

      closeDialog();
    };

    const handlePrimaryChange = (color) => {
      setFormTheme((formTheme) => {
        const i = primaryColors.indexOf(color.hex);
        const newFormTheme = {
          primary: color.hex,
          background: backgroundColors[i][0],
        };
        return newFormTheme;
      });
    };

    const handleBackgroundChange = (color) => {
      setFormTheme((formTheme) => {
        const newFormTheme = { ...formTheme, background: color.hex };
        return newFormTheme;
      });
    };

    const primaryColors = ["#ffc526", "#6bc4eb", "#047732"]; //yellow, blue, green

    const backgroundColors = [
      ["#fffafa", "#fff0d9", "#ffe5bf", "#ffdba6", "#0a0a0a"], //yellow
      ["#fffafa", "#d9f2fd", "#c0eafc", "#a7e1fb", "#0a0a0a"], //blue
      ["#fffafa", "#e4f3e5", "#d2ebd3", "#c0e3c2", "#0a0a0a"], //green
    ];

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
            <CirclePicker
              colors={primaryColors}
              onChange={handlePrimaryChange}
            />
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
              colors={
                backgroundColors[primaryColors.indexOf(formTheme.primary)]
              }
              onChange={handleBackgroundChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={discardDialog}>Descartar</Button>
          <Button onClick={handleSaveForm}>Guardar</Button>
        </DialogActions>
      </>
    );
  }, [
    closeDialog,
    discardDialog,
    setChanges,
    settings,
    form,
    formTheme,
    setFormTheme,
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

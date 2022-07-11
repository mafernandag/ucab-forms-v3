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
  const { customFormColor, setCustomFormColor } = useColorMode();
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

    const greens = ["#4A903C", "#59AD48", "#63B752", "#70BD61"];
    const blues = ["#5DBFE9", "#6FC6EB", "#81CDEE", "#93D4F0"];
    const yellows = ["#F5B400", "#FFCE47", "#FFD35C", "#FFD970"];

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
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "column",
              marginBottom: 2,
            }}
          >
            <Typography sx={{ fontSize: "22" }}>Encabezado</Typography>

            <Button variant="outlined" startIcon={<AddImageIcon />}>
              Añadir encabezado
            </Button>
          </Box> */}

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
              colors={["#ffc526", "#40b4e5", "#047732"]}
              onChange={(color) => setCustomFormColor(color.hex)}
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
            <CirclePicker colors={yellows} />
            <CirclePicker colors={blues} />
            <CirclePicker colors={greens} />
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
            <Typography sx={{ fontSize: "22" }}>Estilo de fuente</Typography>

            <Select
              labelId="selectFontLabel"
              id="selectFont"
              value={font}
              label="Estilo de fuente"
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={"Roboto"}> Básico </MenuItem>
              <MenuItem value={"Aguafina Script"}> Aguafina Script </MenuItem>
              <MenuItem value={"Alegreya"}> Alegreya </MenuItem>
              <MenuItem value={"Annie Use Your Telescope"}>
                {" "}
                Annie Use Your Telescope{" "}
              </MenuItem>
            </Select>
          </Box>

          <Divider variant="fullWidth" />
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
    font,
    form,
    setCustomFormColor,
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

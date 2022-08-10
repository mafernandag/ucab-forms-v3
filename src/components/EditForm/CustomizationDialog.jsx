import { useMemo } from "react";
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
  Box,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { saveForm } from "../../api/forms";
import { CirclePicker } from "react-color";
import { useForm } from "../../hooks/useForm";
import colors from "../../theme/colors";
import fonts from "../../theme/fonts";
import { debounce } from "lodash";

const CustomizationDialogBody = ({ closeDialog }) => {
  const { form, setForm } = useForm();

  const debouncedSave = useMemo(() => {
    return debounce((form) => {
      saveForm(form);
    }, 1500);
  }, []);

  const updateForm = (field, value) => {
    const newForm = { ...form, [field]: value };

    debouncedSave(newForm);
    setForm(newForm);
  };

  const theme = useTheme();
  const themedColors = colors[theme.palette.mode];

  const backgroundColors = themedColors.background.map(
    (color) => themedColors.main[form.mainColorIndex] + color
  );

  const handleChangeFont = (event) => {
    updateForm("fontIndex", event.target.value);
  };

  const handleChangeHeaderColor = (color) => {
    const index = themedColors.header.indexOf(color.hex);
    updateForm("headerColorIndex", index);
  };

  const handleChangeMainColor = (color) => {
    const index = themedColors.main.indexOf(color.hex);
    updateForm("mainColorIndex", index);
  };

  const handleChangeBackgroundColor = (color) => {
    const alpha = color.rgb.a * 255;
    const index = backgroundColors.indexOf(color.hex + alpha.toString(16));
    updateForm("backgroundColorIndex", index);
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
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <Stack spacing={3}>
          <TextField
            variant="standard"
            select
            label="Fuente"
            value={form.fontIndex}
            onChange={handleChangeFont}
          >
            {fonts.map((font, i) => (
              <MenuItem key={i} value={i}>
                {font}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <Typography variant="body2" mb={1} color="text.secondary">
              Color principal
            </Typography>
            <CirclePicker
              colors={themedColors.header}
              color={themedColors.header[form.headerColorIndex]}
              onChange={handleChangeHeaderColor}
            />
          </Box>
          <Box>
            <Typography variant="body2" mb={1} color="text.secondary">
              Color secundario
            </Typography>
            <CirclePicker
              colors={themedColors.main}
              color={themedColors.main[form.mainColorIndex]}
              onChange={handleChangeMainColor}
            />
          </Box>
          <Box>
            <Typography variant="body2" mb={1} color="text.secondary">
              Color de fondo
            </Typography>
            <CirclePicker
              colors={backgroundColors}
              onChange={handleChangeBackgroundColor}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cerrar</Button>
      </DialogActions>
    </>
  );
};

const CustomizationDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <CustomizationDialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default CustomizationDialog;

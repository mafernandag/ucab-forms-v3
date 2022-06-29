import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Clear as ClearIcon,
  ExitToAppRounded as GoToIcon,
} from "@mui/icons-material";
import { SelectSettingsProps } from "../select/types";
import { SortableSettingsProps } from "../sortable/types";
import SelectSectionDialog from "../../components/EditForm/SelectSectionDialog";
import { useState } from "react";

type Props = SelectSettingsProps | SortableSettingsProps;

const EnumeratedOptions = ({ question, updateQuestion }: Props) => {
  const [openSelectSection, setOpenSelectSection] = useState(false);
  const handleChangeOption =
    (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const option = e.target.value;
      const options = [...question.options];
      options[i] = option;

      const newQuestion = { ...question, options };
      updateQuestion(newQuestion);
    };

  const addOption = () => {
    const option = "Opción " + (question.options.length + 1);
    const options = [...question.options, option];

    const newQuestion = { ...question, options };
    updateQuestion(newQuestion);
  };

  const deleteOption = (i: number) => () => {
    const options = [...question.options];
    options.splice(i, 1);

    const newQuestion = { ...question, options };
    updateQuestion(newQuestion);
  };
  //Here should be according to the i question
  const goToSectionOption = () => {
    setOpenSelectSection(true);
  };

  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Opciones</FormLabel>
        <FormGroup sx={{ mb: 1 }}>
          {question.options.map((option, i) => (
            <Box>
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    mr={2}
                    minWidth={15}
                    align="right"
                    color="text.secondary"
                  >
                    {i + 1}.
                  </Typography>
                  <TextField
                    variant="standard"
                    value={option}
                    onChange={handleChangeOption(i)}
                  />
                </Box>
                <Tooltip title="Eliminar opción" arrow>
                  <IconButton onClick={deleteOption(i)}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {question.conditioned && (
                <Button
                  variant="text"
                  startIcon={<GoToIcon />}
                  onClick={goToSectionOption}
                  size="small"
                >
                  Llevar a sección
                </Button>
              )}
            </Box>
          ))}
        </FormGroup>
        <Button size="small" onClick={addOption}>
          Agregar opción
        </Button>
      </FormControl>
      <SelectSectionDialog
        open={openSelectSection}
        setOpen={setOpenSelectSection}
      />
    </>
  );
};

export default EnumeratedOptions;

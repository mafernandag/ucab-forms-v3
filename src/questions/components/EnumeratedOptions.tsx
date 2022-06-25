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
import { Clear as ClearIcon } from "@mui/icons-material";
import { SelectSettingsProps } from "../select/types";
import { SortableSettingsProps } from "../sortable/types";

type Props = SelectSettingsProps | SortableSettingsProps;

const EnumeratedOptions = ({ question, updateQuestion }: Props) => {
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

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Opciones</FormLabel>
      <FormGroup sx={{ mb: 1 }}>
        {question.options.map((option, i) => (
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
        ))}
      </FormGroup>
      <Button size="small" onClick={addOption}>
        Agregar opción
      </Button>
    </FormControl>
  );
};

export default EnumeratedOptions;

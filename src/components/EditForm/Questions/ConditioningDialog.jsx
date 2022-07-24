import { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useForm } from "../../../hooks/useForm";
import { questionTypesConfig } from "../../../questions/config";
import { Box } from "@mui/system";
import { FILE } from "../../../questions/constants";

const ConditioningDialogBody = ({ closeDialog, updateSection }) => {
  const { section: currentSection, sections, questions } = useForm();

  const handleChangeSection = (e) => {
    const value = e.target.value;
    const newSection = {
      ...currentSection,
      conditionedSection: value,
      conditionedSectionLabel: null,
      conditionedQuestion: null,
      conditionedValue: null,
    };
    updateSection(newSection);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newSection = { ...currentSection, [field]: value };

    if (field === "conditionedQuestion") {
      const question = questions.find((question) => question.id === value);
      const type = question.type;

      newSection.conditionedValue =
        questionTypesConfig[type].getInitializedAnswer(question);
    }

    updateSection(newSection);
  };

  const conditionedSection = useMemo(() => {
    return sections.find(
      (section) => section.id === currentSection.conditionedSection
    );
  }, [currentSection, sections]);

  const conditionedSectionQuestions = useMemo(() => {
    return questions.filter(
      (question) => question.sectionId === currentSection.conditionedSection
    );
  }, [currentSection.conditionedSection, questions]);

  const conditionedQuestion = useMemo(() => {
    return questions.find(
      (question) => question.id === currentSection.conditionedQuestion
    );
  }, [currentSection.conditionedQuestion, questions]);

  const type = conditionedQuestion?.type;
  const Question = questionTypesConfig[type]?.Question;

  const possibleLabels = useMemo(() => {
    if (!conditionedSection) {
      return [];
    }

    if (conditionedSection.dynamicLabels) {
      const question = questions.find(
        (question) => question.id === conditionedSection.dynamicLabelsQuestion
      );

      if (!question) {
        return [];
      }

      return question.options;
    }

    return conditionedSection.labels;
  }, [conditionedSection, questions]);

  const updateValue = (value) => {
    const newSection = {
      ...currentSection,
      conditionedValue: value,
    };
    updateSection(newSection);
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
        Condicionar sección
        <Tooltip title="Cerrar" arrow>
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <Stack spacing={1}>
          <TextField
            variant="standard"
            select
            label="Sección"
            value={currentSection.conditionedSection || ""}
            onChange={handleChangeSection}
          >
            {sections.map((section) => (
              <MenuItem
                key={section.id}
                value={section.id}
                disabled={
                  currentSection.index <= section.index || section.iterable
                }
              >
                {section.title}
              </MenuItem>
            ))}
          </TextField>
          {possibleLabels.length > 0 && (
            <TextField
              variant="standard"
              select
              label="Etiqueta"
              value={currentSection.conditionedSectionLabel || ""}
              onChange={handleChange("conditionedSectionLabel")}
            >
              {possibleLabels.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            variant="standard"
            select
            label="Pregunta"
            value={currentSection.conditionedQuestion || ""}
            onChange={handleChange("conditionedQuestion")}
          >
            {conditionedSectionQuestions.map((question) => (
              <MenuItem
                key={question.id}
                value={question.id}
                disabled={question.type === FILE}
              >
                {question.title}
              </MenuItem>
            ))}
          </TextField>
          {Question && (
            <Box pt={2}>
              <Typography variant="body2" color="text.secondary">
                Respuesta
              </Typography>
              <Question
                question={conditionedQuestion}
                answer={currentSection.conditionedValue}
                updateAnswer={updateValue}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cerrar</Button>
      </DialogActions>
    </>
  );
};

const ConditioningDialog = ({ open, setOpen, updateSection }) => {
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
      keepMounted={false}
    >
      <ConditioningDialogBody
        closeDialog={closeDialog}
        updateSection={updateSection}
      />
    </Dialog>
  );
};

export default ConditioningDialog;

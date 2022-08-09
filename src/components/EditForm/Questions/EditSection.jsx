import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ContentCopy,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { debounce } from "lodash";
import {
  deleteSection,
  createSection,
  saveSection,
} from "../../../api/sections";
import { deleteQuestion, insertQuestion } from "../../../api/questions";
import { useForm } from "../../../hooks/useForm";
import { useAlert } from "../../../hooks/useAlert";
import { calculateNewIndex } from "../../../utils/forms";
import Labels from "./Labels";
import DynamicLabels from "./DynamicLabels";
import ConditioningDialog from "./ConditioningDialog";

const EditSection = ({ setOpenDrawer }) => {
  const {
    form,
    section,
    sections,
    setSections,
    currentSectionId,
    setCurrentSectionId,
    sectionQuestions,
  } = useForm();
  const openAlert = useAlert();

  const [openDialog, setOpenDialog] = useState(false);

  const debouncedSave = useMemo(() => {
    return debounce((newSection) => {
      saveSection(form.id, newSection);
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.id, currentSectionId]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const updateSection = (newSection) => {
    debouncedSave(newSection);

    setSections((sections) =>
      sections.map((s) => (s.id === section.id ? newSection : s))
    );
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    const newSection = { ...section, [field]: value };

    updateSection(newSection);
  };

  const handleChangeChecked = (field) => (e, checked) => {
    const newSection = { ...section, [field]: checked };

    if (field === "dynamicLabels") {
      if (checked) {
        newSection.labels = [];
      } else {
        newSection.dynamicLabelsSection = null;
        newSection.dynamicLabelsSectionLabel = null;
        newSection.dynamicLabelsQuestion = null;
      }
    }

    if (field === "conditioned") {
      if (checked) {
        setOpenDialog(true);
      } else {
        newSection.conditionedSection = null;
        newSection.conditionedSectionLabel = null;
        newSection.conditionedQuestion = null;
        newSection.conditionedValue = null;
      }
    }

    if (field === "iterable") {
      if (checked) {
        newSection.prefix = "";
      } else {
        newSection.prefix = null;
      }
    }

    updateSection(newSection);
  };

  const removeSection = () => {
    openAlert({
      title: "Eliminar sección",
      message: "¿Estás seguro de eliminar esta sección y todas sus preguntas?",
      action: () => {
        setSections((sections) => {
          return sections.map((section) => {
            if (
              section.dynamicLabelsSection === currentSectionId ||
              section.conditionedSection === currentSectionId
            ) {
              const newSection = { ...section };
              if (section.dynamicLabelsSection === currentSectionId) {
                newSection.dynamicLabels = false;
                newSection.dynamicLabelsSection = null;
                newSection.dynamicLabelsSectionLabel = null;
                newSection.dynamicLabelsQuestion = null;
              }
              if (section.conditionedSection === currentSectionId) {
                newSection.conditioned = false;
                newSection.conditionedSection = null;
                newSection.conditionedSectionLabel = null;
                newSection.conditionedQuestion = null;
                newSection.conditionedValue = null;
              }
              saveSection(form.id, newSection);
              return newSection;
            }
            return section;
          });
        });

        const deletedSectionPosition = sections.findIndex(
          (section) => section.id === currentSectionId
        );
        deleteSection(form.id, currentSectionId);

        sectionQuestions.forEach((question) => {
          deleteQuestion(form.id, question.id);
        });

        if (deletedSectionPosition > 0) {
          setCurrentSectionId(sections[deletedSectionPosition - 1].id);
        }
        setOpenDrawer(false);
      },
    });
  };

  const swapSection = (direction) => {
    const i = sections.indexOf(section);
    const j = direction === "left" ? i - 1 : i + 1;
    const k = direction === "left" ? i - 2 : i + 2;

    let newIndex;

    if (!sections[k]) {
      newIndex = sections[j].index + (direction === "left" ? -1 : 1);
    } else {
      newIndex = (sections[j].index + sections[k].index) / 2;
    }

    const newSection = { ...section, index: newIndex };

    if (
      direction === "left" &&
      section.dynamicLabels &&
      section.dynamicLabelsSection === sections[i - 1].id
    ) {
      newSection.dynamicLabels = false;
      newSection.dynamicLabelsSection = null;
      newSection.dynamicLabelsSectionLabel = null;
      newSection.dynamicLabelsQuestion = null;
    }

    if (
      direction === "left" &&
      section.conditioned &&
      section.conditionedSection === sections[i - 1].id
    ) {
      newSection.conditioned = false;
      newSection.conditionedSection = null;
      newSection.conditionedSectionLabel = null;
      newSection.conditionedQuestion = null;
      newSection.conditionedValue = null;
    }

    sections.forEach((section) => {
      if (
        (section.dynamicLabelsSection === newSection.id ||
          section.conditionedSection === newSection.id) &&
        section.index >= newIndex
      ) {
        const sectionToUpdate = { ...section };
        if (section.dynamicLabelsSection === newSection.id) {
          sectionToUpdate.dynamicLabels = false;
          sectionToUpdate.dynamicLabelsSection = null;
          sectionToUpdate.dynamicLabelsSectionLabel = null;
          sectionToUpdate.dynamicLabelsQuestion = null;
        }
        if (section.conditionedSection === newSection.id) {
          sectionToUpdate.conditioned = false;
          sectionToUpdate.conditionedSection = null;
          sectionToUpdate.conditionedSectionLabel = null;
          sectionToUpdate.conditionedQuestion = null;
          sectionToUpdate.conditionedValue = null;
        }
        saveSection(form.id, sectionToUpdate);
      }
    });

    saveSection(form.id, newSection);

    setSections((sections) =>
      sections.map((q) => (q.id === section.id ? newSection : q))
    );
  };

  const duplicateSection = () => {
    const position = sections.indexOf(section);
    const newIndex = calculateNewIndex(sections, position);
    const { id, ...sectionData } = section;

    sectionData.index = newIndex;
    sectionData.title = `${sectionData.title} - Copia`;
    sectionData.comments = [];

    const newSectionId = createSection(form.id, sectionData);

    const newSection = {
      ...sectionData,
      id: newSectionId,
    };

    setSections((sections) => {
      const newSections = [...sections];
      newSections.splice(position + 1, 0, newSection);
      return newSections;
    });

    sectionQuestions.forEach((question) => {
      const { id, ...questionData } = question;
      questionData.sectionId = newSectionId;
      insertQuestion(form.id, questionData);
    });

    setCurrentSectionId(newSectionId);
    setOpenDrawer(true);
  };

  if (!section) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Editar sección</Typography>
        <Box>
          <Tooltip title="Mover a la izquierda" arrow>
            <span>
              <IconButton
                disabled={section === sections[0]}
                onClick={() => swapSection("left")}
              >
                <ArrowBack />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Mover a la derecha" arrow>
            <span>
              <IconButton
                disabled={section === sections[sections.length - 1]}
                onClick={() => swapSection("right")}
              >
                <ArrowForward />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <TextField
        variant="standard"
        multiline
        label="Título de la sección"
        value={section.title}
        onChange={handleChange("title")}
      />
      <TextField
        variant="standard"
        multiline
        label="Descripción de la sección"
        value={section.description}
        onChange={handleChange("description")}
      />
      {section.iterable && (
        <TextField
          variant="standard"
          label="Prefijo de numeración"
          value={section.prefix}
          onChange={handleChange("prefix")}
        />
      )}
      {section.dynamicLabels ? (
        <DynamicLabels updateSection={updateSection} />
      ) : (
        <Labels updateSection={updateSection} />
      )}
      <Box>
        {(section.dynamicLabels || sections[0] !== section) && (
          <FormControlLabel
            control={<Checkbox />}
            checked={section.dynamicLabels}
            onChange={handleChangeChecked("dynamicLabels")}
            label="Generar etiquetas a partir de respuesta"
          />
        )}
        <FormControlLabel
          control={<Checkbox />}
          checked={section.iterable}
          onChange={handleChangeChecked("iterable")}
          label="Repetir un número determinado de veces"
        />
        {(section.conditioned || sections[0] !== section) && (
          <FormControlLabel
            control={<Checkbox />}
            checked={section.conditioned}
            onChange={handleChangeChecked("conditioned")}
            label="Condicionar sección"
          />
        )}
        <FormControlLabel
          control={<Checkbox />}
          checked={section.hideCard}
          onChange={handleChangeChecked("hideCard")}
          label="Ocultar tarjeta de sección"
        />
        {section.conditioned && (
          <Button fullWidth onClick={handleOpenDialog} sx={{ my: 1 }}>
            Configurar condicionamiento
          </Button>
        )}
        <ConditioningDialog
          open={openDialog}
          setOpen={setOpenDialog}
          updateSection={updateSection}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Duplicar sección" arrow>
            <IconButton onClick={() => duplicateSection()}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar sección" arrow>
            <IconButton onClick={() => removeSection()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Stack>
  );
};

export default EditSection;

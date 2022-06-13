import {
  Box,
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
import debounce from "lodash.debounce";
import { deleteSection, createSection, saveSection } from "../../api/sections";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";
import { calculateNewIndex } from "../../utils/forms";
import { useMemo } from "react";

const EditSection = ({ setOpenDrawer }) => {
  const {
    form,
    section,
    sections,
    setSections,
    currentSectionId,
    setCurrentSectionId,
  } = useForm();
  const openAlert = useAlert();

  const debouncedSave = useMemo(
    () =>
      debounce((newSection) => {
        saveSection(form.id, newSection);
      }, 1500),
    [form.id]
  );

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    const newSection = { ...section, [field]: value };

    debouncedSave(newSection);

    setSections((sections) =>
      sections.map((s) => (s.id === section.id ? newSection : s))
    );
  };

  const removeSection = () => {
    openAlert({
      title: "Eliminar sección",
      message: "¿Estás seguro de eliminar esta sección y todas sus preguntas?",
      action: () => {
        const deletedSectionPosition = sections.findIndex(
          (section) => section.id === currentSectionId
        );
        deleteSection(form.id, currentSectionId);
        if (deletedSectionPosition > 0) {
          setCurrentSectionId(sections[deletedSectionPosition - 1].id);
        }
        setOpenDrawer(false);
      },
    });
  };

  // TODO: Swap questions
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

    saveSection(form.id, newSection);

    setSections((sections) =>
      sections.map((q) => (q.id === section.id ? newSection : q))
    );
  };

  // TODO: Duplicate questions
  const duplicateSection = () => {
    const position = sections.indexOf(section);
    const newIndex = calculateNewIndex(sections, position);
    const { id, ...sectionData } = section;

    sectionData.index = newIndex;

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
    </Stack>
  );
};

export default EditSection;

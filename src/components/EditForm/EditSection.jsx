import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Popover,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  ArrowBack,
  ArrowForward,
  ContentCopy,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { debounce } from "lodash";
import { deleteSection, createSection, saveSection } from "../../api/sections";
import { deleteQuestion, insertQuestion } from "../../api/questions";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";
import { calculateNewIndex } from "../../utils/forms";
import { useMemo, useState } from "react";

//BORRAR
//Funcion para generar ID's de prueba, borrar una vez implementado el back
// para las estiquetas
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//BORRAR

const EditSection = ({ setOpenDrawer }) => {
  const {
    form,
    section,
    sections,
    setSections,
    currentSectionId,
    setCurrentSectionId,
    sectionQuestions,
    labels,
    setLabels,
    labelsAndSections,
    setLabelsAndSections,
  } = useForm();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [errorPopover, setErrorPopover] = useState(false);

  const openAlert = useAlert();

  const filter = createFilterOptions();

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

    const newSectionId = createSection(form.id, sectionData);

    const newSection = {
      ...sectionData,
      title: `${sectionData.title} - Copia`,
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

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
    const labelTitle = event.target.children[0].innerText;
    const label = labels.find((l) => l.title === labelTitle);
    setCurrentLabel(label);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentLabel(null);
  };

  const handlePopoverChange = (e) => {
    const value = e.target.value;

    const newLabel = { ...currentLabel, title: value };

    setCurrentLabel(newLabel);

    const titleExists = labels.find((l) => l.title === value);

    if (titleExists) {
      setErrorPopover(true);
    } else {
      setLabels((labels) =>
        labels.map((l) => (l.id === currentLabel.id ? newLabel : l))
      );
      setErrorPopover(false);
    }
  };

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
      <Autocomplete
        disablePortal
        multiple
        disableCloseOnSelect
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        noOptionsText="No hay etiquetas"
        options={labels}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          //Add "xxx" option created dynamically
          if (option.addLabelText) {
            return option.addLabelText;
          }
          //selected option
          if (option.labelId) {
            const label = labels.find((label) => label.id === option.labelId);
            return label ? label.title : "";
          }
          // Regular option
          return option.title;
        }}
        isOptionEqualToValue={(option, value) => option.id === value.labelId}
        value={labelsAndSections.filter(
          (label) => label.sectionId === currentSectionId
        )}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.title
          );

          if (inputValue !== "" && !isExisting) {
            filtered.push({
              addLabelText: `Agregar "${inputValue}"`,
              title: inputValue,
            });
          }

          return filtered;
        }}
        onChange={(event, newValue, reason) => {
          if (newValue) {
            const currentLabels = newValue.map((label) => {
              //Creating new label
              if (label.addLabelText) {
                const newLabel = {
                  id: makeid(20),
                  title: label.title,
                  originSectionId: currentSectionId,
                };

                setLabels((labels) => {
                  labels.push(newLabel);
                  return labels;
                });

                return {
                  labelId: newLabel.id,
                  sectionId: currentSectionId,
                };
              }

              //Adding an existing label
              if (label.id) {
                return {
                  labelId: label.id,
                  sectionId: currentSectionId,
                };
              }

              return label;
            });

            setLabelsAndSections((labelsAndSections) => {
              const foreignLabels = labelsAndSections.filter(
                (label) => label.sectionId !== currentSectionId
              );
              return foreignLabels.concat(currentLabels);
            });
          }
        }}
        ChipProps={{
          sx: { width: "100%", justifyContent: "space-between" },
          onClick: (event) => handlePopoverClick(event),
        }}
        renderInput={(params) => (
          <TextField {...params} label="Etiquetas" variant="standard" />
        )}
      />
      {currentLabel !== null && (
        <Popover
          open={anchorEl !== null}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box sx={{ padding: 3 }}>
            <TextField
              variant="standard"
              error={errorPopover}
              helperText={
                errorPopover ? "Ya existe esa etiqueta con ese titulo" : ""
              }
              label="Titulo de la etiqueta"
              value={currentLabel.title}
              onChange={handlePopoverChange}
            />
          </Box>
        </Popover>
      )}
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

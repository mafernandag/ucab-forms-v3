import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Chip,
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
import { useMemo } from "react";

//BORRAR
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
            const label = labels.find(label => label.id === option.labelId);
            return label ? label.title : '';
          }
          // Regular option
          return option.title;
        }}
        isOptionEqualToValue={(option, value) => (option.id === value.labelId)}
        // groupBy={(label) => {
        //   const section = sections.find(s => s.id === label.originSectionId);
        //   return section ? section.title : null;
        // }}
        value={labelsAndSections.filter(label => label.sectionId === currentSectionId)}
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
          console.log(event);
          if (newValue) {
            const currentLabels = newValue.map((label) => {
              //Creating new label
              if (label.addLabelText) {
                const newLabel = {
                  id: makeid(20),
                  title: label.title,
                  originSectionId: currentSectionId,
                };

                setLabels(labels => {
                  labels.push(newLabel);
                  return labels;
                });

                return {
                  labelId: newLabel.id,
                  sectionId: currentSectionId,
                }
              }

              //Adding an existing label
              if (label.id) {
                return {
                  labelId: label.id,
                  sectionId: currentSectionId,
                }
              }

              return label;
            });

            setLabelsAndSections(labelsAndSections => {
              const foreignLabels = labelsAndSections.filter(
                (label) => label.sectionId !== currentSectionId
              );
              return foreignLabels.concat(currentLabels);
            });
          }
        }}
        renderTags={(value, getTagProps, ownerState) => {
          return (
            <Stack spacing={1} sx={{ padding: 1 }}>
              {value.map(option => {
                const label = labels.find(label => label.id === option.labelId);
                const title = label ? label.title : '';
                return <Chip key={option.labelId} label={title} onDelete={() => {
                  setLabelsAndSections( labelsAndSections => {
                    const index = labelsAndSections.findIndex( r => 
                      r.labelId ===  option.labelId &&
                      r.sectionId === currentSectionId
                    );
                    labelsAndSections.splice(index, 1);
                    return labelsAndSections;
                  })

                  const index = value.findIndex( r => 
                    r.labelId ===  option.labelId &&
                    r.sectionId === currentSectionId
                  );
                  console.log(index);
                  value.splice(index, 1);
                }} />
              })}
            </Stack>
          )
        }}
        renderInput={(params) => (
          <TextField {...params} label="Etiquetas" variant="standard" />
        )}
      />
      <ul>
        {labelsAndSections.map(option => (<li key={option.labelId}>{option.labelId}</li>))}
      </ul>
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

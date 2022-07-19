import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Clear as ClearIcon } from "@mui/icons-material";
import { uniq } from "lodash";
import { useForm } from "../../../hooks/useForm";
import { saveSection } from "../../../api/sections";

const filter = createFilterOptions();

const Labels = ({ updateSection }) => {
  const { form, sections, section, setSections, currentSectionId } = useForm();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [currentSectionId]);

  const labels = useMemo(() => {
    const labels = [];
    sections.forEach((s) => {
      labels.push(...s.labels);
    });

    const possibleLabels = labels.filter((l) => !section.labels.includes(l));

    return uniq(possibleLabels);
  }, [sections, section]);

  const handleInputChange = (e, value) => {
    setInputValue(value);
  };

  const handleChange = (e, value) => {
    if (value && !section.labels.includes(value)) {
      const newSection = { ...section };
      newSection.labels = [...section.labels, value];
      updateSection(newSection);
      setInputValue("");
    }
  };

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;

    if (inputValue && !options.includes(inputValue)) {
      filtered.push(inputValue);
    }

    return filtered;
  };

  const handleDelete = (label) => () => {
    setSections((sections) => {
      return sections.map((section) => {
        if (section.dynamicLabelsSectionLabel === label) {
          const newSection = { ...section, dynamicLabelsSectionLabel: null };
          saveSection(form.id, newSection);
          return newSection;
        }
        return section;
      });
    });

    const newSection = { ...section };
    newSection.labels = section.labels.filter((l) => l !== label);

    if (newSection.labels.length === 0) {
      newSection.iterable = false;
    }

    updateSection(newSection);
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Etiquetas
      </Typography>
      <Box>
        {section.labels.map((label, i) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>{label}</Typography>
            </Box>
            <Tooltip title="Eliminar etiqueta" arrow>
              <IconButton onClick={handleDelete(label)}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
      <Autocomplete
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={labels}
        value={null}
        onChange={handleChange}
        filterOptions={filterOptions}
        disableCloseOnSelect
        disableClearable
        selectOnFocus
        handleHomeEndKeys
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Agregar etiqueta"
          />
        )}
      />
    </Stack>
  );
};

export default Labels;

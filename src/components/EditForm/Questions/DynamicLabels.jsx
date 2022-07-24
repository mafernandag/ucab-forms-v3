import { useMemo } from "react";
import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "../../../hooks/useForm";
import { dynamicLabelsQuestionTypes } from "../../../questions/constants";

const DynamicLabels = ({ updateSection }) => {
  const { section: currentSection, sections, questions } = useForm();

  const handleChangeSection = (e) => {
    const value = e.target.value;
    const newSection = {
      ...currentSection,
      dynamicLabelsSection: value,
      dynamicLabelsSectionLabel: null,
      dynamicLabelsQuestion: null,
    };
    updateSection(newSection);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newSection = { ...currentSection, [field]: value };
    updateSection(newSection);
  };

  const dynamicLabelsSection = useMemo(() => {
    return sections.find(
      (section) => section.id === currentSection.dynamicLabelsSection
    );
  }, [currentSection, sections]);

  const dynamicLabelsSectionQuestions = useMemo(() => {
    return questions.filter(
      (question) => question.sectionId === currentSection.dynamicLabelsSection
    );
  }, [currentSection.dynamicLabelsSection, questions]);

  const possibleLabels = useMemo(() => {
    if (!dynamicLabelsSection) {
      return [];
    }

    if (dynamicLabelsSection.dynamicLabels) {
      const question = questions.find(
        (question) => question.id === dynamicLabelsSection.dynamicLabelsQuestion
      );

      if (!question) {
        return [];
      }

      return question.options;
    }

    return dynamicLabelsSection.labels;
  }, [dynamicLabelsSection, questions]);

  const allowsDynamicLabels = (questionType) => {
    return dynamicLabelsQuestionTypes.includes(questionType);
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Generar etiquetas a partir de
      </Typography>
      <TextField
        variant="standard"
        select
        label="Sección"
        value={currentSection.dynamicLabelsSection || ""}
        onChange={handleChangeSection}
      >
        {sections.map((section) => (
          <MenuItem
            key={section.id}
            value={section.id}
            disabled={currentSection.index <= section.index || section.iterable}
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
          value={currentSection.dynamicLabelsSectionLabel || ""}
          onChange={handleChange("dynamicLabelsSectionLabel")}
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
        value={currentSection.dynamicLabelsQuestion || ""}
        onChange={handleChange("dynamicLabelsQuestion")}
      >
        {dynamicLabelsSectionQuestions.map((question) => (
          <MenuItem
            key={question.id}
            value={question.id}
            disabled={!allowsDynamicLabels(question.type)}
          >
            {question.title}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default DynamicLabels;

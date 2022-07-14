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
      (section) =>
        section.id === currentSection.dynamicLabelsSection &&
        section.index < currentSection.index
    );
  }, [currentSection, sections]);

  const dynamicLabelsSectionQuestions = useMemo(() => {
    return questions.filter(
      (question) => question.sectionId === currentSection.dynamicLabelsSection
    );
  }, [currentSection.dynamicLabelsSection, questions]);

  const dynamicLabelsQuestion = useMemo(() => {
    return dynamicLabelsSectionQuestions.find(
      (question) => question.id === currentSection.dynamicLabelsQuestion
    );
  }, [currentSection.dynamicLabelsQuestion, dynamicLabelsSectionQuestions]);

  const getDynamicLabelsSectionLabel = (dynamicLabelsSection) => {
    return dynamicLabelsSection.labels.find(
      (label) => label === currentSection.dynamicLabelsSectionLabel
    );
  };

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
        value={dynamicLabelsSection?.id || ""}
        onChange={handleChangeSection}
      >
        {sections.map((section) => (
          <MenuItem
            key={section.id}
            value={section.id}
            disabled={currentSection.index <= section.index}
          >
            {section.title}
          </MenuItem>
        ))}
      </TextField>
      {dynamicLabelsSection?.labels.length > 0 && (
        // TODO: Consider dynamic labels here
        <TextField
          variant="standard"
          select
          label="Etiqueta"
          value={getDynamicLabelsSectionLabel(dynamicLabelsSection) || ""}
          onChange={handleChange("dynamicLabelsSectionLabel")}
        >
          {dynamicLabelsSection.labels.map((label) => (
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
        value={dynamicLabelsQuestion?.id || ""}
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

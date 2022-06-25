import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { PlaylistAdd, Queue } from "@mui/icons-material";
import { sortBy } from "lodash";
import { defaultQuestion } from "../../../questions/constants";
import { defaultSection } from "../../../constants/sections";
import { useForm } from "../../../hooks/useForm";
import { insertQuestion } from "../../../api/questions";
import { createSection } from "../../../api/sections";
import SectionCard from "./SectionCard";
import QuestionPreview from "./QuestionPreview";
import { calculateNewIndex } from "../../../utils/forms";

const Questions = ({ setOpenDrawer }) => {
  const {
    form,
    sections,
    setSections,
    setQuestions,
    sectionQuestions,
    currentQuestionId,
    setCurrentQuestionId,
    currentSectionId,
    setCurrentSectionId,
  } = useForm();

  const addQuestion = () => {
    const position = sectionQuestions.findIndex(
      (q) => q.id === currentQuestionId
    );

    const newIndex = calculateNewIndex(sectionQuestions, position);

    const newQuestion = {
      index: newIndex,
      sectionId: currentSectionId,
      ...defaultQuestion,
    };

    const questionId = insertQuestion(form.id, newQuestion);

    const question = {
      ...newQuestion,
      id: questionId,
    };

    setQuestions((questions) => {
      const newQuestions = [...questions, question];
      return sortBy(newQuestions, ["sectionId", "index"]);
    });

    setCurrentQuestionId(questionId);
    setOpenDrawer(true);
  };

  const addSection = () => {
    const sectionPosition = sections.findIndex(
      (s) => s.id === currentSectionId
    );
    const newSectionIndex = calculateNewIndex(sections, sectionPosition);

    const newSection = {
      ...defaultSection,
      index: newSectionIndex,
    };

    const sectionId = createSection(form.id, newSection);

    const section = {
      ...newSection,
      id: sectionId,
    };

    setSections((sections) => {
      const newSections = [...sections];
      newSections.splice(sectionPosition + 1, 0, section);
      return newSections;
    });

    const newQuestion = {
      ...defaultQuestion,
      index: 0,
      sectionId: sectionId,
    };

    const questionId = insertQuestion(form.id, newQuestion);

    const question = {
      ...newQuestion,
      id: questionId,
    };

    setQuestions((questions) => {
      const newQuestions = [...questions, question];
      return sortBy(newQuestions, ["sectionId", "index"]);
    });

    setCurrentSectionId(sectionId);
    setOpenDrawer(true);
  };

  const handleChangeSection = (e, value) => {
    setCurrentSectionId(value);
  };

  return (
    <Box>
      {currentSectionId && (
        <TabContext value={currentSectionId}>
          <TabList
            onChange={handleChangeSection}
            indicatorColor="primary"
            variant="scrollable"
            aria-label="sections tabs"
            sx={{
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                opacity: 0.3,
              },
            }}
          >
            {sections.map((section) => (
              <Tab
                key={section.id}
                label={section.title}
                value={section.id}
                wrapped
              />
            ))}
          </TabList>
          {sections.map((section) => (
            <TabPanel key={section.id} sx={{ p: 0, pt: 2 }} value={section.id}>
              <Stack spacing={2}>
                <SectionCard section={section} setOpenDrawer={setOpenDrawer} />
                {sectionQuestions.map((question) => (
                  <QuestionPreview
                    key={question.id}
                    question={question}
                    setOpenDrawer={setOpenDrawer}
                  />
                ))}
              </Stack>
            </TabPanel>
          ))}
        </TabContext>
      )}
      <SpeedDial
        ariaLabel="acciones"
        sx={{ position: "fixed", bottom: "8%", right: "5%" }}
        icon={<SpeedDialIcon />}
      >
        {sections.length && (
          <SpeedDialAction
            icon={<PlaylistAdd />}
            tooltipTitle="Agregar pregunta"
            onClick={addQuestion}
          />
        )}
        <SpeedDialAction
          icon={<Queue />}
          tooltipTitle="Agregar sección"
          onClick={addSection}
        />
      </SpeedDial>
    </Box>
  );
};

export default Questions;

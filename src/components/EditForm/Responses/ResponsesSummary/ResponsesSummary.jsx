import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useForm } from "../../../../hooks/useForm";
import QuestionStat from "./QuestionStat";
import Card from "../../../Card";
import SectionComments from "./SectionComments";

const ResponsesSummary = () => {
  const { questions, sections, responses } = useForm();
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const answers = useMemo(() => responses.map((r) => r.answers), [responses]);

  const currentSection = useMemo(() => {
    return sections.find((section) => section.id === currentSectionId);
  }, [currentSectionId, sections]);

  const sectionQuestions = useMemo(() => {
    return questions.filter(
      (question) => question.sectionId === currentSectionId
    );
  }, [questions, currentSectionId]);

  useEffect(() => {
    if (!currentSection && sections.length) {
      setCurrentSectionId(sections[0].id);
    }
  }, [currentSection, sections, setCurrentSectionId]);

  const handleChangeSection = (e, value) => {
    setCurrentSectionId(value);
  };

  return (
    <Box>
      <Stack spacing={2}>
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
              <TabPanel key={section.id} sx={{ p: 0 }} value={section.id}>
                <Stack spacing={2}>
                  <SectionComments section={section} />
                  {sectionQuestions.map((question) => (
                    <Card key={question.id}>
                      <Typography>{question.title}</Typography>
                      <QuestionStat
                        question={question}
                        section={section}
                        answers={answers}
                      />
                    </Card>
                  ))}
                </Stack>
              </TabPanel>
            ))}
          </TabContext>
        )}
      </Stack>
    </Box>
  );
};

export default ResponsesSummary;

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
  Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useForm } from "../../../hooks/useForm";
import { getResponseCountText } from "../../../utils/stats";
import Card from "../../Card";
import { questionTypesConfig } from "../../../questions/config";

const ResponsesByQuestion = () => {
  const { responses, sections, questions } = useForm();
  const [page, setPage] = useState(1);
  const [currentSectionId, setCurrentSectionId] = useState(null);

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

  useEffect(() => {
    setPage(1);
  }, [currentSectionId]);

  const handleChangeSection = (e, value) => {
    setCurrentSectionId(value);
  };

  const question = sectionQuestions[page - 1];
  const answers = responses.map((r) => r.answers);

  const getAnswersWithStats = useCallback(() => {
    const responseCount = {};

    answers.forEach((response) => {
      const getSerializableValue =
        questionTypesConfig[question.type].getSerializableValue;

      const value = getSerializableValue(response[question.id]);

      const strigifiedValue = JSON.stringify(value);

      if (responseCount[strigifiedValue]) {
        responseCount[strigifiedValue]++;
      } else {
        responseCount[strigifiedValue] = 1;
      }
    });

    const sortedResponseCount = Object.entries(responseCount).sort(
      ([valueA, countA], [valueB, countB]) => countB - countA
    );

    return sortedResponseCount.map(([value, count]) => ({
      value: JSON.parse(value),
      count,
    }));
  }, [answers, question]);

  const renderItem = (item) => {
    let title = "";

    if (item.type === "page") {
      title = sectionQuestions[item.page - 1].title;
    } else if (item.type === "previous") {
      title = "Anterior";
    } else if (item.type === "next") {
      title = "Siguiente";
    }

    return (
      <Tooltip title={title} arrow>
        <span>
          <PaginationItem {...item} />
        </span>
      </Tooltip>
    );
  };

  const type = question?.type;
  const ResponseByQuestion = questionTypesConfig[type]?.ResponseByQuestion;

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
                  <Pagination
                    count={sectionQuestions.length}
                    page={page}
                    onChange={(e, p) => setPage(p)}
                    color="primary"
                    shape="rounded"
                    renderItem={renderItem}
                    sx={{ py: 1 }}
                  />
                  {question && (
                    <>
                      <Card>
                        <Typography fontSize="h6.fontSize">
                          {question.title}
                        </Typography>
                      </Card>
                      {getAnswersWithStats().map((answer, i) => (
                        <Card key={i}>
                          <Box sx={{ mb: 1 }}>
                            {answer.value === "" ||
                            answer.value === undefined ||
                            answer.value === null ||
                            answer.value.length === 0 ? (
                              <Typography fontStyle="italic">
                                Respuesta vacía
                              </Typography>
                            ) : (
                              <ResponseByQuestion
                                question={question}
                                value={answer.value}
                              />
                            )}
                          </Box>
                          <Typography color="text.secondary" variant="caption">
                            {getResponseCountText(answer.count)}
                          </Typography>
                        </Card>
                      ))}
                    </>
                  )}
                </Stack>
              </TabPanel>
            ))}
          </TabContext>
        )}
      </Stack>
    </Box>
  );
};

export default ResponsesByQuestion;

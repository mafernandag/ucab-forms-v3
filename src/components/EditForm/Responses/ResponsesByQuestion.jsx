import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
  Tab,
  TextField,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useForm } from "../../../hooks/useForm";
import { getResponseCountText } from "../../../utils/stats";
import Card from "../../Card";
import { questionTypesConfig } from "../../../questions/config";
import { getSectionLabels, isEmpty } from "../../../questions/utils";
import { DEFAULT_LABEL } from "../../../questions/constants";

const ResponsesByQuestion = () => {
  const { responses, sections, questions } = useForm();
  const [page, setPage] = useState(1);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentLabel, setCurrentLabel] = useState("");

  const currentSection = useMemo(() => {
    const section = sections.find((section) => section.id === currentSectionId);

    if (section) {
      const sectionLabels = getSectionLabels(section, questions);
      setCurrentLabel(sectionLabels[0]);
    }

    return section;
  }, [currentSectionId, questions, sections]);

  const sectionQuestions = useMemo(() => {
    return questions.filter(
      (question) => question.sectionId === currentSectionId
    );
  }, [questions, currentSectionId]);

  useEffect(() => {
    if (!currentSection && sections.length) {
      return setCurrentSectionId(sections[0].id);
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

  const sectionLabels = useMemo(() => {
    if (currentSection) {
      return getSectionLabels(currentSection, questions);
    }
    return [];
  }, [currentSection, questions]);

  const getAnswersWithStats = useCallback(() => {
    const responseCount = {};

    answers.forEach((response) => {
      const getSerializableValue =
        questionTypesConfig[question.type].getSerializableValue;

      const value = getSerializableValue(response[question.id]?.[currentLabel]);

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
  }, [answers, currentLabel, question]);

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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "center", sm: "center" },
                      gap: 1.5,
                    }}
                  >
                    <Pagination
                      count={sectionQuestions.length}
                      page={page}
                      onChange={(e, p) => setPage(p)}
                      color="primary"
                      shape="rounded"
                      renderItem={renderItem}
                      sx={{ py: 1 }}
                    />
                    {sectionLabels[0] !== DEFAULT_LABEL && (
                      <TextField
                        select
                        variant="standard"
                        label="Etiqueta"
                        sx={{ width: 150 }}
                        value={currentLabel}
                        onChange={(e) => {
                          setCurrentLabel(e.target.value);
                        }}
                      >
                        {sectionLabels.map((label) => (
                          <MenuItem key={label} value={label}>
                            {label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Box>
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
                            {isEmpty(answer.value) ? (
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

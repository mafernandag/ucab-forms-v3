import { useEffect, useMemo, useState } from "react";
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
import { formatDateTime } from "../../../../utils/dates";
import { useForm } from "../../../../hooks/useForm";
import ResponseComments from "./ResponseComments";
import Card from "../../../Card";
import AnswerCard from "./AnswerCard";

const Response = () => {
  const { responses, sections, questions } = useForm();
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [page, setPage] = useState(1);

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
    setCurrentSectionId(sections?.[0].id);
  }, [page, sections]);

  const handleChangeSection = (e, value) => {
    setCurrentSectionId(value);
  };

  const renderItem = (item) => {
    let title = "";

    if (item.type === "page") {
      title = formatDateTime(responses[item.page - 1].submittedAt);
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

  const response = responses[page - 1];

  return (
    <Box>
      <Stack spacing={2}>
        <Pagination
          count={responses.length}
          page={page}
          onChange={(e, p) => setPage(p)}
          color="primary"
          shape="rounded"
          renderItem={renderItem}
        />
        <Typography align="right" variant="caption" color="text.secondary">
          Respondido el {formatDateTime(response.submittedAt)}
        </Typography>
        {response.location && (
          <Card>
            <Typography mb={2}>Ubicación</Typography>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                pt: "75%",
              }}
            >
              <Box
                component="iframe"
                title="user-location"
                src={`https://maps.google.com/maps?q=${response.location.latitude},${response.location.longitude}&hl=es;z=15&output=embed`}
                allowFullScreen
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </Box>
          </Card>
        )}
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
                  {sectionQuestions.map((question) => (
                    <Stack key={question.id} spacing={1}>
                      <AnswerCard
                        answer={response.answers[question.id]}
                        section={section}
                        question={question}
                      />
                      <ResponseComments
                        response={response}
                        question={question}
                      />
                    </Stack>
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

export default Response;

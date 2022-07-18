import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { cloneDeep, debounce, last } from "lodash";
import { getFormOnce } from "../../api/forms";
import { getSavedResponse, saveResponse } from "../../api/savedResponses";
import { submitResponse, checkUserHasResponses } from "../../api/responses";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";
import Header from "../Header";
import Card from "../Card";
import Question from "../Question";
import AnswerPageText from "../AnswerPageText";
import { questionConfig } from "../../questions";
import { DEFAULT_LABEL } from "../../questions/constants";
import { getLabels } from "./utils";
import { isEmpty } from "../../questions/utils";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentLabel, setCurrentLabel] = useState();
  const [response, setResponse] = useState({});
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userHasResponses, setUserHasResponses] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();
  const openAlert = useAlert();

  const debouncedSave = useMemo(() => {
    return debounce((answers) => {
      if (user) {
        saveResponse(formId, user.id, answers);
      }
    }, 1500);
  }, [formId, user]);

  useEffect(() => {
    debouncedSave(answers);
  }, [answers, debouncedSave]);

  const sectionQuestions = useMemo(() => {
    return form?.questions.filter(
      (question) => question.sectionId === currentSectionId
    );
  }, [currentSectionId, form?.questions]);

  const currentSection = useMemo(() => {
    return form?.sections.find((section) => section.id === currentSectionId);
  }, [currentSectionId, form?.sections]);

  const currentSectionPosition = useMemo(() => {
    return form?.sections.findIndex(
      (section) => section.id === currentSectionId
    );
  }, [currentSectionId, form?.sections]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSectionId, currentLabel]);

  const initializeSectionAnswers = useCallback(
    (section, questions, savedAnswers) => {
      setAnswers((answers) => {
        const newAnswers = savedAnswers ?? cloneDeep(answers);

        const sectionQuestions = questions.filter(
          (question) => question.sectionId === section.id
        );

        sectionQuestions.forEach((question) => {
          newAnswers[question.id] = newAnswers[question.id] || {};

          const labels = getLabels(section, answers, questions);

          labels.forEach((label) => {
            const type = question.type;
            const getInitializedAnswer =
              questionConfig[type].getInitializedAnswer;

            if (newAnswers[question.id][label] === undefined) {
              newAnswers[question.id][label] = getInitializedAnswer(question);
            }
          });

          for (const label in newAnswers[question.id]) {
            if (!labels.includes(label)) {
              delete newAnswers[question.id][label];
            }
          }
        });

        return newAnswers;
      });
    },
    []
  );

  const resetForm = () => {
    openAlert({
      title: "Limpiar encuesta",
      message:
        "¿Estás seguro de querer borrar todas tus respuestas de esta encuesta?",
      fullWidth: false,
      action: () => {
        setErrors({});
        setAnswers({});
        initializeSectionAnswers(form.sections[0], form.questions);
        setCurrentSectionId(form.sections[0].id);
      },
    });
  };

  useEffect(() => {
    const randomizeOptionsOrder = (questions) => {
      questions.forEach((question) => {
        if (question.randomOrder) {
          question.options.sort(() => Math.random() - 0.5);
        }
      });
    };

    const getForm = async () => {
      const form = await getFormOnce(formId);
      if (form) {
        if (form.settings.onlyOneResponse && !user) {
          setForm(form);
          return setLoading(false);
        }

        randomizeOptionsOrder(form.questions);

        if (form.settings.randomOrder) {
          form.questions.sort(() => Math.random() - 0.5);
        }

        if (form.settings.onlyOneResponse) {
          const hasResponses = await checkUserHasResponses(form.id, user.id);

          setUserHasResponses(hasResponses);
        }

        setForm(form);

        if (form.sections.length) {
          setCurrentSectionId(form.sections[0].id);
          setCurrentLabel(form.sections[0].labels[0] || DEFAULT_LABEL);

          let answers = {};

          if (user) {
            answers = await getSavedResponse(form.id, user.id);

            const emptyAnswers = Object.keys(answers).every((questionId) =>
              Object.keys(answers[questionId]).every((label) =>
                isEmpty(answers[questionId][label])
              )
            );

            if (!emptyAnswers) {
              enqueueSnackbar("Se recuperaron tus respuestas", {
                variant: "success",
              });
            }
          }

          initializeSectionAnswers(form.sections[0], form.questions, answers);
        }

        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setResponse((response) => ({
            ...response,
            location: { latitude, longitude },
          }));
        });
      }
      setLoading(false);
    };

    getForm();
  }, [enqueueSnackbar, formId, initializeSectionAnswers, user]);

  const getPreviousSection = (currentSectionPosition) => {
    if (currentSectionPosition === 1) {
      return form.sections[0];
    }

    const previousSection = form.sections[currentSectionPosition - 1];

    if (getLabels(previousSection, answers, form.questions).length) {
      return previousSection;
    }

    return getPreviousSection(currentSectionPosition - 1);
  };

  const handleBack = (e) => {
    e.preventDefault();

    const sectionLabels = getLabels(currentSection, answers, form.questions);

    if (currentLabel !== sectionLabels[0]) {
      const currentLabelIndex = sectionLabels.indexOf(currentLabel);

      return setCurrentLabel(sectionLabels[currentLabelIndex - 1]);
    }

    const previousSection = getPreviousSection(currentSectionPosition);
    const previousSectionLabels = getLabels(
      previousSection,
      answers,
      form.questions
    );

    setCurrentLabel(last(previousSectionLabels));

    setCurrentSectionId(previousSection.id);
  };

  const getNextSection = (currentSectionPosition) => {
    const nextSection = form.sections[currentSectionPosition + 1];

    if (!nextSection) {
      return null;
    }

    if (getLabels(nextSection, answers, form.questions).length) {
      return nextSection;
    }

    return getNextSection(currentSectionPosition + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let shouldReturn = false;
    const newErrors = { ...errors };

    sectionQuestions.forEach((question) => {
      newErrors[question.id] = "";

      if (
        question.required &&
        !questionConfig[question.type].checkRequired(
          answers[question.id][currentLabel]
        )
      ) {
        newErrors[question.id] = "Esta pregunta es obligatoria";
        shouldReturn = true;
      }

      if (
        !questionConfig[question.type].checkFormat(
          answers[question.id][currentLabel]
        )
      ) {
        newErrors[question.id] = "El formato es inválido";
        shouldReturn = true;
      }
    });

    setErrors(newErrors);

    if (shouldReturn) {
      return enqueueSnackbar("Aún tienes preguntas pendientes", {
        variant: "error",
      });
    }

    const sectionLabels = getLabels(currentSection, answers, form.questions);
    const currentLabelIndex = sectionLabels.indexOf(currentLabel);

    if (currentLabelIndex !== sectionLabels.length - 1) {
      return setCurrentLabel(sectionLabels[currentLabelIndex + 1]);
    }

    const nextSection = getNextSection(currentSectionPosition);

    if (nextSection) {
      const nextSectionLabels = getLabels(nextSection, answers, form.questions);
      setCurrentLabel(nextSectionLabels[0]);
      initializeSectionAnswers(nextSection, form.questions);
      return setCurrentSectionId(nextSection.id);
    }

    setSubmitting(true);

    const responseData = {
      ...response,
      answers,
    };

    if (form.settings.onlyOneResponse) {
      responseData.user = { ...user };
    }

    const { error } = await submitResponse(form, user, responseData);

    if (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      return setSubmitting(false);
    }

    navigate(`/forms/answer/${formId}/sent`);
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return <AnswerPageText>No se encontró la encuesta</AnswerPageText>;
  }

  if (!form.settings.allowResponses) {
    return <AnswerPageText>Esta encuesta no admite respuestas</AnswerPageText>;
  }

  if (
    form.settings.maxResponses &&
    form.responses >= form.settings.maxResponses
  ) {
    return (
      <AnswerPageText>Esta encuesta ya no admite más respuestas</AnswerPageText>
    );
  }

  if (form.settings.startDate && form.settings.startDate > new Date()) {
    return (
      <AnswerPageText>Esta encuesta aún no está disponible</AnswerPageText>
    );
  }

  if (form.settings.endDate && form.settings.endDate < new Date()) {
    return <AnswerPageText>Esta encuesta ya no está disponible</AnswerPageText>;
  }

  if (form.settings.onlyOneResponse) {
    if (!user) {
      return (
        <AnswerPageText>
          Debes estar registrado para responder esta encuesta
        </AnswerPageText>
      );
    }

    if (userHasResponses) {
      return <AnswerPageText>Ya has respondido esta encuesta</AnswerPageText>;
    }
  }

  if (form.sections.length === 0 || form.questions.length === 0) {
    return <AnswerPageText>Esta encuesta no tiene preguntas</AnswerPageText>;
  }

  return (
    <Box>
      <Header />
      <Container sx={{ p: 3 }} maxWidth="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Card>
              <Typography variant="h5" mb={2}>
                {form.title}
              </Typography>
              <Typography mb={2}>{form.description}</Typography>
              <Typography color="error" variant="caption">
                * Obligatorio
              </Typography>
            </Card>
            {currentSection && !currentSection.hideCard && (
              <Card
                sx={{
                  borderBottom: (theme) =>
                    `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Typography variant="h6" mb={1}>
                  {currentSection.title}
                </Typography>
                <Typography>{currentSection.description}</Typography>
              </Card>
            )}
            {currentSection && currentLabel !== DEFAULT_LABEL && (
              <Card>
                <Typography variant="h6">{currentLabel}</Typography>
              </Card>
            )}
            {sectionQuestions.map((question) => (
              <Card
                key={question.id}
                sx={{
                  ...(errors[question.id] && {
                    borderColor: (theme) => theme.palette.error.light,
                  }),
                }}
              >
                <Question
                  label={currentLabel}
                  question={question}
                  answers={answers}
                  setAnswers={setAnswers}
                />
                {errors[question.id] && (
                  <Alert
                    variant="outlined"
                    severity="error"
                    sx={{ mt: 3, border: "none", p: 0 }}
                  >
                    {errors[question.id]}
                  </Alert>
                )}
              </Card>
            ))}
          </Stack>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: { sm: "space-between" },
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: { sm: 1 }, mr: { sm: 2 } }}
            >
              Nunca envíes contraseñas a través de UCAB Forms
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexShrink: 0,
                alignItems: "center",
                mb: { xs: 2, sm: 0 },
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Button
                sx={{ px: 1, mr: { xs: 1, sm: 2 } }}
                disabled={submitting}
                onClick={resetForm}
              >
                Limpiar encuesta
              </Button>
              {(currentSectionPosition !== 0 ||
                currentLabel !==
                  getLabels(currentSection, answers, form.questions)[0]) && (
                <Button variant="outlined" sx={{ px: 3 }} onClick={handleBack}>
                  Atrás
                </Button>
              )}
              {!getNextSection(currentSectionPosition) &&
              currentLabel ===
                last(getLabels(currentSection, answers, form.questions)) ? (
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="contained"
                  sx={{ px: 4 }}
                >
                  Enviar
                </Button>
              ) : (
                <Button type="submit" variant="contained" sx={{ px: 3 }}>
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default AnswerForm;

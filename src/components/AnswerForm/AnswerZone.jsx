import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { debounce } from "lodash";
import { saveResponse } from "../../api/savedResponses";
import { submitResponse } from "../../api/responses";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";
import Header from "../Header";
import Card from "../Card";
import Question from "../Question";
import { questionConfig } from "../../questions";
import { DEFAULT_LABEL } from "../../questions/constants";
import { getAnswers, getPages } from "./utils";

const AnswerZone = ({ form, answers, setAnswers, response }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const openAlert = useAlert();
  const user = useUser();

  const pages = useMemo(() => getPages(form, answers), [answers, form]);

  const page = pages[pageIndex];
  const section = page.section;
  const label = page.label;
  const questions = page.questions;

  const debouncedSave = useMemo(() => {
    return debounce((answers) => {
      if (user) {
        saveResponse(form.id, user.id, answers);
      }
    }, 1500);
  }, [form.id, user]);

  useEffect(() => {
    debouncedSave(answers);
  }, [answers, debouncedSave]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIndex]);

  const resetForm = (e) => {
    e.preventDefault();
    openAlert({
      title: "Limpiar encuesta",
      message:
        "¿Estás seguro de querer borrar todas tus respuestas de esta encuesta?",
      fullWidth: false,
      action: () => {
        const answers = getAnswers(pages, {});
        setAnswers(answers);
        setErrors({});
        setPageIndex(0);
      },
    });
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrors({});
    setPageIndex(pageIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let shouldReturn = false;
    const newErrors = { ...errors };

    questions.forEach((question) => {
      newErrors[question.id] = "";

      if (
        question.required &&
        !questionConfig[question.type].checkRequired(
          answers[question.id][label]
        )
      ) {
        newErrors[question.id] = "Esta pregunta es obligatoria";
        shouldReturn = true;
      }

      if (
        !questionConfig[question.type].checkFormat(answers[question.id][label])
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

    if (pageIndex < pages.length - 1) {
      const newAnswers = getAnswers(pages, answers);
      setAnswers(newAnswers);
      return setPageIndex(pageIndex + 1);
    }

    setSubmitting(true);

    const responseData = {
      ...response,
      answers,
    };

    if (form.settings.onlyOneResponse) {
      responseData.user = { ...user };
    }

    debouncedSave.cancel();

    const { error } = await submitResponse(form, user, responseData);

    if (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      debouncedSave(answers);
      return setSubmitting(false);
    }

    navigate(`/forms/answer/${form.id}/sent`);
  };

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
            {!section.hideCard && (
              <Card
                sx={{
                  borderBottom: (theme) =>
                    `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Typography variant="h6" mb={1}>
                  {section.title}
                </Typography>
                <Typography>{section.description}</Typography>
              </Card>
            )}
            {label !== DEFAULT_LABEL && (
              <Card>
                <Typography variant="h6">{label}</Typography>
              </Card>
            )}
            {questions.map((question) => (
              <Card
                key={question.id}
                sx={{
                  ...(errors[question.id] && {
                    borderColor: (theme) => theme.palette.error.light,
                  }),
                }}
              >
                <Question
                  label={label}
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
              {pageIndex > 0 && (
                <Button variant="outlined" sx={{ px: 3 }} onClick={handleBack}>
                  Atrás
                </Button>
              )}
              {pageIndex === pages.length - 1 ? (
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

export default AnswerZone;

import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getFormOnce } from "../../api/forms";
import { getSavedResponse } from "../../api/savedResponses";
import { checkUserHasResponses } from "../../api/responses";
import { useUser } from "../../hooks/useUser";
import Header from "../Header";
import AnswerPageText from "../AnswerPageText";
import { getAnswers, getPages } from "./utils";
import { isEmpty } from "../../questions/utils";
import AnswerZone from "./AnswerZone";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [response, setResponse] = useState({});
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [userHasResponses, setUserHasResponses] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();

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

          const pages = getPages(form, answers);
          const newAnswers = getAnswers(pages, answers);
          setAnswers(newAnswers);
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
  }, [enqueueSnackbar, formId, user]);

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
    <AnswerZone
      form={form}
      answers={answers}
      setAnswers={setAnswers}
      response={response}
    />
  );
};

export default AnswerForm;

import { useMemo } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  ContentCopy,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { debounce } from "lodash";
import { compatibility } from "../../../questions/constants";
import {
  deleteQuestion,
  insertQuestion,
  saveQuestion,
} from "../../../api/questions";
import { useForm } from "../../../hooks/useForm";
import { useAlert } from "../../../hooks/useAlert";
import EditOptions from "./EditOptions";
import { calculateNewIndex } from "../../../utils/forms";
import { questionConfig, questionTypes } from "../../../questions";

const EditQuestion = ({ setOpenDrawer }) => {
  const {
    form,
    question,
    setQuestions,
    sectionQuestions,
    currentQuestionId,
    setCurrentQuestionId,
    responses,
  } = useForm();
  const openAlert = useAlert();

  const debouncedSave = useMemo(
    () =>
      debounce((newQuestion) => {
        saveQuestion(form.id, newQuestion);
      }, 1500),
    [form.id]
  );

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    const newQuestion = { ...question, [field]: value };

    debouncedSave(newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const handleChangeType = (e) => {
    const type = e.target.value;

    const newQuestion = questionConfig[type].initializeFields(question, type);

    debouncedSave(newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const removeQuestion = () => {
    openAlert({
      title: "Eliminar pregunta",
      message: "¿Estás seguro de eliminar esta pregunta?",
      action: () => {
        const deletedQuestionPosition = sectionQuestions.findIndex(
          (question) => question.id === currentQuestionId
        );
        deleteQuestion(form.id, currentQuestionId);
        if (deletedQuestionPosition > 0) {
          setCurrentQuestionId(
            sectionQuestions[deletedQuestionPosition - 1].id
          );
        }
        setOpenDrawer(false);
      },
    });
  };

  const swapQuestion = (direction) => {
    const i = sectionQuestions.indexOf(question);
    const j = direction === "up" ? i - 1 : i + 1;
    const k = direction === "up" ? i - 2 : i + 2;

    let newIndex;

    if (!sectionQuestions[k]) {
      newIndex = sectionQuestions[j].index + (direction === "up" ? -1 : 1);
    } else {
      newIndex = (sectionQuestions[j].index + sectionQuestions[k].index) / 2;
    }

    const newQuestion = { ...question, index: newIndex };

    saveQuestion(form.id, newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const duplicateQuestion = () => {
    const position = sectionQuestions.indexOf(question);
    const newIndex = calculateNewIndex(sectionQuestions, position);
    const { id, ...questionData } = question;

    questionData.index = newIndex;

    const newQuestionId = insertQuestion(form.id, questionData);

    const newQuestion = {
      ...questionData,
      id: newQuestionId,
    };

    setQuestions((questions) => {
      const newQuestions = [...questions];
      const position = questions.indexOf(question);
      newQuestions.splice(position + 1, 0, newQuestion);
      return newQuestions;
    });

    setCurrentQuestionId(newQuestionId);
    setOpenDrawer(true);
  };

  const disableType = (type) => {
    let shouldCheckDisable = false;

    responses.forEach((r) => {
      const answer = r.answers[question.id];
      if (answer || answer === 0) {
        shouldCheckDisable = true;
      }
    });

    if (!shouldCheckDisable) {
      return false;
    }

    return !compatibility[question.type].includes(type);
  };

  if (!question) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Editar pregunta</Typography>
        <Box>
          <Tooltip title="Mover arriba" arrow>
            <span>
              <IconButton
                disabled={question === sectionQuestions[0]}
                onClick={() => swapQuestion("up")}
              >
                <ArrowUpward />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Mover abajo" arrow>
            <span>
              <IconButton
                disabled={
                  question === sectionQuestions[sectionQuestions.length - 1]
                }
                onClick={() => swapQuestion("down")}
              >
                <ArrowDownward />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <TextField
        variant="standard"
        multiline
        label="Título de la pregunta"
        value={question.title}
        onChange={handleChange("title")}
      />
      <TextField
        variant="standard"
        select
        label="Tipo de pregunta"
        value={question.type}
        onChange={handleChangeType}
      >
        {questionTypes.map((type) => (
          <MenuItem
            key={type.value}
            value={type.value}
            disabled={disableType(type.value)}
          >
            {type.label}
          </MenuItem>
        ))}
      </TextField>
      <Box>
        <Stack spacing={3}>
          <EditOptions question={question} debouncedSave={debouncedSave} />
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Duplicar pregunta" arrow>
            <IconButton onClick={() => duplicateQuestion()}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar pregunta" arrow>
            <IconButton onClick={() => removeQuestion()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Stack>
  );
};

export default EditQuestion;

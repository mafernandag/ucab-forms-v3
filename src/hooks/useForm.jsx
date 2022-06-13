import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm } from "../api/forms";
import { getQuestionsChanges } from "../api/questions";
import { getResponses } from "../api/responses";
import { getSectionsChanges } from "../api/sections";

const FormContext = createContext();

const useForm = () => {
  return useContext(FormContext);
};

const FormProvider = ({ children }) => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [isSectionSelected, setSectionSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeForm = getForm(formId, (form) => {
      setForm(form);
      setLoading(false);
    });

    const unsubscribeSections = getSectionsChanges(formId, (changes) => {
      setSections((oldSections) => {
        const sections = [...oldSections];

        changes.forEach((change) => {
          if (
            change.type === "added" &&
            !oldSections.find((section) => section.id === change.section.id)
          ) {
            sections.splice(change.newIndex, 0, change.section);
          } else if (change.type === "modified") {
            sections.splice(change.oldIndex, 1);
            sections.splice(change.newIndex, 0, change.section);
          } else if (change.type === "removed") {
            sections.splice(change.oldIndex, 1);
          }
        });

        return sections;
      });
    });

    const unsubscribeQuestions = getQuestionsChanges(formId, (changes) => {
      setQuestions((oldQuestions) => {
        const questions = [...oldQuestions];

        changes.forEach((change) => {
          if (
            change.type === "added" &&
            !oldQuestions.find((question) => question.id === change.question.id)
          ) {
            questions.splice(change.newIndex, 0, change.question);
          } else if (change.type === "modified") {
            questions.splice(change.oldIndex, 1);
            questions.splice(change.newIndex, 0, change.question);
          } else if (change.type === "removed") {
            questions.splice(change.oldIndex, 1);
          }
        });

        return questions;
      });
    });

    const unsubscribeResponses = getResponses(formId, (responses) => {
      setResponses(responses);
    });

    return () => {
      unsubscribeForm();
      unsubscribeSections();
      unsubscribeQuestions();
      unsubscribeResponses();
    };
  }, [formId]);

  const question = useMemo(() => {
    return questions.find((question) => question.id === currentQuestionId);
  }, [questions, currentQuestionId]);

  useEffect(() => {
    if (!question) {
      setCurrentQuestionId(null);
    }
  }, [question]);

  const section = useMemo(() => {
    return sections.find((section) => section.id === currentSectionId);
  }, [sections, currentSectionId]);

  const sectionQuestions = useMemo(() => {
    return questions.filter(
      (question) => question.sectionId === currentSectionId
    );
  }, [questions, currentSectionId]);

  useEffect(() => {
    if (!section && sections.length) {
      setCurrentSectionId(sections[0].id);
    }
  }, [section, sections]);

  useEffect(() => {
    if (!section && isSectionSelected) {
      setSectionSelected(false);
    }
  }, [section, isSectionSelected]);

  useEffect(() => {
    if (currentSectionId) {
      setSectionSelected(true);
    }
  }, [currentSectionId]);

  useEffect(() => {
    if (isSectionSelected) {
      setCurrentQuestionId(null);
    }
  }, [isSectionSelected]);

  useEffect(() => {
    if (currentQuestionId) {
      setSectionSelected(false);
    }
  }, [currentQuestionId]);

  useEffect(() => {
    if (!currentQuestionId) {
      setSectionSelected(true);
    }
  }, [currentQuestionId]);

  const value = {
    form,
    setForm,
    section,
    sections,
    setSections,
    question,
    questions,
    setQuestions,
    sectionQuestions,
    responses,
    loading,
    currentSectionId,
    setCurrentSectionId,
    currentQuestionId,
    setCurrentQuestionId,
    isSectionSelected,
    setSectionSelected,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export { useForm, FormProvider };

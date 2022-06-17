import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getQuestionsOnce = async (formId) => {
  const questionsRef = collection(db, "forms", formId, "questions");

  const q = query(questionsRef, orderBy("index"));

  const snapshot = await getDocs(q);

  const questions = snapshot.docs.map((doc) => {
    const question = doc.data();
    question.id = doc.id;

    return question;
  });

  return questions;
};

export const getQuestions = (formId, callback) => {
  const questionsRef = collection(db, "forms", formId, "questions");

  const q = query(questionsRef, orderBy("index"));

  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map((doc) => {
      const question = doc.data();
      question.id = doc.id;
      return question;
    });

    callback(questions);
  });
};

export const getQuestionsChanges = (formId, callback) => {
  const questionsRef = collection(db, "forms", formId, "questions");

  const q = query(questionsRef, orderBy("sectionId"), orderBy("index"));

  return onSnapshot(q, (snapshot) => {
    const changes = snapshot.docChanges().map((change) => ({
      type: change.type,
      oldIndex: change.oldIndex,
      newIndex: change.newIndex,
      question: { ...change.doc.data(), id: change.doc.id },
    }));

    callback(changes);
  });
};

export const insertQuestion = (formId, question) => {
  const questionsRef = collection(db, "forms", formId, "questions");
  const questionRef = doc(questionsRef);
  setDoc(questionRef, question);

  return questionRef.id;
};

export const saveQuestion = (formId, question) => {
  const { id: questionId, ...questionData } = question;
  const questionRef = doc(db, "forms", formId, "questions", questionId);
  updateDoc(questionRef, questionData);
};

export const deleteQuestion = (formId, questionId) => {
  const questionRef = doc(db, "forms", formId, "questions", questionId);
  deleteDoc(questionRef);
};

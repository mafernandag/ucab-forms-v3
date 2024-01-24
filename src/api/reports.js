import {
  arrayUnion,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { defaultQuestion } from "../questions/constants";
import { defaultSection } from "../constants/sections";
import { getQuestionsOnce, insertQuestion } from "./questions";
import { sendNotification } from "./notifications";
import { createSection, getSectionsOnce } from "./sections";

export const createReport = async (user, formId) => {
  const formRef = doc(db, "forms", formId);
  const form = await getDoc(formRef);
  const reportRef = doc(db, "reports", formId);
  const questions = await getQuestionsOnce(form.id);
  const questionInfo = questions.reduce((acc, question) => {
    return {
      ...acc,
      [question.id]: {
        title: question.title,
        type: question.type,
      },
    };
  }, {});

  const report = await getDoc(reportRef);
  if (report.exists()) {
    console.log("ya existe wey");
    await setDoc(
      reportRef,
      {
        title: form.data().title,
        description: form.data().description,
        questions: questionInfo,
        questionOrder: Object.keys(questionInfo),
      },
      { merge: true }
    );
  } else {
    console.log("creando reporte");
    await setDoc(reportRef, {
      author: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      title: form.data().title,
      description: form.data().description,
      createdAt: new Date(),
      questions: questionInfo,
      questionOrder: Object.keys(questionInfo),
      /*     collaborators: [],
      settings: {
      
      }, */
      /*     fontIndex: 0,
      headerColorIndex: 0,
      mainColorIndex: 0,
      backgroundColorIndex: 0, */
    });

    /*   const sectionId = createSection(formRef.id, {
      ...defaultSection,
      index: 0,
    });

    insertQuestion(formRef.id, {
      ...defaultQuestion,
      index: 0,
      sectionId,
    }); */
  }
  return reportRef.id;
};

export const getDataframe = async (reportId) => {
  const reportRef = doc(db, "reports", reportId);
  const df = await getDoc(reportRef);
  if (df.exists()) {
    const dataframeCollectionRef = collection(reportRef, "dataframe");
    const dataframeSnapshot = await getDocs(dataframeCollectionRef);
    const dataframe = dataframeSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return dataframe;
  } else {
    throw new Error("Report does not exist");
  }
};

export const deleteReport = async (reportId) => {
  const reportRef = doc(db, "reports", reportId);
  const reportDoc = await getDoc(reportRef);
  if (reportDoc.exists()) {
    deleteDoc(reportRef);
    // TODO: Delete questions, sections, responses, etc.
  }
};

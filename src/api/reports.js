import {
  arrayUnion,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  collectionGroup,
} from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import { getQuestionsOnce, insertQuestion } from "./questions";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { defaultQuestion } from "../questions/constants";
import { defaultSection } from "../constants/sections";
import { createSection } from "./sections";
import Papa from "papaparse";
import { create } from "lodash";

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
    });
  }
  return reportRef.id;
};

export const createReportFromFile = async (user, file) => {
  const csvData = await new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        resolve(results);
      },
    });
  });
  const columns = csvData.meta.fields.map((field) => ({
    title: field,
    field,
  }));
  const data = csvData.data;
  const { formId, questions } = await createCsvForm(user, file, columns, data);
  console.log(formId);
  const reportRef = doc(db, "reports", formId);
  const fileRef = ref(storage, `${Date.now() + "_" + file.name}`);
  const snapshot = await uploadBytes(fileRef, file);

  await setDoc(reportRef, {
    author: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    title: file.name,
    description: "",
    createdAt: new Date(),
    questions: questions,
    questionOrder: Object.keys(questions),
    fileUrl: snapshot.metadata.fullPath,
  });
  console.log(reportRef.id);
  return reportRef.id;
};

export const createCsvForm = async (user, file, columns, data) => {
  const formsRef = collection(db, "forms");
  const formRef = doc(formsRef);

  setDoc(formRef, {
    author: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    title: file.name,
    description: "",
    createdAt: new Date(),
    responses: 0,
    collaborators: [],
    csvImport: true,
    settings: {
      allowResponses: true,
      maxResponses: "",
      onlyOneResponse: false,
      startDate: null,
      endDate: null,
      randomOrder: false,
      saveUserData: false,
    },
    fontIndex: 0,
    headerColorIndex: 0,
    mainColorIndex: 0,
    backgroundColorIndex: 0,
  });

  const questionsRef = collection(db, "forms", formRef.id, "questions");
  const responsesRef = collection(db, "forms", formRef.id, "responses");

  let questions = {};
  for (const column of columns) {
    const docRef = await addDoc(questionsRef, column);
    questions[docRef.id] = { id: docRef.id, title: column.title };
  }

  for (const row of data) {
    let newRow = {};
    for (const [key, value] of Object.entries(row)) {
      const columnId = Object.keys(questions).find(
        (id) => questions[id].title === key
      );
      if (columnId) {
        newRow[columnId] = value;
      }
    }
    await addDoc(responsesRef, newRow);
  }
  return { formId: formRef.id, questions };
};

export const getCSVFile = async (reportId) => {
  const questionsRef = collection(db, "forms", reportId, "questions");
  const questionsSnapshot = await getDocs(questionsRef);
  const responsesRef = collection(db, "forms", reportId, "responses");
  const responsesSnapshot = await getDocs(responsesRef);
  const columns = questionsSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  const data = responsesSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  console.log("col", columns);
  console.log("data", data);
  return { columns, data };
};

export const getQuestionsFromCSV = async (reportId) => {
  const questionsRef = collection(db, "forms", reportId, "questions");
  const questionsSnapshot = await getDocs(questionsRef);
  const columns = questionsSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return columns;
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

export const deleteReport = async (reportId, formId) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);
  deleteDoc(reportRef);
  /* const reportDoc = await getDoc(reportRef);

  if (reportDoc.exists()) {
    await deleteDoc(reportRef);
  } */
};

export const getUserReports = (userId, callback) => {
  const reportsQuery = query(
    collection(db, "reports"),
    where("author.id", "==", userId)
  );

  return onSnapshot(reportsQuery, async (snapshot) => {
    const reportsPromises = snapshot.docs.map(async (doc) => {
      const reportId = doc.id;
      const cleanDataQuery = query(
        collection(db, "reports", reportId, "cleanData")
      );
      const cleanDataSnapshot = await getDocs(cleanDataQuery);

      return cleanDataSnapshot.docs.map((doc) => {
        const report = doc.data();
        report.id = doc.id;
        report.createdAt = report.createdAt.toDate();
        return report;
      });
    });

    const reports = await Promise.all(reportsPromises);
    callback(reports.flat());
  });
};

export const getReport = (formId, reportId, callback) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);
  const authorRef = doc(db, "reports", formId);

  getDoc(authorRef).then((authorDoc) => {
    if (!authorDoc.exists()) {
      console.log("No such author document!");
      return;
    }

    const author = authorDoc.data().author;

    return onSnapshot(reportRef, (doc) => {
      if (!doc.exists()) {
        console.log("No such report document!");
        return callback(null);
      }

      const report = doc.data();
      report.id = doc.id;
      report.author = author;
      report.createdAt = report.createdAt.toDate();

      callback(report);
    });
  });
};

export const getCleanDf = async (formId, reportId) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);
  const reportDoc = await getDoc(reportRef);

  if (!reportDoc.exists()) {
    return null;
  }

  const newDfRef = collection(reportRef, "newDf");

  // Fetch documents from the 'newDf' collection
  const newDfSnapshot = await getDocs(newDfRef);

  const orderRef = doc(db, "reports", formId);
  const orderDoc = await getDoc(orderRef);
  const order = orderDoc.data().questionOrder;
  //console.log(order);

  // Map the documents to an array of dictionaries
  const newDf = newDfSnapshot.docs.map((doc) => {
    const data = doc.data();
    const orderedData = {};
    order.forEach((orderKey) => {
      // Find all keys in data that contain the orderKey
      const dataKeys = Object.keys(data).filter((key) =>
        key.includes(orderKey)
      );
      dataKeys.forEach((dataKey) => {
        orderedData[dataKey] = data[dataKey];
      });
    });
    orderedData.id = doc.id;
    return orderedData;
  });

  return newDf;
};

export const getGraphs = async (formId, reportId) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);
  const reportDoc = await getDoc(reportRef);

  if (!reportDoc.exists()) {
    return null;
  }

  console.log("Getting graphs");
  const data = reportDoc.data();
  console.log(data);
  const confusionMatrix = data.confusionMatrix;
  const tree = data.tree;
  const featureImportance = data.featureImportance;
  const pairplot = data.pairplot;
  const elbowPlot = data.elbowPlot;
  const clusterPlot = data.clusterPlot;

  return {
    confusionMatrix,
    tree,
    featureImportance,
    pairplot,
    elbowPlot,
    clusterPlot,
  };
};

export const changeTitle = async (formId, reportId, newTitle) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);
  await updateDoc(reportRef, {
    title: newTitle,
  });
};

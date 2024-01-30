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
  collectionGroup,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getQuestionsOnce } from "./questions";

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
    });
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

export const deleteReport = async (reportId, formId) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);
  const reportDoc = await getDoc(reportRef);

  if (reportDoc.exists()) {
    await deleteDoc(reportRef);
  }
};

export const getUserReports = async (userId) => {
  const reportsQuery = query(
    collection(db, "reports"),
    where("author.id", "==", userId)
  );
  const reportsSnapshot = await getDocs(reportsQuery);

  const reportsPromises = reportsSnapshot.docs.map(async (doc) => {
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
  console.log(reports.flat());
  return reports.flat();
};

export const getReport = (formId, reportId, callback) => {
  const reportRef = doc(db, "reports", formId, "cleanData", reportId);

  return onSnapshot(reportRef, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const report = doc.data();
    report.id = doc.id;
    report.createdAt = report.createdAt.toDate();

    callback(report);
  });
};

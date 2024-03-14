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

  return onSnapshot(reportRef, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const report = doc.data();
    report.id = doc.id;
    console.log(doc.id, reportId);
    report.createdAt = report.createdAt.toDate();

    callback(report);
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

  //console.log(newDf);

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

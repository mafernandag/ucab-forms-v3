import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { uploadFiles } from "./storage";
import { FILE } from "../questions/constants";
import { sendNotification } from "./notifications";
import { getSectionLabels } from "../questions/utils";
import { cloneDeep } from "lodash";

export const submitResponse = async (form, responseData) => {
  try {
    const response = cloneDeep(responseData);
    response.comments = {};
    response.submittedAt = new Date();

    for (const question of form.questions) {
      if (question.type === FILE) {
        const section = form.sections.find(
          (section) => section.id === question.sectionId
        );

        const sectionLabels = getSectionLabels(
          section,
          form.sections,
          form.questions
        );

        for (const label of sectionLabels) {
          response.answers[question.id][label] = await uploadFiles(
            response.answers[question.id][label]
          );
        }
      }
    }

    const responsesRef = collection(db, "forms", form.id, "responses");
    const responseRef = doc(responsesRef);

    setDoc(responseRef, response);

    const formRef = doc(db, "forms", form.id);
    updateDoc(formRef, {
      responses: increment(1),
    });

    sendNotification({
      userId: form.author.id,
      message: `Alguien ha respondido tu encuesta "${form.title}"`,
      goto: `/forms/edit/${form.id}`,
    });

    form.collaborators.forEach((collaborator) => {
      sendNotification({
        userId: collaborator.id,
        message: `Alguien ha respondido la encuesta "${form.title}"`,
        goto: `/forms/edit/${form.id}`,
      });
    });

    return { responseId: responseRef.id };
  } catch (error) {
    console.log(responseData);
    console.log(error);
    return { error: { message: "Error al guardar las respuestas" } };
  }
};

export const getResponses = (formId, callback) => {
  const responsesRef = collection(db, "forms", formId, "responses");

  const q = query(responsesRef, orderBy("submittedAt"));

  return onSnapshot(q, (snapshot) => {
    const responses = snapshot.docs.map((doc) => {
      const response = doc.data();
      response.id = doc.id;
      response.submittedAt = response.submittedAt.toDate();
      return response;
    });

    callback(responses);
  });
};

export const checkUserHasResponses = async (formId, userId) => {
  try {
    const responsesRef = collection(db, "forms", formId, "responses");
    const q = query(responsesRef, where("user.id", "==", userId));

    const snapshot = await getDocs(q);

    return snapshot.docs.length > 0;
  } catch (error) {
    return true;
  }
};

export const addComment = (formId, responseId, comments) => {
  const responseRef = doc(db, "forms", formId, "responses", responseId);
  updateDoc(responseRef, { comments });
};

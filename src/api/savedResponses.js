import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getSavedResponse = async (formId, userId) => {
  const savedResponseRef = doc(db, "forms", formId, "savedResponses", userId);
  try {
    const savedResponse = await getDoc(savedResponseRef);

    if (!savedResponse.exists()) {
      return {};
    }

    const savedResponseData = savedResponse.data();

    return savedResponseData;
  } catch (error) {
    return {};
  }
};

export const saveResponse = async (formId, userId, response) => {
  const savedResponseRef = doc(db, "forms", formId, "savedResponses", userId);
  setDoc(savedResponseRef, response);
};

export const deleteSavedResponse = async (formId, userId) => {
  const savedResponseRef = doc(db, "forms", formId, "savedResponses", userId);
  deleteDoc(savedResponseRef);
};

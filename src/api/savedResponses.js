import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { db } from "./firebaseConfig";
import { convertAnswersAfterGet, convertAnswersBeforeSet } from "./utils";

export const getSavedResponse = async (formId, userId) => {
  const savedResponseRef = doc(db, "forms", formId, "savedResponses", userId);
  try {
    const savedResponse = await getDoc(savedResponseRef);

    if (!savedResponse.exists()) {
      return {
        answers: {},
        numberMap: {},
      };
    }

    const savedResponseData = savedResponse.data();

    convertAnswersAfterGet(savedResponseData.answers);

    return savedResponseData;
  } catch (error) {
    return {
      answers: {},
      numberMap: {},
    };
  }
};

export const saveResponse = async (formId, userId, response) => {
  const { answers, numberMap } = response;

  const clonedAnswers = cloneDeep(answers);

  convertAnswersBeforeSet(clonedAnswers);

  const savedResponseRef = doc(db, "forms", formId, "savedResponses", userId);
  setDoc(savedResponseRef, { answers: clonedAnswers, numberMap });
};

export const deleteSavedResponse = async (formId, userId) => {
  const savedResponseRef = doc(db, "forms", formId, "savedResponses", userId);
  deleteDoc(savedResponseRef);
};

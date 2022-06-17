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

export const createSection = (formId, section) => {
  const sectionsRef = collection(db, "forms", formId, "sections");
  const sectionRef = doc(sectionsRef);
  setDoc(sectionRef, section);

  return sectionRef.id;
};

export const getSectionsOnce = async (formId) => {
  const sectionsRef = collection(db, "forms", formId, "sections");

  const q = query(sectionsRef, orderBy("index"));

  const snapshot = await getDocs(q);

  const sections = snapshot.docs.map((doc) => {
    const section = doc.data();
    section.id = doc.id;

    return section;
  });

  return sections;
};

export const getSections = (formId, callback) => {
  const sectionsRef = collection(db, "forms", formId, "sections");

  const q = query(sectionsRef, orderBy("index"));

  return onSnapshot(q, (snapshot) => {
    const sections = snapshot.docs.map((doc) => {
      const section = doc.data();
      section.id = doc.id;
      return section;
    });

    callback(sections);
  });
};

export const getSectionsChanges = (formId, callback) => {
  const sectionsRef = collection(db, "forms", formId, "sections");

  const q = query(sectionsRef, orderBy("index"));

  return onSnapshot(q, (snapshot) => {
    const changes = snapshot.docChanges().map((change) => ({
      type: change.type,
      oldIndex: change.oldIndex,
      newIndex: change.newIndex,
      section: { ...change.doc.data(), id: change.doc.id },
    }));

    callback(changes);
  });
};

export const saveSection = (formId, section) => {
  const { id: sectionId, ...sectionData } = section;
  const sectionRef = doc(db, "forms", formId, "sections", sectionId);
  updateDoc(sectionRef, sectionData);
};

export const deleteSection = (formId, sectionId) => {
  const sectionRef = doc(db, "forms", formId, "sections", sectionId);
  deleteDoc(sectionRef);
};

import {
  addDoc,
  arrayUnion,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { defaultQuestion } from "../constants/questions";
import {
  getQuestionsOnce,
  insertQuestion,
  insertQuestionWithoutIncrement,
} from "./questions";
import { sendNotification } from "./notifications";

const formsRef = collection(db, "forms");

export const createForm = async (user) => {
  try {
    const formRef = await addDoc(formsRef, {
      author: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      title: "Encuesta sin título",
      description: "",
      createdAt: new Date(),
      questions: 0,
      responses: 0,
      collaborators: [],
      settings: {
        allowResponses: true,
        maxResponses: "",
        onlyOneResponse: false,
        startDate: null,
        endDate: null,
        randomOrder: false,
      },
    });

    insertQuestion(formRef.id, { ...defaultQuestion, index: 0 });

    return { form: formRef };
  } catch (error) {
    return { error: "Error al crear la encuesta" };
  }
};

export const duplicateForm = async (form, user) => {
  try {
    const { id, ...newForm } = form;

    newForm.author = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    newForm.title = `${form.title} - Copia`;
    newForm.createdAt = new Date();
    newForm.responses = 0;
    newForm.collaborators = [];

    const newFormRef = await addDoc(formsRef, newForm);

    const questions = await getQuestionsOnce(form.id);

    await Promise.all(
      questions.map((question) => {
        const { id, ...questionData } = question;
        return insertQuestionWithoutIncrement(newFormRef.id, questionData);
      })
    );

    return { newForm: newFormRef };
  } catch (error) {
    console.log(error);
    return { error: "Error al duplicar la encuesta" };
  }
};

export const getUserForms = (userId, callback) => {
  const q = query(formsRef, where("author.id", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
      if (form.settings.startDate) {
        form.settings.startDate = form.settings.startDate.toDate();
      }
      if (form.settings.endDate) {
        form.settings.endDate = form.settings.endDate.toDate();
      }
      return form;
    });

    callback(forms);
  });
};

export const getCollaborationForms = (user, callback) => {
  const collaborator = { id: user.id, email: user.email, name: user.name };
  const q = query(
    formsRef,
    where("collaborators", "array-contains", collaborator)
  );

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
      if (form.settings.startDate) {
        form.settings.startDate = form.settings.startDate.toDate();
      }
      if (form.settings.endDate) {
        form.settings.endDate = form.settings.endDate.toDate();
      }
      return form;
    });

    callback(forms);
  });
};

export const getFormOnce = async (formId) => {
  try {
    const formRef = doc(db, "forms", formId);

    const form = await getDoc(formRef);

    if (!form.exists()) {
      return null;
    }

    const formData = form.data();
    formData.id = form.id;
    formData.createdAt = formData.createdAt.toDate();
    if (form.settings.startDate) {
      form.settings.startDate = form.settings.startDate.toDate();
    }
    if (form.settings.endDate) {
      form.settings.endDate = form.settings.endDate.toDate();
    }

    const questions = await getQuestionsOnce(formId);

    formData.questions = questions;

    return formData;
  } catch (error) {
    return { error: { message: "Error al buscar la encuesta" } };
  }
};

export const getForm = (id, callback) => {
  const formRef = doc(db, "forms", id);

  return onSnapshot(formRef, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const form = doc.data();
    form.id = doc.id;
    form.createdAt = form.createdAt.toDate();
    if (form.settings.startDate) {
      form.settings.startDate = form.settings.startDate.toDate();
    }
    if (form.settings.endDate) {
      form.settings.endDate = form.settings.endDate.toDate();
    }
    callback(form);
  });
};

export const saveForm = async (form) => {
  try {
    const { id: formId, ...formData } = form;
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, formData);

    console.log(formData);

    return { form: formRef };
  } catch (error) {
    console.log(error);
    return { error: { message: "Error al guardar la encuesta" } };
  }
};

export const deleteForm = async (formId) => {
  try {
    const formRef = doc(db, "forms", formId);
    await deleteDoc(formRef);

    return { form: formRef };
  } catch (error) {
    return { error: { message: "Error al eliminar la encuesta" } };
  }
};

export const addCollaborator = async (form, collaboratorEmail) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", collaboratorEmail));
    const users = await getDocs(q);

    if (users.size === 0) {
      return { error: "El usuario no existe" };
    }

    const user = users.docs[0].data();
    user.id = users.docs[0].id;

    const collaborator = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const formRef = doc(db, "forms", form.id);

    await updateDoc(formRef, {
      collaborators: arrayUnion(collaborator),
    });

    sendNotification({
      userId: user.id,
      message: `Te han agregado como colaborador en la encuesta "${form.title}"`,
      goto: `/forms/edit/${form.id}`,
    });

    return { form: formRef };
  } catch (error) {
    return { error: { message: "Error al agregar el colaborador" } };
  }
};

export const deleteCollaborator = async (form, collaborator) => {
  try {
    const formRef = doc(db, "forms", form.id);

    await updateDoc(formRef, {
      collaborators: arrayRemove(collaborator),
    });

    sendNotification({
      userId: collaborator.id,
      message: `Te han eliminado como colaborador de la encuesta "${form.title}"`,
      goto: `/forms/edit/${form.id}`,
    });

    return { form: formRef };
  } catch (error) {
    return { error: { message: "Error al eliminar el colaborador" } };
  }
};

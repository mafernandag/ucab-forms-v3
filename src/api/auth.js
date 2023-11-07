import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { auth, db, messaging } from "./firebaseConfig";

const saveNotificationToken = (userId) => {
  getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
        const userDoc = doc(db, "users", userId);
        return updateDoc(userDoc, {
          token: currentToken,
        });
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const signUp = async ({ name, email, password }) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
    });

    saveNotificationToken(user.uid);

    return { ok: true };
  } catch (err) {
    let error;

    if (err.code === "auth/email-already-in-use") {
      error = "Ya existe un usuario con este email";
    } else {
      error = "Error desconocido";
    }

    return { ok: false, error };
  }
};

export const logIn = async ({ email, password }) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    saveNotificationToken(user.uid);

    return { ok: true };
  } catch (err) {
    let error;

    switch (err.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        error = "Email o contraseña incorrectos";
        break;
      case "auth/too-many-requests":
        error = "Cuenta bloqueada temporalmente";
        break;
      default:
        error = "Error desconocido";
        break;
    }

    return { ok: false, error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);

    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
};

import {
  addDoc,
  collection,
  doc,
  orderBy,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const sendNotification = async ({ userId, title, message, goto }) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");

    fetch("https://ucab-forms-server.herokuapp.com/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        message,
        userId,
      }),
    });

    const notificationRef = await addDoc(notificationsRef, {
      message,
      goto,
      createdAt: new Date(),
      read: false,
    });
    return { notification: notificationRef };
  } catch (error) {
    return { error: "Error al enviar la notificación" };
  }
};

export const getNotifications = (userId, callback) => {
  const notificationsRef = collection(db, "users", userId, "notifications");

  const q = query(notificationsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => {
      const notification = doc.data();
      notification.id = doc.id;
      return notification;
    });

    callback(notifications);
  });
};

export const readNotifications = async (userId, notifications) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");

    await Promise.all(
      notifications.map((notification) => {
        if (!notification.read) {
          const notificationRef = doc(notificationsRef, notification.id);
          return updateDoc(notificationRef, { read: true });
        }

        return null;
      })
    );

    return { notifications };
  } catch (error) {
    return { error: "Error al leer las notificaciones" };
  }
};

importScripts(
  "https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDtlUu106nYVnNnCI50MSSthYmuLKcwJGY",
  authDomain: "ucab-forms-dev.firebaseapp.com",
  projectId: "ucab-forms-dev",
  storageBucket: "ucab-forms-dev.appspot.com",
  messagingSenderId: "1035957176372",
  appId: "1:1035957176372:web:ef699d5a52f4e02f622261",
  measurementId: "G-MSKK09SJ8P",
});

const messaging = firebase.messaging();
const auth = firebase.auth();
const firestore = firebase.firestore();

messaging.onBackgroundMessage((payload) => {
  if (auth.currentUser?.uid !== payload.data.userId) {
    firestore.collection("users").doc(payload.data.userId).update({
      token: null,
    });

    return;
  }

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/logo512.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

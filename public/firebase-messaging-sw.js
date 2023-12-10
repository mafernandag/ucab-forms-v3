importScripts(
  "https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js"
);
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore-compat.js"
// );
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAiTuFRUFOrQ6tyLHtDyj5eXT96wpT19s0",
  authDomain: "ucab-forms-v3.firebaseapp.com",
  projectId: "ucab-forms-v3",
  storageBucket: "ucab-forms-v3.appspot.com",
  messagingSenderId: "191442641046",
  appId: "1:191442641046:web:d23278aa9142c1fe0ee2b7",
  measurementId: "G-PDQVCRS5R6",
});

const messaging = firebase.messaging();
// const auth = firebase.auth();
// const firestore = firebase.firestore();

messaging.onBackgroundMessage((payload) => {
  // if (auth.currentUser?.uid !== payload.data.userId) {
  //   firestore.collection("users").doc(payload.data.userId).update({
  //     token: null,
  //   });

  //   return;
  // }

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/logo512.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

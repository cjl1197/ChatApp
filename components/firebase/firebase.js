// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import 'firebase/compat/auth';
import { getStorage, ref } from "firebase/storage";
import { useCollectionData } from 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACqQ24i94Rlcb5ZwJrHARAS7hf3TESQaI",
  authDomain: "chat-app-afc66.firebaseapp.com",
  projectId: "chat-app-afc66",
  storageBucket: "chat-app-afc66.appspot.com",
  messagingSenderId: "388549446792",
  appId: "1:388549446792:web:825bcc0095d03a552f633d"
};

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();
}

const auth = firebase.auth();

const storage = getStorage(app);

export { auth, firebase, storage };

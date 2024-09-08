// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDsMka1kQMKOdxXdimJUSdQzEjeTr-k2_w",
  authDomain: "albergue-57e14.firebaseapp.com",
  projectId: "albergue-57e14",
  storageBucket: "albergue-57e14.appspot.com",
  messagingSenderId: "302261908325",
  appId: "1:302261908325:web:5b9d239b0abb6f3cbb278c",
  measurementId: "G-JB8QBN37KK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
export const firebaseDataBase = getDatabase(app);
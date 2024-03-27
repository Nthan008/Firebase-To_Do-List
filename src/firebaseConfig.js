// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase Auth
const firebaseConfig = {
    apiKey: "AIzaSyD7fAF3n-Y1KaqhuUgNcrdkA5Qb1FjijaQ",
    authDomain: "to-do-list-bfb4d.firebaseapp.com",
    projectId: "to-do-list-bfb4d",
    storageBucket: "to-do-list-bfb4d.appspot.com",
    messagingSenderId: "219107569433",
    appId: "1:219107569433:web:84ca29cfe2be6ff4399f88",
    measurementId: "G-P5F64NY7ZB"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Initialize Firebase


export { app, auth, db };
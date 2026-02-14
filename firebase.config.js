
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyUO4mD8J2yKH5BgsuqOsfsNm1_Q63lGE",
    authDomain: "quiz-app-6d3bc.firebaseapp.com",
    databaseURL: "https://quiz-app-6d3bc-default-rtdb.firebaseio.com",
    projectId: "quiz-app-6d3bc",
    storageBucket: "quiz-app-6d3bc.firebasestorage.app",
    messagingSenderId: "945559150431",
    appId: "1:945559150431:web:2bb3a47539ff90589c20ea",
    measurementId: "G-3BP1W6WF8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Export instances to use in script.js
export { auth, db };

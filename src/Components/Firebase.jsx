// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpArPZJu9RPK4iYATESJjEm7edZPG4gTY",
    authDomain: "edugenius-acfa6.firebaseapp.com",
    projectId: "edugenius-acfa6",
    storageBucket: "edugenius-acfa6.firebasestorage.app",
    messagingSenderId: "32746920637",
    appId: "1:32746920637:web:949c482137e4f9e2b435d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get auth instance - persistence will be set in the useAuth hook
const auth = getAuth();

export { auth };
export default app;
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "authontication-76d77.firebaseapp.com",
    projectId: "authontication-76d77",
    storageBucket: "authontication-76d77.appspot.com",
    messagingSenderId: "938046675943",
    appId: "1:938046675943:web:d058623e5adfa58a74bb42",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

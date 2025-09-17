import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firestore from "firebase/firestore";

// --- IMPORTANT ---
// Replace the placeholder values below with your actual Firebase project credentials.
// You can find these in your Firebase project settings under "General".
//
// After adding your credentials, make sure to go to the Firebase console:
// Authentication -> Settings -> Authorized domains -> Add your app's domain (e.g., localhost).
const firebaseConfig = {
  apiKey: "AIzaSyAfPXXrAB3kb62LO4QZ6bpN6T3KGY7cyYc",
  authDomain: "rewise-ai.firebaseapp.com",
  projectId: "rewise-ai",
  storageBucket: "rewise-ai.firebasestorage.app",
  messagingSenderId: "806466703406",
  appId: "1:806466703406:web:cd31680b0e40b2e3d4cfbf",
  measurementId: "G-2EYSKEKJ65"
};

// Initialize Firebase
// FIX: Using namespace import to resolve potential module resolution issue.
const app = firebaseApp.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebaseAuth.getAuth(app);
const db = firestore.getFirestore(app);

export { auth, db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAWMVC_9u23gIlBAo0VxXdFqYnMvJtxrk",
  authDomain: "ripple-factor.firebaseapp.com",
  projectId: "ripple-factor",
  storageBucket: "ripple-factor.firebasestorage.app",
  messagingSenderId: "329870371959",
  appId: "1:329870371959:web:609fc3783a369e096e6a72",
  measurementId: "G-JJ11MG9QXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export the app instance for other services
export default app;
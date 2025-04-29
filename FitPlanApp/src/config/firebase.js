import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyA0H-txLmMXEfV5UqA2R_VOFFgzTjbbvhg",
  authDomain: "fitplan-1b4d9.firebaseapp.com",
  projectId: "fitplan-1b4d9",
  storageBucket: "fitplan-1b4d9.firebasestorage.app",
  messagingSenderId: "220185779770",
  appId: "1:220185779770:web:0336e1ee156cb34b851f03",
  measurementId: "G-H2MRB383Z9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Cloud Functions
export const generateWorkout = httpsCallable(functions, 'generateWorkout'); 
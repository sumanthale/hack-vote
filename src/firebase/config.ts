// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB84-HPNeoUCb-mmHDzuXY9PtpjZBgIzu8",
  authDomain: "crested-century-457201-a8.firebaseapp.com",
  projectId: "crested-century-457201-a8",
  storageBucket: "crested-century-457201-a8.firebasestorage.app",
  messagingSenderId: "812127839181",
  appId: "1:812127839181:web:b8e5d472c2dedfd5e19a84",
  measurementId: "G-8LG4CPC96S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
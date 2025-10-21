import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase (REEMPLAZA con la tuya)
const firebaseConfig = {

  apiKey: "AIzaSyCJYTKDgYRFPdBXAAgES5NnHsVfNJLBVEo",

  authDomain: "green-and-blue-ind.firebaseapp.com",

  projectId: "green-and-blue-ind",

  storageBucket: "green-and-blue-ind.firebasestorage.app",

  messagingSenderId: "700915633331",

  appId: "1:700915633331:web:7c140cc5aed92d2456b4c6"

};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);
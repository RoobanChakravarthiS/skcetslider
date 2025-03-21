// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBaXiOVv2R6BHLj6_Mmod5jkKc_vy0H07Y",
    authDomain: "skcet-b5731.firebaseapp.com",
    projectId: "skcet-b5731",
    storageBucket: "skcet-b5731.firebasestorage.app",
    messagingSenderId: "552442451514",
    appId: "1:552442451514:web:6f34a104567b158fe7c703",
    measurementId: "G-D8PCG1E71L"
  };

// Initialize Firebase
 const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const database = getDatabase(app);
 import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQCuUWyQpeKxwz7cWzQVg87iZcrmcQclc",
  authDomain: "instagram-50fd3.firebaseapp.com",
  projectId: "instagram-50fd3",
   storageBucket: "instagram-50fd3.appspot.com",
  messagingSenderId: "1002235608843",
  appId: "1:1002235608843:web:59f467fda562142ef2ac0e",
  measurementId: "G-B7MSYY5T24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // ✅ This is important for login/logout functionality

// Export the services you use
export { app, db, storage, auth };

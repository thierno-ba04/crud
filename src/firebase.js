import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmyHVIdZRklZEvdotZBbAZy965kkXSEzo",
  authDomain: "crud-app-b11f1.firebaseapp.com",
  projectId: "crud-app-b11f1",
  storageBucket: "crud-app-b11f1.appspot.com",
  messagingSenderId: "643582293677",
  appId: "1:643582293677:web:51ba334575d1f64c90b824"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fireDb = getFirestore(app);
export const storage = getStorage();

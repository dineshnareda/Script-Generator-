import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyoUVC-PNVK3ZHZ1cNJFI-VL8B0ouoFG8",
  authDomain: "script-generator-91bc4.firebaseapp.com",
  projectId: "script-generator-91bc4",
  storageBucket: "script-generator-91bc4.firebasestorage.app",
  messagingSenderId: "255369429235",
  appId: "1:255369429235:web:e62d4d7f3eb8509cd8b786"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

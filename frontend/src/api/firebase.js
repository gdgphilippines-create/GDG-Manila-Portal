import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD5DhxFi0aYcBfBETJs01iej5oCt3Plg0",
  authDomain: "gdg-pwa-490106.firebaseapp.com",
  projectId: "gdg-pwa-490106",
  storageBucket: "gdg-pwa-490106.appspot.com",
  messagingSenderId: "675823567076",
  appId: "1:675823567076:web:eb39057131aec579f1ecf1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

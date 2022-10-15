import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZAposoVvtUSxItCeBNoeJh6Z4JHPpleQ",
  authDomain: "aquafong-d95f2.firebaseapp.com",
  projectId: "aquafong-d95f2",
  storageBucket: "aquafong-d95f2.appspot.com",
  messagingSenderId: "139688848239",
  appId: "1:139688848239:web:c38dc3cd72fb9d452cd69a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

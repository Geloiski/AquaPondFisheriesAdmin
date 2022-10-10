import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbGigaBuuBEprtW-yMHwJ716q6wEe1xvw",
  authDomain: "aquafongdbms.firebaseapp.com",
  projectId: "aquafongdbms",
  storageBucket: "aquafongdbms.appspot.com",
  messagingSenderId: "213082344237",
  appId: "1:213082344237:web:20abb9ccbef9eb89ee61a4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

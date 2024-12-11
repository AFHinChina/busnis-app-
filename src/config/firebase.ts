import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBWZCsDoLTaG9z49odFfv4wmFSaL7lAgO8",
  authDomain: "saddam-china.firebaseapp.com",
  projectId: "saddam-china",
  storageBucket: "saddam-china.firebasestorage.app",
  messagingSenderId: "614566489623",
  appId: "1:614566489623:web:131adc521af2325d2ff652",
  measurementId: "G-9QTE0DHF84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});

// Initialize other services
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;
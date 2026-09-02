import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyANB1a1tWM56VxOzrOXBKKdwxBzyBmzNY0",
  authDomain: "quixotic-rush-49brs.firebaseapp.com",
  projectId: "quixotic-rush-49brs",
  storageBucket: "quixotic-rush-49brs.firebasestorage.app",
  messagingSenderId: "649867406748",
  appId: "1:649867406748:web:a1560aac780cd0f3156c59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with long polling to fix "Could not reach Cloud Firestore backend" in preview
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-56c59421-80c5-4775-b05a-b3322e379451");

export const storage = getStorage(app);

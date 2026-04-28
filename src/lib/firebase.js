import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCWMV0ZdNdvnCmRo56RoR9e92_niyvo5jM",
  authDomain: "wildlife-hotspot-mapper.firebaseapp.com",
  projectId: "wildlife-hotspot-mapper",
  storageBucket: "wildlife-hotspot-mapper.firebasestorage.app",
  messagingSenderId: "923736940746",
  appId: "1:923736940746:web:1f0a6b79bef10c08f39433",
  measurementId: "G-KN9YWCH88G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Only initialize analytics in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, storage, analytics };

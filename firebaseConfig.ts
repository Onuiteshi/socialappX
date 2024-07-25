// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA0C5v2OGRO_0ZVPB_8yAGwgA3Iowun7ew",
    authDomain: "socialappx-8c946.firebaseapp.com",
    projectId: "socialappx-8c946",
    storageBucket: "socialappx-8c946.appspot.com",
    messagingSenderId: "123952499880",
    appId: "1:123952499880:web:47a9e5e41095332e2d469d",
    measurementId: "G-XVSV236LVC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


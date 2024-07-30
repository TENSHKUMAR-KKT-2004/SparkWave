import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAh_b2W5MBXNBGBA_QHhlqi_rZyYskBG5c",
    authDomain: "sparkwave-25240.firebaseapp.com",
    projectId: "sparkwave-25240",
    storageBucket: "sparkwave-25240.appspot.com",
    messagingSenderId: "1012181283508",
    appId: "1:1012181283508:web:255b52d8a6933962759de1",
    measurementId: "G-49BB7TM5MB"
};

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
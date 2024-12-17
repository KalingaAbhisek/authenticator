import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged,signInWithRedirect,  signInWithPopup, signOut, signInWithCredential } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcMCYk8bkkKFwBdNwUdCfjwSegS3BK9Os",
    authDomain: "totp-authenticator-1.firebaseapp.com",
    databaseURL: "https://totp-authenticator-1-default-rtdb.firebaseio.com",
    projectId: "totp-authenticator-1",
    storageBucket: "totp-authenticator-1.appspot.com",
    messagingSenderId: "537289145594",
    appId: "1:537289145594:web:ced7ab1f58d9aa61555d43",
    measurementId: "G-1TVEQ1XTPJ"
};


// const AUTO_LOGOUT_TIME = 3600000;

// function updateLastActivity() {
//     const currentTime = new Date().getTime();
//     sessionStorage.setItem('lastActivity', currentTime);
// }

// function checkInactivity() {
//     const lastActivity = sessionStorage.getItem('lastActivity');
//     if (lastActivity) {
//       const currentTime = new Date().getTime();
//       const timeDifference = currentTime - lastActivity;
      
//       // If the user has been inactive for more than 1 hour
//       if (timeDifference > AUTO_LOGOUT_TIME) {
//         logOut();
//       }
//     }
// }

// const logOut = () => {
//     signOut(auth).then(() => {
//         console.log("User signed out");
//         sessionStorage.clear();
//     }).catch((error) => {
//         console.error("Error signing out: ", error);
//     });
// }

// function resetInactivityTimer() {
//     updateLastActivity();
//     clearTimeout(window.inactivityTimeout);
//     window.inactivityTimeout = setTimeout(logOut, AUTO_LOGOUT_TIME);
// }

// ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'].forEach(event => {
//     window.addEventListener(event, resetInactivityTimer);
// });

// updateLastActivity();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// updateLastActivity();
// setInterval(checkInactivity, 60000);
export { auth, provider, signInWithPopup, signInWithRedirect, signOut,onAuthStateChanged, signInWithCredential, db, doc, setDoc };

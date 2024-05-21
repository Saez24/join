// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrm2QShTbbwiC0gpPDPP2LfdkdwQTZ5MI",
    authDomain: "remotestorage-b0ea0.firebaseapp.com",
    databaseURL: "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "remotestorage-b0ea0",
    storageBucket: "remotestorage-b0ea0.appspot.com",
    messagingSenderId: "997644324716",
    appId: "1:997644324716:web:641faa74f9c4ddd39f2d49"
};
// Initialize Firebase
let app = initializeApp(firebaseConfig);
const auth = getAuth();
const user = auth.currentUser;
let logout = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        console.log(email);
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
    }
});
logout.addEventListener('click', function (event) {
    event.preventDefault()

    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = "index.html"
    }).catch((error) => {
        // An error happened.
    });

});

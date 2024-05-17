// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
let auth = getAuth();



login.addEventListener('click', function (event) {
    event.preventDefault()
    let login = document.getElementById("signup");
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmpassword").value;
    let privacyCheckbox = document.getElementById("checkbox-privacy");

    // Überprüfung, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
        alert("Die Passwörter stimmen nicht überein.");
        return; // Beenden Sie die Funktion, falls die Passwörter nicht übereinstimmen
    }
    // Überprüfung, ob das Kontrollkästchen für die Datenschutzbestimmungen aktiviert ist
    if (!privacyCheckbox.checked) {
        alert("Bitte akzeptieren Sie die Datenschutzbestimmungen.");
        return; // Beenden Sie die Funktion, falls das Kontrollkästchen nicht aktiviert ist
    }
    createUserWithEmailAndPassword(auth, email, password, confirmPassword)
        .then((userCredential) => {
            window.location.href = "summary.html"
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage)
        });
})
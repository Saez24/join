// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
let guestLogin = document.getElementById("guest-login");
let login = document.getElementById("login");
let errorContainer = document.getElementById('error');
let errorInput = document.getElementById('password')

login.addEventListener('click', function (event) {
    event.preventDefault()

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "summary.html"
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            errorContainer.style.display = 'block';
            errorInput.style.borderColor = '#ff8190';
        });
});

guestLogin.addEventListener('click', function (event) {
    event.preventDefault()

    signInAnonymously(auth)
        .then(() => {
            window.location.href = "summary.html"
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
        });
});

function loadPasswordImage() {
    let passwordImage = document.getElementById('password');
    passwordImage.style.backgroundImage = 'url(../assets/img/lock.png)';
};

window.loadPasswordImage = loadPasswordImage;

function showPasswordImage() {
    let passwordImage = document.getElementById('password');
    passwordImage.style.backgroundImage = 'url(../assets/img/visibility.png)';
};

window.showPasswordImage = showPasswordImage;

function hidePasswordImage() {
    let passwordImage = document.getElementById('password');
    passwordImage.style.backgroundImage = 'url(../assets/img/visibility_off.png)';
};

window.hidePasswordImage = hidePasswordImage;

function showPassword() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
};

window.showPassword = showPassword;

function hidePassword() {
    let x = document.getElementById("password");
    x.type = "password";
};

window.hidePassword = hidePassword;

function handleShowpasswordClick(event) {
    let input = document.getElementById("password");
    let clickX = event.clientX;
    let inputRight = input.getBoundingClientRect().right;
    if (clickX >= inputRight - 16) {
        showPassword();
    }
};

window.handleShowpasswordClick = handleShowpasswordClick;


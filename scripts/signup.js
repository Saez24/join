const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/";

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
let signup = document.getElementById("signup");
let errorContainer = document.getElementById('error-message');

/**
 * Validates that the password and confirm password fields match.
 * 
 * @param {string} password - The password entered by the user.
 * @param {string} confirmPassword - The confirmation password entered by the user.
 * @param {HTMLElement} errorContainer - The container to display error messages.
 * @returns {boolean} - Returns true if passwords match, otherwise false.
 */
function validatePasswords(password, confirmPassword, errorContainer) {
    if (password !== confirmPassword) {
        errorContainer.innerHTML = 'The passwords do not match.';
        errorContainer.style.display = 'block';
        return false;
    }
    return true;
};

/**
 * Validates that the name field contains both first and last name.
 * 
 * @param {string} name - The name entered by the user.
 * @param {HTMLElement} errorContainer - The container to display error messages.
 * @returns {boolean} - Returns true if the name contains at least two words, otherwise false.
 */
function validateName(name, errorContainer) {
    if (name.split(' ').length < 2) {
        errorContainer.innerHTML = 'Please enter your first and last name.';
        errorContainer.style.display = 'block';
        return false;
    }
    return true;
};

function validateEmail(email, errorContainer) {
    if (email.length < 2) {
        errorContainer.innerHTML = 'Please enter your email.';
        errorContainer.style.display = 'block';
        return false;
    }
    return true;
};

/**
 * Handles the form submission by creating a new user with email and password.
 * 
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 * @param {HTMLElement} errorContainer - The container to display error messages.
 */
function handleFormSubmission(email, password, errorContainer) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            handleSubmit();
            window.location.href = "add_task.html";
        })
        .catch((error) => {

        });
};

/**
 * Validates that the privacy policy checkbox is checked.
 * 
 * @param {HTMLElement} privacyCheckbox - The privacy policy checkbox element.
 * @param {HTMLElement} errorContainer - The container to display error messages.
 * @returns {boolean} - Returns true if the checkbox is checked, otherwise false.
 */
function validatePrivacyCheckbox(privacyCheckbox, errorContainer) {
    if (!privacyCheckbox.checked) {
        errorContainer.innerHTML = 'Please accept the privacy policy.';
        errorContainer.style.display = 'block';
        return false;
    }
    return true;
};

/**
 * Main event listener for handling the form submission process.
 * 
 * @param {Event} event - The event object.
 */
signup.addEventListener('click', function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmpassword").value;
    let privacyCheckbox = document.getElementById("checkbox-privacy");
    let nameValue = document.getElementById('name').value.trim();

    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';
    if (!validateName(nameValue, errorContainer)) return;
    if (validateEmail(email, errorContainer)) return;
    if (!validatePasswords(password, confirmPassword, errorContainer)) return;
    if (!validatePrivacyCheckbox(privacyCheckbox, errorContainer)) return;

    handleFormSubmission(email, password, errorContainer);
});

/**
 * Sends data to the specified path.
 * 
 * @param {string} path - The path to which the data should be sent.
 * @param {Object} data - The data to be sent.
 * @returns {Promise<Object>} - The server's response as JSON.
 */
async function postData(path = "names", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        let responseToJson = await response.json();
        return responseToJson;
    } catch (error) {
        console.error("Error sending data:", error);
    }
};

/**
 * Adds a new name to the array under "names" and sends the data to the server.
 * @param {Object} newName - The new name object to be added.
 */
async function addName(newName) {
    try {
        let result = await postData('names', newName);
        console.log("New name successfully added:", result);
    } catch (error) {
        console.error("Error adding the new name:", error);
    }
};

/**
 * Handles the submission of the form.
 * 
 * This function reads values from the input fields, creates a new name object,
 * and adds it using the addName function.
 */
function handleSubmit() {

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;

    let newName = {
        name: name,
        email: email,
    };

    addName(newName);
};
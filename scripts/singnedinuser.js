const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/"

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let firebaseConfig = {
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
let user = auth.currentUser;

/**
 * Fetches user data based on the provided email address and renders the user's name.
 * @param {string} email - The email address of the user.
 * @returns {Promise<void>}
 */
async function fetchUserData(email) {
    try {
        let response = await fetch(BASE_URL + ".json");
        let data = await response.json();
        let userNameData = findNameByEmail(data.names, email);
        if (userNameData) {
            console.log('User name:', userNameData.name);
            renderUserName(userNameData.name);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

/**
 * Finds a user's name based on their email address.
 * @param {Object} names - The object containing user data.
 * @param {string} email - The email address to search for.
 * @returns {Object|null} The user's data if found, otherwise null.
 */
function findNameByEmail(names, email) {
    for (let key in names) {
        if (names[key].email === email) {
            return names[key];
        }
    }
    return null;
};

/**
 * Renders the user's name in the DOM.
 * @param {string|null} name - The user's name. If null, displays 'GS'.
 */
function renderUserName(name) {
    let userHTML = generateNameUserblock(name);
    renderNameToUserblock(userHTML);
};

/**
 * Renders the generated HTML for the user's name to the user block element.
 * @param {string} userHTML - The HTML string representing the user's name.
 */
function renderNameToUserblock(userHTML) {
    let userBlock = document.getElementById("userblock");
    userBlock.innerHTML = userHTML;
};

/**
 * Generates HTML for displaying the user's initials.
 * @param {string|null} name - The user's name. If null, displays 'GS'.
 * @returns {string} The generated HTML string.
 */
function generateNameUserblock(name) {
    let firstInitial, lastInitial;
    if (name) {
        let nameParts = name.split(' ');
        firstInitial = nameParts[0].charAt(0).toUpperCase();
        lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    } else {
        firstInitial = 'G';
        lastInitial = '';
    }
    return /*html*/ `
        <button class="shortname"><h4 id="fullname" style="display: none;">${name}</h4><h2>${firstInitial}${lastInitial}</h2></button>
    `;
};

window.generateNameUserblock = generateNameUserblock;

/**
 * Monitors Firebase authentication state changes and fetches user data if a user is signed in.
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        let email = user.email;
        console.log('User email:', email);
        fetchUserData(email);
    } else {
        console.log('No user is signed in.');
        renderUserName(null); // Display 'GS' if no user is signed in
    }
});

/**
 * Logs out the current user and redirects to the index page.
 * @returns {Promise<void>}
 */
function handleLogout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = "index.html";
    }).catch((error) => {
        // An error happened.
        console.error('Error during sign out:', error);
    });
};

window.handleLogout = handleLogout;
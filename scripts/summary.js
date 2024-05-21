const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/"

let amountTaskToDos = "";
let amountTaskDone = "";
let amountTaskUrgent = "";
let amountTasksInBoard = 0;
let amountTasksInProgress = "";
let amountTasksAwaitingFeedback = "";

let upcomingDeadline = "";

let signedInUser = "";


/** Fetches the data from firebase database from const "BASE_URL". This function can be given a certian path="" as parameter. For instance loadData('/tasks') explicity returns the sub-category "tasks" from the database.*/
async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();
    return responseToJson;
}

/** Updates the global variable "amountTasksInBoard", which will later be required to render the summary html page. */
async function determineTasksInBoard() {
    let responseToJson = await loadData('/tasks');
    amountTasksInBoard = responseToJson.length;
}




/** Checks if the user has been visited the summary page during log-in. If so, the local storage key "greet" will be set to "no" and the good morning message will not be displayed. */
function checkGreeting() {
    let greeter = document.getElementById("fade-out");
    if (localStorage.getItem('greet') === null) {
        summaryFadeOut();
        localStorage.setItem('greet', 'no');
    } else {
        // Disable CSS transitions temporarily
        greeter.style.transition = "none";
        // Hide the element immediately
        greeter.classList.add("d-none");
        // Enable CSS transitions after a short delay
        setTimeout(function () {
            greeter.style.transition = "";
        }, 100);
        // greeter.classList.add("d-none");
    }
}


/** Removes the key "greet" out of local storage. This function gets called when the user logs out. */
function removeGreetingKey() {
    localStorage.removeItem('greet');
}


/** Adds the class "fade-out" to the Good Morning div-container, which makes the container fade-out after two seconds. */
function summaryFadeOut() {
    let greeter = document.getElementById("fade-out");
    setTimeout(function () {
        greeter.classList.add("fade-out");
        setTimeout(function () {
            greeter.classList.add("d-none");
        }, 800);
    }, 2000);
}
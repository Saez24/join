// TO DO
// 1. Globale Variabel signedInUser deklarieren mit Alex. Siehe var "user" from scripts/singnedinuser.js let user = auth.currentUser? Anschließend Render-Funktion schreiben mit var "signedInUser".
// 2. Amount TasksToDo, TasksDone, TasksInProgress, TasksAwaitingFeedback aus einem Array abgreifen (mit Sarah abstimmen) und Zaehler-Funktion schreiben.


const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/"

let amountTasksToDos = "?";
let amountTasksDone = "?"; //Punkt 2
let amountTasksUrgent = 0;
let amountTasksInBoard = 0;
let amountTasksInProgress = "?"; //Punkt 2
let amountTasksAwaitingFeedback = "?"; //Punkt 2

let earliestDeadline = null;

let summarySignedInUser = "Guest"; // Siehe Punkt 1.


async function initializeSummary() {
    await determineTasksInBoard();
    await determineUrgentTasks();
    await determineDeadline();
    checkGreeting();
    renderSummary();
}


/** 
 * Fetches the data from firebase database which represents the const "BASE_URL". 
 * This function can be given a certian path="" as parameter. 
 * For instance loadData('/tasks') explicity returns the sub-category "tasks" from the database.
 * */
async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();
    return responseToJson;
}


/** 
 * Updates the global variable "amountTasksInBoard", which will later be required to render the summary html page. 
 * */
async function determineTasksInBoard() {
    let responseToJson = await loadData('tasks');
    amountTasksInBoard = responseToJson.length;
}


/** 
 * Counts all urgent tasks and updates the global variable "amountTaskUrgent", 
 * which will later be required to render the summary html page. 
 * */
async function determineUrgentTasks() {
    let responseToJson = await loadData('tasks');
    for (let i = 0; i < responseToJson.length; i++) {
        if (responseToJson[i].prio === "urgent") {
            amountTasksUrgent++;
        }
    }
}


/** 
 * Determines the earliest deadline of all urgent tasks. 
 * 
 * Per default this function sets the global variable "earliestDeadline" to "null" in order to avoid an error when sorting 
 * the date values from earliest to latest. 
 * 
 * If the global variale "earliestDeadline" remains "null" after fully iterating the for-loop to it's end, 
 * the "earliestDeadline" will indicate, that no urgent tasks exist and thus no urgent deadline exists. Otherwise, the "earliestDeadline"
 * will be formatted to an US-Date string.  
 * */
async function determineDeadline() {
    earliestDeadline = null;
    let responseToJson = await loadData('tasks');

    for (let i = 0; i < responseToJson.length; i++) {
        if (responseToJson[i].prio === "urgent") {
            let taskDueDate = new Date(responseToJson[i].duedate);

            if (earliestDeadline === null || taskDueDate < earliestDeadline) {
                earliestDeadline = taskDueDate;
            }
        }
    }

    if (earliestDeadline === null) {
        earliestDeadline = "No urgent deadlines";
    } else {
        earliestDeadline = earliestDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}


/** Checks if the user has been visited the summary page during log-in. 
 *  If so, the local storage key "greet" will be set to "no" and the good morning message will not be 
 *  displayed again when the user re-visits the summary page. */
function checkGreeting() {
    let greeter = document.getElementById("fade-out");
    if (localStorage.getItem('greet') === null) {
        summaryFadeOut();
        localStorage.setItem('greet', 'no');
    } else {
        greeter.style.transition = "none"; // Disable CSS transitions temporarily
        greeter.classList.add("d-none"); // Hide the element immediately
        setTimeout(function () { // Enables CSS transitions again after a short delay
            greeter.style.transition = "";
        }, 100);
    }
}


/** Removes the key "greet" out of local storage. This function gets called when the user logs out.
 *  This function exists to assure that the welcome message gets triggered once the user logs in again.
 */
function removeGreetingKey() {
    localStorage.removeItem('greet');
}


/** Adds the class "fade-out" to the Good Morning div-container, which makes the container fade-out after two seconds. 
 * This function gets called during the "checkGreeting" function. 
 * */
function summaryFadeOut() {
    let greeter = document.getElementById("fade-out");
    setTimeout(function () {
        greeter.classList.add("fade-out");
        setTimeout(function () {
            greeter.classList.add("d-none");
        }, 800);
    }, 2000);
}

function renderSummary() {
    document.getElementById('summaryToDos').innerHTML = amountTasksToDos;
    document.getElementById('summaryDone').innerHTML = amountTasksDone;
    document.getElementById('summaryUrgent').innerHTML = amountTasksUrgent;
    document.getElementById('summaryDeadline').innerHTML = earliestDeadline;
    document.getElementById('summaryTasksInBoard').innerHTML = amountTasksInBoard;
    document.getElementById('summaryTasksInProgress').innerHTML = amountTasksInProgress;
    document.getElementById('summaryAwaitingFeedback').innerHTML = amountTasksAwaitingFeedback;
    document.getElementById('summaryUserName').innerHTML = summarySignedInUser;
    document.getElementById('summaryUserNameResponsive').innerHTML = summarySignedInUser;
}



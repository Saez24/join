const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/"

let amountTaskToDos = 0;
let amountTaskDone = "";
let amountTaskUrgent = 0;
let amountTasksInBoard = 0;
let amountTasksInProgress = "";
let amountTasksAwaitingFeedback = "";

let earliestDeadline = null;

let signedInUser = "";


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
    let responseToJson = await loadData('/tasks');
    amountTasksInBoard = responseToJson.length;
}


/** 
 * Counts all urgent tasks and updates the global variable "amountTaskUrgent", 
 * which will later be required to render the summary html page. 
 * */
async function determineUrgentTasks() {
    let responseToJson = await loadData('/tasks');
    for (let i = 0; i < responseToJson.length; i++) {
        if (responseToJson[i].prio === "urgent") {
            amountTaskUrgent++;
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
    let responseToJson = await loadData('/tasks');

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
        // Disable CSS transitions temporarily
        greeter.style.transition = "none";
        // Hide the element immediately
        greeter.classList.add("d-none");
        // Enable CSS transitions after a short delay
        setTimeout(function () {
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
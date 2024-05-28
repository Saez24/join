/**
 * Creates a new task based on user input and sends it to the server.
 */
async function createTask() {
    let taskDetails = getTaskDetails();

    if (!validateTaskDetails(taskDetails)) return;
    let assignedTo = getAssignedTo();
    let subtasks = getSubtasks();
    let taskData = {
        ...taskDetails,
        assignto: assignedTo,
        subtask: subtasks,
        status: 'todo'
    };

    await postData("tasks", taskData);
    clearContent();
    window.location.href = "board.html";
};

/**
 * Retrieves task details from user input fields.
 * @returns {Object} An object containing task details.
 */
function getTaskDetails() {
    return {
        title: document.getElementById('tasktitle').value,
        description: document.getElementById('description').value,
        duedate: document.getElementById('duedate').value,
        category: document.getElementById('taskcategoryinput').value,
        prio: activeButton ? activeButton.id : null
    };
};

/**
 * Validates task details.
 * @param {Object} taskDetails - An object containing task details.
 * @returns {boolean} Returns true if task details are valid, otherwise false.
 */
function validateTaskDetails(taskDetails) {
    if (!taskDetails.title || !taskDetails.duedate || !taskDetails.category) {
        alert("Please fill out all required fields and select a priority.");
        return false;
    }
    return true;
};

/**
 * Retrieves assigned users based on checkbox selection.
 * @returns {string[]} An array of assigned users.
 */
function getAssignedTo() {
    let assignedToCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="assignedto_"]:checked');
    let assignedTo = [];
    assignedToCheckboxes.forEach((checkbox) => {
        let idParts = checkbox.id.split('_');
        let nameSpan = document.getElementById(`assignname_${idParts[1]}_${idParts[2]}`);
        if (nameSpan) {
            assignedTo.push(nameSpan.innerText.trim());
        }
    });
    return assignedTo;
};

/**
 * Retrieves subtasks from the user interface.
 * @returns {string[]} An array of subtasks.
 */
function getSubtasks() {
    let subtasksElements = document.querySelectorAll('.addedtask span');
    let subtasks = [];
    subtasksElements.forEach((subtask) => {
        subtasks.push(subtask.innerText);
    });
    return subtasks;
};

/**
 * Sends task data to the server.
 * @param {string} path - The path to send the task data to.
 * @param {Object} data - The task data to be sent.
 * @returns {Promise<void>} A promise that resolves once the data is sent.
 */
async function postData(path = "tasks", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await response.json();
};
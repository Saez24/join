let priorityImages = {
    urgent: './assets/img/prio_alta.png',
    medium: './assets/img/prio_media.png',
    low: './assets/img/prio_baja.png'
};

let taskIdCounter = 0;

/**
 * Opens the dialog by removing the 'd_none' class and ensures CSS and content are loaded.
 */
function openDialog() {
    if (window.innerWidth <= 750) {
        closeDialog();
        window.location.href = './add_task.html';
        return;
    }

    let dialog = document.getElementById('dialog');
    let dialogslide = document.getElementById('add_task_dialog_content');
    let content = document.getElementById('addtask-content');
    setTimeout(() => {
        dialogslide.classList.add('slide-in-right');
        dialog.classList.remove('d_none');
    }, 300);
    ensureCssLoaded();
    addTaskLoadNames();
    content.classList.remove('addtask-content');
    content.classList.add('addtask-content-dialog');
    clearContent();
    mediumButton();
};

/**
 * Closes the dialog by adding the 'd_none' class.
 */
function closeDialog() {
    let dialog = document.getElementById('dialog');
    let dialogslide = document.getElementById('add_task_dialog_content');
    dialogslide.classList.add('slide-out-right');
    setTimeout(() => {
        dialogslide.classList.remove('slide-in-right')
        dialogslide.classList.remove('slide-out-right');
        dialog.classList.add('d_none');
    }, 300);
};

/**
 * Prevents event propagation when clicking on the background.
 * 
 * @param {Event} event - The event object.
 */
function closeOnBackground(event) {
    event.stopPropagation();
};

/**
 * Ensures the 'style_addtask.css' stylesheet is loaded.
 */
function ensureCssLoaded() {
    if (!document.querySelector('link[href="./styles/style_addtask.css"]')) {
        let cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = './styles/style_addtask.css';
        document.head.appendChild(cssLink);
    }
};

/**
 * Loads the content of 'add_task.html' into the dialog if it hasn't been loaded yet.
 */
function loadAddTaskContent() {
    let contentContainer = document.getElementById('add_task_dialog_content');
    if (!document.getElementById('addtask-content')) {
        fetch('./add_task.html')
            .then(response => response.text())
            .then(html => {
                let tempElement = document.createElement('div');
                tempElement.innerHTML = html;
                let addTaskContent = tempElement.querySelector('#addtask-content');
                if (addTaskContent) {
                    contentContainer.appendChild(addTaskContent);
                } else {
                    console.error('Could not find #addtask-content in the fetched HTML.');
                }
            })
            .catch(error => console.error('Error fetching add_task.html:', error));
    }
};

/**
 * Open the dialog for TaskDetails.
 */
function showPopup(id) {
    const popup = document.getElementById(id);
    const taskDetails = popup.querySelector('.TaskDetails');

    popup.classList.remove('hidden');
    popup.classList.add('fade-in');

    setTimeout(() => {
        taskDetails.classList.add('slide-in-right');
    }, 300);
};

/**
 * Closes the dialog.
 */
function hidePopup(id) {
    const popup = document.getElementById(id);
    const taskDetails = popup.querySelector('.TaskDetails');

    taskDetails.classList.remove('slide-in-right');
    taskDetails.classList.add('slide-out-right');
    popup.classList.remove('fade-in');
    popup.classList.add('fade-out');

    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('fade-out');
        taskDetails.classList.remove('slide-out-right');
    }, 800);
};

/**
 * Fetches data from the specified endpoint.
 * @async
 * @param {string} [path="tasks"] - The endpoint path to fetch data from.
 * @returns {Promise<Object[]>} The fetched data as an array of objects.
 */
async function fetchData(path = "tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    let responseToObject = Object.values(responseToJson);
    console.log(responseToJson);
    return responseToObject;
};

/**
 * Generates a random color excluding white.
 * @returns {string} The generated color in hex format.
 */
function generateRandomColor() {
    let randomColor;
    do {
        randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (randomColor.toUpperCase() === '#FFFFFF');
    return randomColor;
};

/**
 * Generates the HTML string for assigned names.
 * @param {Array<string>} assignedNames - The list of assigned names.
 * @returns {string} The HTML string representing the assigned names.
 */
function generateAssignedNamesHTML(assignedNames) {
    return assignedNames.map(name => {
        let initials = name.split(' ').map(n => n[0]).join('');
        let randomColor = generateRandomColor();
        return /*html*/`
            <div class="assignedName" style="background-color: ${randomColor};"><span>${initials}</span></div>`;
    }).join('');
}

/**
 * Generates the HTML string for subtask count.
 * @param {Array<string>} subtask - The list of subtasks.
 * @returns {string} The HTML string representing the subtask count.
 */
function generateSubtaskCountHTML(subtask) {
    let count = subtask ? `${subtask.length}/${subtask.length} Subtask${subtask.length > 1 ? 's' : ''}` : '0/0 Subtasks';
    return `<p class="subtaskCount">${count}</p>`;
}

/**
 * Generates the HTML element string for a given task.
 * @param {Object} task - The task object.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Array<string>} task.assignto - The list of names assigned to the task.
 * @param {Array<string>} task.subtask - The list of subtasks.
 * @param {string} task.prio - The priority of the task.
 * @returns {string} The HTML string representing the task.
 */
function createTaskElement(task) {
    let taskid = `taskBox${taskIdCounter++}`; // Generate unique task id
    let assignedNamesHTML = generateAssignedNamesHTML(task.assignto || []);
    let subtaskCountHTML = generateSubtaskCountHTML(task.subtask);
    let priorityImage = priorityImages[task.prio] || './assets/img/prio_media.png';

    return /*html*/`
        <div id="${taskid}" draggable="true" class="toDoBox" onclick="showPopup('popup')">
            <button class="CategoryBox" >${task.category}</button>
            <p class="HeadlineBox">${task.title}</p>
            <p class="descriptionBox">${task.description}</p>
            <div class="subtaskProgress">
                <progress value="0" max="100"></progress>
                ${subtaskCountHTML}
            </div>
            <div class="nameSection">
                ${assignedNamesHTML}
                <div class="prioImgContainer">
                    <img class="prioImg" src="${priorityImage}" alt="Priority">
                </div>
            </div>
        </div>
    `;
};

/**
 * Categorizes tasks into their respective status categories.
 * @param {Object[]} tasks - The array of task objects.
 * @returns {Object} An object containing HTML strings for each task status category.
 */
function categorizeTasks(tasks) {
    let categorizedTasks = {
        todo: '',
        inprogress: '',
        awaitfeedback: '',
        done: ''
    };

    tasks.forEach(task => {
        let taskHTML = createTaskElement(task);

        switch (task.status) {
            case 'todo':
                categorizedTasks.todo += taskHTML;
                break;
            case 'inprogress':
                categorizedTasks.inprogress += taskHTML;
                break;
            case 'awaitfeedback':
                categorizedTasks.awaitfeedback += taskHTML;
                break;
            case 'done':
                categorizedTasks.done += taskHTML;
                break;
            default:
                console.warn(`Unknown task status: ${task.status}`);
        }
    });

    return categorizedTasks;
};

/**
 * Inserts categorized tasks into the DOM.
 * @param {Object} categorizedTasks - An object containing HTML strings for each task status category.
 */
function insertTasksIntoDOM(categorizedTasks) {
    document.querySelector('#todoTasks .tasks').innerHTML = categorizedTasks.todo;
    document.querySelector('#inProgressTasks .tasks').innerHTML = categorizedTasks.inprogress;
    document.querySelector('#awaitFeedbackTasks .tasks').innerHTML = categorizedTasks.awaitfeedback;
    document.querySelector('#doneTasks .tasks').innerHTML = categorizedTasks.done;
};

/**
 * Fetches tasks, categorizes them, and inserts them into the DOM.
 * @async
 */
async function displayTasks() {
    try {
        let tasks = await fetchData();
        let categorizedTasks = categorizeTasks(tasks);
        insertTasksIntoDOM(categorizedTasks);
    } catch (error) {
        console.error('Error fetching and displaying tasks:', error);
    }
};

// Call the displayTasks function to fetch and display tasks.
displayTasks();
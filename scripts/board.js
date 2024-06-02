


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
    // addTaskLoadNames();
    content.classList.remove('addtask-content');
    content.classList.add('addtask-content-dialog');
}

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
}

/**
 * Prevents event propagation when clicking on the background.
 * 
 * @param {Event} event - The event object.
 */
function closeOnBackground(event) {
    event.stopPropagation();
}

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
}

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
}


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
}


async function fetchData(path = "tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();
    responseToObject = Object.values(responseToJson);
    console.log(responseToJson);
    return responseToObject; //alternativ:  return Object.values(await response.json()); um Zeilen zu sparen.
}

function createTaskElement(task) {
    const assignedNames = task.assignto ? task.assignto.map(name => name.split(' ').map(n => n[0]).join('')).join('') : '';
    const subtaskCount = task.subtask ? `${task.subtask.length}/${task.subtask.length} Subtask${task.subtask.length > 1 ? 's' : ''}` : '0/0 Subtasks';

    const priorityImages = {
        urgent: './assets/img/prio_alta.png',
        medium: './assets/img/prio_media.png',
        low: './assets/img/prio_baja.png'
    };

    const priorityImage = priorityImages[task.prio] || './assets/img/prio_media.png';

    return `
        <div class="toDoBox" onclick="showPopup('popup')">
            <button class="CategoryBox">${task.category}</button>
            <p class="HeadlineBox">${task.title}</p>
            <p class="descriptionBox">${task.description}</p>
            <div class="subtaskProgress">
                <progress value="0" max="100"></progress>
                <p class="subtaskCount">${subtaskCount}</p>
            </div>
            <div class="nameSection">
                <div class="assignedName colorName">${assignedNames}</div>
                <div class="prioImgContainer">
                    <img class="prioImg" src="${priorityImage}" alt="Priority">
                </div>
            </div>
        </div>
    `;
}

async function displayTasks() {
    try {
        const tasks = await fetchData();
        const todoContainer = document.querySelector('#todoTasks .tasks');
        const inProgressContainer = document.querySelector('#inProgressTasks .tasks');
        const awaitFeedbackContainer = document.querySelector('#awaitFeedbackTasks .tasks');
        const doneContainer = document.querySelector('#doneTasks .tasks');

        let todoTasksHTML = '';
        let inProgressTasksHTML = '';
        let awaitFeedbackTasksHTML = '';
        let doneTasksHTML = '';

        tasks.forEach(task => {
            const taskHTML = createTaskElement(task);

            switch (task.status) {
                case 'todo':
                    todoTasksHTML += taskHTML;
                    break;
                case 'inprogress':
                    inProgressTasksHTML += taskHTML;
                    break;
                case 'awaitfeedback':
                    awaitFeedbackTasksHTML += taskHTML;
                    break;
                case 'done':
                    doneTasksHTML += taskHTML;
                    break;
                default:
                    console.warn(`Unknown task status: ${task.status}`);
            }
        });

        todoContainer.innerHTML = todoTasksHTML;
        inProgressContainer.innerHTML = inProgressTasksHTML;
        awaitFeedbackContainer.innerHTML = awaitFeedbackTasksHTML;
        doneContainer.innerHTML = doneTasksHTML;
    } catch (error) {
        console.error('Error fetching and displaying tasks:', error);
    }
}

// Ruf die displayTasks Funktion direkt auf
displayTasks();
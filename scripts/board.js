let priorityImages = {
    urgent: './assets/img/prio_alta.png',
    medium: './assets/img/prio_media.png',
    low: './assets/img/prio_baja.png'
};

let CategoryColors = {
    Finance: { background: '#FF7A00', color: '#FFFFFF' },
    IT: { background: '#FF5EB3', color: '#FFFFFF' },
    Sales: { background: '#6E52FF', color: '#FFFFFF' },
    HR: { background: '#9327FF', color: '#FFFFFF' },
    Marketing: { background: '#00BEE8', color: '#FFFFFF' },
    Operations: { background: '#1FD7C1', color: '#FFFFFF' },
    Product: { background: '#FF745E', color: '#FFFFFF' }
};

let taskIdCounter = 0;
let currentDraggedElement = 0;
let touchOffsetX = 0;
let touchOffsetY = 0;
let tasks = [];

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
function showPopup(task, taskid, assignedNamesHTML, subtaskCountHTML, priorityImage, categoryColor) {
    const popup = document.getElementById('popup');
    const taskDetails = document.getElementById('TaskDetailsDialog');

    setTimeout(() => {
        popup.classList.remove('hidden');
        popup.classList.add('fade-in');
        taskDetails.classList.add('slide-in-right');
    }, 300);
    // renderTaskDialog(task, taskid, assignedNamesHTML, subtaskCountHTML, priorityImage, categoryColor);
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
 * Fetches data from Firebase.
 * 
 * @async
 * @function fetchData
 * @param {string} [path="tasks"] - The path in the Firebase database to fetch data from.
 * @returns {Promise<Object[]>} An array of task objects with their IDs.
 */
async function fetchData(path = "tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    let responseToObject = Object.entries(responseToJson).map(([id, task]) => ({ id, ...task }));
    console.log(responseToJson);
    return responseToObject;
};

/**
 * Generates a random color excluding white.
 * 
 * @function generateRandomColor
 * @returns {string} A random color in hexadecimal format.
 */
function generateRandomColor() {
    let randomColor;
    do {
        randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (randomColor.toUpperCase() === '#FFFFFF');
    return randomColor;
};

/**
 * Generates HTML for assigned names with a 'Plus' button for overflow.
 * 
 * @function generateAssignedNamesHTML
 * @param {string[]} assignedNames - An array of names assigned to a task.
 * @returns {string} HTML string representing the assigned names.
 */
function generateAssignedNamesHTML(assignedNames) {
    let MAX_NAMES_DISPLAYED = 3;
    let position = 0;
    let html = '';
    let overflowCount = Math.max(0, assignedNames.length - MAX_NAMES_DISPLAYED);

    assignedNames.slice(0, MAX_NAMES_DISPLAYED).forEach(name => {
        let initials = name.split(' ').map(n => n[0]).join('');
        let randomColor = generateRandomColor();
        html += /*html*/`
            <div class="assignedName" style="background-color: ${randomColor};"><span>${initials}</span></div>`;
    });

    if (overflowCount > 0) {
        position += 110;
        html += /*html*/ `
            <div class="moreButtonBoard" style="left:${position}px">+${overflowCount}</div>`;
    }

    return html;
}


/**
 * Generates HTML for subtask count and progress bar.
 * 
 * @function generateSubtaskCountHTML
 * @param {Object[]} [subtasks] - An array of subtasks.
 * @returns {string} HTML string representing the subtask count and progress bar.
 */
function generateSubtaskCountHTML(subtasks) {
    let totalSubtasks = subtasks ? subtasks.length : 0;
    let completedSubtasks = subtasks ? subtasks.filter(subtask => subtask.completed).length : 0;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let progressBarStyle = `width: ${progressPercentage}%;`;

    let count = `${completedSubtasks}/${totalSubtasks} Subtask${totalSubtasks !== 1 ? 's' : ''}`;
    let progressBarHTML = `<div class="progressBar"><div class="progress" style="${progressBarStyle}"></div></div>`;

    return `<div class="subtaskProgress">${progressBarHTML}<p class="subtaskCount">${count}</p></div>`;
}


/**
 * Creates a task element.
 * 
 * @function createTaskElement
 * @param {Object} task - The task object.
 * @returns {string} HTML string representing the task element.
 */
function createTaskElement(task, search) {
    let taskid = task.id; // Use the task ID from Firebase
    let assignedNamesHTML = generateAssignedNamesHTML(task.assignto || []);
    let subtaskCountHTML = generateSubtaskCountHTML(task.subtask || []);
    let priorityImage = priorityImages[task.prio] || './assets/img/prio_media.png';
    let categoryColor = CategoryColors[task.category] || { background: '#000000', color: '#FFFFFF' };

    return createTaskHTML(task, taskid, assignedNamesHTML, subtaskCountHTML, priorityImage, categoryColor, search);
};

/**
 * Creates the HTML string for a task element.
 * 
 * @function createTaskHTML
 * @param {Object} task - The task object.
 * @param {string} taskid - The task ID.
 * @param {string} assignedNamesHTML - HTML string of assigned names.
 * @param {string} subtaskCountHTML - HTML string of subtask count.
 * @param {string} priorityImage - URL of the priority image.
 * @param {Object} categoryColor - Object containing background and text color for the category.
 * @returns {string} HTML string representing the task element.
 */
function createTaskHTML(task, taskid, assignedNamesHTML, subtaskCountHTML, priorityImage, categoryColor, search) {
    let descriptionSection = task.description ? `<p class="descriptionBox">${task.description}</p>` : '';
    return /*html*/`
        <div id="${taskid}" draggable="true" ondragstart="startDragging('${taskid}')" class="toDoBox" onclick="showPopup('${taskid}')">
            <button class="CategoryBox" style="background-color: ${categoryColor.background};">${task.category}</button>
            <p class="HeadlineBox">${task.title}</p>
            <p class="descriptionBox">${descriptionSection}</p>
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
 * 
 * @function categorizeTasks
 * @param {Object[]} tasks - An array of task objects.
 * @returns {Object} An object containing categorized tasks as HTML strings.
 */
function categorizeTasks(tasks, search) {
    let categorizedTasks = {
        todo: '',
        inprogress: '',
        awaitfeedback: '',
        done: ''
    };

    tasks.forEach(task => {
        let taskHTML = createTaskElement(task, search);

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
 * 
 * @function insertTasksIntoDOM
 * @param {Object} categorizedTasks - An object containing categorized tasks as HTML strings.
 */
function insertTasksIntoDOM(categorizedTasks) {
    document.querySelector('#todo .tasks').innerHTML = categorizedTasks.todo;
    document.querySelector('#inprogress .tasks').innerHTML = categorizedTasks.inprogress;
    document.querySelector('#awaitfeedback .tasks').innerHTML = categorizedTasks.awaitfeedback;
    document.querySelector('#done .tasks').innerHTML = categorizedTasks.done;
    document.getElementById('todo').classList.remove('drag-area-highlight');
    document.getElementById('inprogress').classList.remove('drag-area-highlight');
    document.getElementById('awaitfeedback').classList.remove('drag-area-highlight');
    document.getElementById('done').classList.remove('drag-area-highlight');
}

/**
 * Fetches tasks, categorizes them, and inserts them into the DOM.
 * 
 * @async
 * @function displayTasks
 */
async function displayTasks(search) {
    try {
        let tasks = await fetchData();
        let categorizedTasks = categorizeTasks(tasks, search);
        insertTasksIntoDOM(categorizedTasks, search);
    } catch (error) {
        console.error('Error fetching and displaying tasks:', error);
    }
};

// Call the displayTasks function to fetch and display tasks
displayTasks();

/**
 * Handles drag start event.
 * 
 * @function startDragging
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
    console.log(`Started dragging task with id: ${id}`);
};

/**
 * Allows drop event.
 * 
 * @function allowDrop
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
};

/**
 * Handles drop event and updates the task status.
 * 
 * @async
 * @function moveTo
 * @param {string} newStatus - The new status of the task.
 */
async function moveTo(newStatus) {
    if (currentDraggedElement) {
        await updateTaskStatus(currentDraggedElement, newStatus);
        displayTasks(); // Refresh the task display after status update
    }
};

/**
 * Updates the status of a task in Firebase.
 * 
 * @async
 * @function updateTaskStatus
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status to set for the task.
 */
async function updateTaskStatus(taskId, newStatus) {
    try {
        // Fetch current tasks from Firebase
        let response = await fetch(BASE_URL + "tasks.json");
        let tasksObject = await response.json();

        // Find the task by id and update its status
        if (tasksObject[taskId]) {
            tasksObject[taskId].status = newStatus;

            // Update tasks in Firebase
            await fetch(BASE_URL + "tasks.json", {
                method: 'PATCH',
                body: JSON.stringify({ [taskId]: tasksObject[taskId] }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Task status successfully updated');
        } else {
            console.error('Task not found');
        }
    } catch (error) {
        console.error('Error updating task status:', error);
    }
};

/**
 * Adds a highlight class to an element with the given ID.
 * 
 * This function selects an HTML element by its ID and adds the 'drag-area-highlight' 
 * class to it, which can be used to apply specific styles defined in CSS.
 * 
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
};

/**
 * Removes a highlight class from an element with the given ID.
 * 
 * This function selects an HTML element by its ID and removes the 'drag-area-highlight' 
 * class from it, which can be used to remove specific styles defined in CSS.
 * 
 * @param {string} id - The ID of the element to remove the highlight from.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
};

// async function renderTaskDialog(task, taskid, assignedNamesHTML, subtaskCountHTML, priorityImage, categoryColor) {
//     try {
//         let tasks = await fetchData();
//         let selectedTask = tasks.find(item => item.id === taskid);
//         if (!selectedTask) {
//             console.error(`Keine Aufgabe gefunden mit der id ${taskid}`);
//             return;
//         }


//         let TaskDetailsDialog = document.getElementById('TaskDetailsDialog');

//         TaskDetailsDialog.innerHTML = "";
//         TaskDetailsDialog.innerHTML += /*html*/`
//             <img id="${taskid}" class="closePopup" src="./assets/img/close.png" onclick="hidePopup('${taskid}')" alt="Close">
//             <button id="CategoryBox" class="CategoryBox"></button>
//         `;

//     } catch (error) { }

// };


//Relevante Funktionen displayTasks, (insertTasksIntoDOM Muss evtl geleert werden), =>createTaskHTML
//Releveante Variabeln: assignedNamesHTML, descriptionSection, task.title
function searchTask() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    if (search.length < 4) {
        return;
    }

    let done = document.getElementById('done');
    let awaitfeedback = document.getElementById('awaitfeedback');
    let inprogress = document.getElementById('inprogress');
    let todo = document.getElementById('todo');
    done.innerHTML = '';
    awaitfeedback.innerHTML = '';
    inprogress.innerHTML = '';
    todo.innerHTML = '';


    displayTasks(search);
}


function searchCheck(search, assignedNamesHTML, descriptionSection, task.title) { //muss in createTaskHTML angepast werden
    for (let i = 0; i < allPokemon.length; i++) {
        let pokemonName = allPokemon[i]['name'];
        let pokemonImg = allPokemon[i]['sprites']['other']['dream_world']['front_default'];
        let pokemonTypeBackground = allPokemon[i]['types']['0']['type']['name'];

        pokemonName = capitalizeFirstLetter(pokemonName);
        pokemonImg = obtainAlternativeImgInCaseOfNull(pokemonImg, i);

        if (pokemonName.toLowerCase().includes(search)) {
            cards.innerHTML += htmlCardsClosed(i, pokemonTypeBackground, pokemonImg, pokemonName);
            generateTypeImg(i);
        }
    }
}
const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app";  

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/**
 * Opens the dialog by removing the 'd_none' class and ensures CSS and content are loaded.
 */
function openDialog() {
    let dialog = document.getElementById('dialog');
    let dialogslide = document.getElementById('add_task_dialog_content');
    let content = document.getElementById('addtask-content');
    setTimeout(() => {
        dialogslide.classList.add('add_task_dialog_slide_in')
        dialog.classList.add('add_task_dialog_slide_in')
        dialog.classList.remove('d_none');
    }, 300);
    ensureCssLoaded();
    addTaskLoadNames();
    content.classList.remove('addtask-content');
    content.classList.add('addtask-content-dialog');
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


async function fetchData() {
    const response = await fetch(`${BASE_URL}/tasks.json`);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
}


function createTaskElement(task) {
    return `
        <div class="toDoBox" onclick="showPopup('popup')">
            <button class="CategoryBox">${task.category}</button>
            <p class="HeadlineBox">${task.title}</p>
            <p class="descriptionBox">${task.description}</p>
            <div class="subtaskProgress">
                <progress value="0" max="100"></progress>
                <p class="subtaskCount">0/1 Subtask</p>
            </div>
            <div class="nameSection">
                <div class="assignedName colorName">${task.assignto.split(' ').map(name => name[0]).join('')}</div>
                <div class="prioImgContainer">
                    <img class="prioImg" src="./assets/img/prio_media.png" alt="Priority">
                </div>
            </div>
        </div>
    `;
}


async function displayTasks() {
    try {
        const tasks = await fetchData();
        const taskContainer = document.getElementById('taskContainer');
        let tasksHTML = '';

        tasks.forEach(task => {
            tasksHTML += createTaskElement(task);
        });

        taskContainer.innerHTML = tasksHTML;
    } catch (error) {
        console.error('Error fetching and displaying tasks:', error);
    }
}

displayTasks();

/**
 * Opens the dialog by removing the 'd_none' class and ensures CSS and content are loaded.
 */
function openDialog() {
    let dialog = document.getElementById('dialog');
    let dialogslide = document.getElementById('add_task_dialog_content');
    setTimeout(() => {
        dialogslide.classList.add('add_task_dialog_slide_in')
        dialog.classList.add('add_task_dialog_slide_in')
        dialog.classList.remove('d_none');
    }, 300);
    ensureCssLoaded();
    loadAddTaskContent();
    addTaskOnLoad();
    mediumButton();
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
}

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

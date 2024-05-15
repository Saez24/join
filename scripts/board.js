/**
 * Opens a dialog for adding a new task.
 * Loads the content of add_task.html into the dialog and adds necessary styles.
 */
function openDialog() {
    /**
     * The HTML element representing the dialog.
     * @type {HTMLElement}
     */
    let dialog = document.getElementById('dialog');

    // Remove the 'd_none' class to display the dialog
    dialog.classList.remove('d_none');

    /**
     * The HTML link element for adding task styles.
     * @type {HTMLLinkElement}
     */
    let cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = './styles/style_addtask.css';
    document.head.appendChild(cssLink);

    // Fetch the content of add_task.html
    fetch('./add_task.html')
        .then(response => response.text())
        .then(html => {
            let tempElement = document.createElement('div');
            tempElement.innerHTML = html;
            let addTaskContent = tempElement.querySelector('#addtask-content');
            document.getElementById('add_task_dialog_content').appendChild(addTaskContent);
        })
        .catch(error => console.error('Error fetching add_task.html:', error));
}

/**
 * Closes the dialog for adding a new task.
 */
function closeDialog() {
    /**
     * The HTML element representing the dialog.
     * @type {HTMLElement}
     */
    let dialog = document.getElementById('dialog');

    // Add the 'd_none' class to hide the dialog
    dialog.classList.add('d_none');
}


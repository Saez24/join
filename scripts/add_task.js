const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/"
let names
let category
let id = 0;
let subtaskCounter = 0;
let counter = 0;
let activeButton = null;

let buttonImages = {
    urgent: './assets/img/prio_alta.png',
    medium: './assets/img/prio_media.png',
    low: './assets/img/prio_baja.png'
};

let buttonNames = {
    urgent: 'Urgent',
    medium: 'Medium',
    low: 'Low'
};

let buttonColors = {
    urgent: { background: '#FF3D00', color: '#FFFFFF' },
    medium: { background: '#FFA800', color: '#FFFFFF' },
    low: { background: '#7AE229', color: '#FFFFFF' }
};

/**
 * Resets the background color, text color, and image of the given button to default values.
 * @param {HTMLElement} button - The HTML element of the button whose styles are to be reset.
 */
function resetButtonStyles(button) {
    button.style.background = '';
    button.style.color = '';
    button.querySelector('img').src = buttonImages[button.id];
}

/**
 * Sets the active state for the given button.
 * If the button is already active, resets its styles and clears the active state.
 * If the button is not active, sets its styles to the active state.
 * @param {HTMLElement} button - The HTML element of the button to set as active.
 */
function setActiveButton(button) {
    if (activeButton === button) {
        // When clicking on the same button
        resetButtonStyles(button);
        activeButton = null; // Reset the active button
    } else {
        // When clicking on a different button
        if (activeButton) {
            resetButtonStyles(activeButton); // Reset the previously active button
        }
        button.style.background = buttonColors[button.id].background;
        button.style.color = buttonColors[button.id].color;
        activeButton = button;
    }
}

/**
 * Sets the styles and active state for the urgent button.
 */
function urgentButton() {
    let urgentButton = document.getElementById('urgent');
    urgentButton.innerHTML = '';
    urgentButton.innerHTML += `Urgent <img src="./assets/img/prio_alta_white.png" alt="">`;
    urgentButton.style.background = buttonColors.urgent.background;
    urgentButton.style.color = buttonColors.urgent.color;
    // Set the low button as active
    setActiveButton(urgentButton);
}

/**
 * Sets the styles and active state for the medium button.
 */
function mediumButton() {
    let mediumButton = document.getElementById('medium');
    mediumButton.innerHTML = '';
    mediumButton.innerHTML += `Medium <img src="./assets/img/prio_media_white.png" alt="">`;
    mediumButton.style.background = buttonColors.medium.background;
    mediumButton.style.color = buttonColors.medium.color;
    setActiveButton(mediumButton);
}

/**
 * Sets the styles and active state for the low button.
 */
function lowButton() {
    let lowButton = document.getElementById('low');
    lowButton.innerHTML = '';
    lowButton.innerHTML += `Low <img src="./assets/img/prio_baja_white.png" alt="">`;
    lowButton.style.background = buttonColors.low.background;
    lowButton.style.color = buttonColors.low.color;
    setActiveButton(lowButton);
}

/**
 * Opens the subtask field for adding a new subtask.
 */
function openAddSubtaskField() {
    let addSubtaskField = document.getElementById('addsubtask');
    let subtaskField = document.getElementById('subtask');
    addSubtaskField.style.display = 'none';
    subtaskField.style.display = 'block';
}

/**
 * Closes the subtask field.
 */
function closeAddSubtaskField() {
    let addSubtaskField = document.getElementById('addsubtask');
    let subtaskField = document.getElementById('subtask');
    addSubtaskField.style.display = 'block';
    subtaskField.style.display = 'none';
}

/**
 * Handles click events on the subtask field.
 * Closes the subtask field if the click is within the area of the close.png image,
 * otherwise triggers adding a subtask if the click is within the area of the check_black.png image.
 * @param {MouseEvent} event - The click event object.
 */
function handleSubtaskClick(event) {
    let input = document.getElementById("subtask");
    let clickX = event.clientX;
    let inputRight = input.getBoundingClientRect().right;
    // Check if the click is within the area of the close.png image
    if (clickX >= inputRight - 56 && clickX <= inputRight - 28) {
        closeAddSubtaskField();
    }
}

/**
 * Handles adding a subtask when the user clicks on the appropriate area.
 * Retrieves the input content from the subtask field, creates a new list item element,
 * sets its content and attributes, appends it to the list of subtasks, and closes the subtask field.
 */
function addSubtask() {
    let input = document.getElementById("subtask");
    let inputContent = input.value.trim();

    if (inputContent !== "") {
        let subtasks = document.getElementById("addsubtasks");
        subtasks.classList.add("subtaskblock");
        subtaskCounter++;
        let subtaskId = "subtask" + subtaskCounter;
        subtasks.innerHTML += /*html*/ `
        <div class="addedtask" id="${subtaskId}">
            <li id="${subtaskId}">${inputContent}</li>
            <div id="subtask-buttons" class="subtask-buttons">
                <button onclick="editSubtask('${subtaskId}')" ><img src="./assets/img/edit.png" alt=""></button>
                <img src="./assets/img/separator.png" alt="">
                <button onclick="deleteSubtask('${subtaskId}')"><img src="./assets/img/delete.png" alt=""></button>
            </div>
        </div>`;
        closeAddSubtaskField();
    }
    input.value = "";
}

/**
 * Enables editing of the specific subtask.
 * @param {string} subtaskId - The ID of the subtask to be edited.
 */
function editSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        let currentText = subtaskElement.innerText;
        subtaskElement.innerHTML = /*html*/`
        <input onclick = "saveEditedSubtask('${subtaskId}', event)" class="edit-subtask" type="text" id="${subtaskId}-edit" value="${currentText}">
        `;
    }
}

/**
 * Saves the edited subtask content.
 * @param {string} subtaskId - The ID of the subtask to be saved.
 * @param {Event} event - The click event.
 */
function saveEditedSubtask(subtaskId, event) {
    let input = document.getElementById(subtaskId + '-edit');
    let inputRect = input.getBoundingClientRect();
    let clickX = event.clientX - inputRect.left; // Mouse click position relative to the input field

    // Calculate the right position of the delete icon
    let deleteIconRight = inputRect.width - 16;

    // Check if the click is within the area of the delete icon
    if (clickX >= deleteIconRight - 24) { // Assuming delete icon width is 16px
        deleteSubtask(subtaskId + '-container');
    } else if (!event.target.classList.contains('edit-subtask')) {
        let newContent = input.value.trim();
        if (newContent !== "") {
            document.getElementById(subtaskId).innerHTML = newContent;
        } else {
            deleteSubtask(subtaskId + '-container');
        }
    }
}



/**
 * Deletes the specific subtask element.
 * @param {string} subtaskId - The ID of the subtask to be deleted.
 */
function deleteSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        subtaskElement.remove();
    }

    // Optional: Check if there are no more subtasks and remove subtaskblock class if needed
    let subtasks = document.getElementById("addsubtasks");
    if (subtasks.children.length === 0) {
        subtasks.classList.remove("subtaskblock");
    }
}


/**
 * Toggles the visibility of the category selection container.
 * If the container is currently visible, hides it; otherwise, shows it.
 */
function selectCategory() {
    let categoryContainer = document.getElementById('taskcategory');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
    } else {
        categoryContainer.style.display = 'block';
    }
}

/**
 * Closes the category dropdown menu if it is currently open.
 */
function closeSelectCategory() {
    let categoryContainer = document.getElementById('taskcategory');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
    }
}

/**
 * Prevents event propagation.
 * @param {Event} event - The event object.
 */
function closeOnBackground(event) {
    event.stopPropagation();
}

/**
 * Toggles the visibility of the assign-to selection container.
 * If the container is currently visible, hides it; otherwise, shows it.
 */
function selectAssingTo() {
    let assignToContainer = document.getElementById('assignedto');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
    } else {
        assignToContainer.style.display = 'block';
    }
}

/**
 * Closes the assignto dropdown menu if it is currently open.
 */
function closeAssingTo() {
    let assignToContainer = document.getElementById('assignedto');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
    }
}

/**
 * Toggles the selected_dropdown class of the given element, used for dropdown selection.
 * @param {HTMLElement} element - The HTML element to toggle the class on.
 */
function dropdownSelect(element) {
    element.classList.toggle("selected_dropdown");
}

/**
 * Performs tasks to add a new task when the page loads.
 */
function addTaskOnLoad() {
    console.log("test");
    addTaskLoadNames();
}

/**
 * Loads names and categories for adding a new task asynchronously when the page loads.
 */
async function addTaskLoadNames() {
    try {
        let response = await fetch(BASE_URL + ".json");
        let data = await response.json();
        renderAddTaskNames(data.names);
        renderAddTaskCategorys(data.category);
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

/**
 * Generates HTML for displaying a name with a color-coded short name and a checkbox.
 * @param {string} nameKey - The key of the name.
 * @param {string} name - The name.
 * @param {string} firstInitial - The first initial of the first name.
 * @param {string} lastInitial - The first initial of the last name.
 * @param {number} id - The ID for the HTML element.
 * @returns {string} The generated HTML.
 */
function generateNameHTML(nameKey, name, firstInitial, lastInitial, id) {
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return /*html*/ `
        <div class="dropdown_selection" onclick="dropdownSelect(this)">
            <button class="shortname" style="background-color: ${randomColor};"><span>${firstInitial}${lastInitial}</span></button><span>${name}</span>
            <input class="checkbox" type="checkbox" id="assignedto_${nameKey}_${id}">
        </div>
    `;
}

/**
 * Generiert das HTML für die Namen, einschließlich der Initialen.
 * @param {Object} names - Das Objekt, das die Namen enthält.
 * @returns {string} - Das generierte HTML für die Namen.
 */
function renderNamesHTML(names) {
    let namesHTML = '';

    for (let nameKey in names) {
        if (names.hasOwnProperty(nameKey)) {
            let nameObj = names[nameKey];
            let name = nameObj.name;
            let nameParts = name.split(' ');
            let firstInitial = nameParts[0].charAt(0).toUpperCase();
            let lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
            namesHTML += generateNameHTML(nameKey, name, firstInitial, lastInitial, id++);
        }
    }
    return namesHTML;
}

/**
 * Renders names HTML to the DOM.
 * @param {string} namesHTML - The HTML representing names to be rendered.
 */
function renderNamesToDOM(namesHTML) {
    let namesContainer = document.getElementById("assignedto");
    namesContainer.innerHTML = namesHTML;
}

/**
 * Renders names for adding a new task to the DOM.
 * @param {Object} names - An object containing names.
 */
function renderAddTaskNames(names) {
    let namesHTML = renderNamesHTML(names);
    renderNamesToDOM(namesHTML);
}

/**
 * Renders categories for adding a new task to the DOM.
 * @param {Object} categories - An object containing categories.
 */
function renderAddTaskCategorys(categories) {
    let categoryContainer = document.getElementById("taskcategory");
    categoryContainer.innerHTML = '';

    for (let categoryKey in categories) {
        if (categories.hasOwnProperty(categoryKey)) {
            let category = categories[categoryKey];
            let categoryId = id++;
            categoryContainer.innerHTML += /*html*/ `
            <div class="dropdown_selection" onclick="dropdownSelect(this)">
                    <label>${category.task}</label>
                    <input class="checkbox" type="checkbox" id="category_${categoryId}">
                </div>
        `;
        }
    }
}

/**
 * Clears the content of text inputs and textareas.
 */
function clearContent() {
    let inputs = document.getElementsByTagName("input");
    let textareas = document.getElementsByTagName("textarea");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "text" || inputs[i].type === "date") {
            inputs[i].value = "";
        }
    }

    for (let j = 0; j < textareas.length; j++) {
        textareas[j].value = "";
    }
}

/**
 * Sets the minimum date of the date input field to today's date.
 */
function setDateRestriction() {
    let today = new Date();
    let formattedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let dateField = document.getElementById("duedate");
    dateField.min = formattedDate;
}

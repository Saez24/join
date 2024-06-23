function getCurrentTaskId() {
    return document.getElementById('TaskDetailsDialog').getAttribute('data-taskid');
};

/**
* Opens the dialog by removing the 'd_none' class and ensures CSS and content are loaded.
*/
async function openDialogEdit() {
    let taskid = getCurrentTaskId();
    currentTaskId = taskid;
    const response = await fetch('./edit_task.html');
    const htmlContent = await response.text();

    let dialog = document.getElementById('edit-dialog');
    let dialogslide = document.getElementById('edit_task_dialog_content');
    dialogslide.innerHTML = htmlContent;

    setTimeout(() => {
        dialogslide.classList.add('slide-in-right');
        dialog.classList.remove('edit-d_none');
    }, 300);

    ensureCssLoaded();

    let content = document.getElementById('edittask-content');
    if (content) {
        content.classList.remove('edit-task-content');
        content.classList.add('edit-task-content-dialog');
        await editAddTaskLoadNames();
    }
    console.log(taskid);

    hidePopup();
    fetchEditTask(taskid);
};

function fetchEditTask(taskid) {
    fetch(`${BASE_URL}tasks/${taskid}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(task => {
            if (!task) {
                throw new Error('Task nicht gefunden');
            }

            console.log('Geladene Task-Details:', task);
            renderEditTask(task);

            // Setze die taskid im Dialog nach erfolgreichem Laden
            let taskDetails = document.getElementById('TaskDetailsDialog');
            taskDetails.setAttribute('data-taskid', taskid);
        })
        .catch(error => {
            console.error('Fehler beim Laden der Task-Details:', error);
            alert('Fehler beim Laden der Task-Details: ' + error.message);
        });
}

function renderEditTask(task) {
    let titleInput = document.getElementById('edit-tasktitle');
    let descriptionInput = document.getElementById('edit-description');
    let duedateInput = document.getElementById('edit-duedate');
    let categoryInput = document.getElementById('edit-taskcategoryinput');

    if (titleInput && descriptionInput && duedateInput && categoryInput) {
        titleInput.value = task.title || '';
        descriptionInput.value = task.description || '';
        duedateInput.value = task.duedate || '';
        categoryInput.value = task.category || '';

        renderEditAssignTo(task)
        renderEditPrio(task);
        renderEditSubtasks(task.subtask);
    } else {
        console.error('One or more input fields not found.');
    }
};

function renderEditAssignTo(task) {
    let assignToContainer = document.getElementById('edit-selectedAssignTo');
    assignToContainer.innerHTML = ''; // Clear previous content

    task.assignto.forEach((name, index) => {
        let nameParts = name.split(' ');
        let firstInitial = nameParts[0].charAt(0).toUpperCase();
        let lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
        let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

        assignToContainer.innerHTML += /*html*/ `
                <button id="${name}" class="shortname" style="background-color: ${randomColor};"><span>${firstInitial}${lastInitial}</span></button>
            `;

        if (index < task.assignto.length - 1) {
            assignToContainer.innerHTML += '';
        }
    });
};

function renderEditPrio(task) {
    // Set priority buttons based on task.priority
    switch (task.prio) {
        case 'urgent':
            editUrgentButton(); // Aktiviere den Urgent Button
            break;
        case 'medium':
            editMediumButton(); // Aktiviere den Medium Button
            break;
        case 'low':
            editLowButton(); // Aktiviere den Low Button
            break;
        default:
            // Reset all buttons if no priority matches
            editResetButtonStyles(); // Setze alle Buttons zurück
            break;
    }
};

function renderEditSubtasks(subtaskData) {
    let subtasksContainer = document.getElementById('edit-addsubtasks');

    if (subtasksContainer && subtaskData) {
        subtasksContainer.innerHTML = ''; // Clear existing subtasks

        Object.keys(subtaskData).forEach(key => {
            let subtask = subtaskData[key];

            subtasksContainer.innerHTML += `
                <div class="addedtask" id="edit-addedtask${key}">
                    <span class="edit-subtask-title">${subtask.Titel}</span>
                    <div class="subtask-buttons">
                        <button onclick="editSubtask('${key}')"><img src="./assets/img/edit.png" alt=""></button>
                        <img src="./assets/img/separator.png" alt="">
                        <button onclick="deleteSubtask('${key}')"><img src="./assets/img/delete.png" alt=""></button>
                    </div>
                </div>`;
        });
    }
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
 * Closes the dialog by adding the 'd_none' class.
 */
function closeDialogEdit() {
    let dialog = document.getElementById('edit-dialog');
    let dialogslide = document.getElementById('edit_task_dialog_content');
    dialogslide.classList.add('slide-out-right');
    setTimeout(() => {
        dialogslide.classList.remove('slide-in-right')
        dialogslide.classList.remove('slide-out-right');
        dialog.classList.add('edit-d_none');
    }, 300);
    console.log(currentTaskId);
    showPopup(currentTaskId);
};

/**
 * Loads names and categories for adding a new task asynchronously when the page loads.
 */
async function editAddTaskLoadNames() {
    try {
        let response = await fetch(BASE_URL + ".json");
        let data = await response.json();
        let sortedKeys = Object.keys(data.names).sort((a, b) => {
            let firstNameA = data.names[a].name.split(' ')[0].toUpperCase();
            let firstNameB = data.names[b].name.split(' ')[0].toUpperCase();
            return firstNameA.localeCompare(firstNameB);
        });

        editRenderAddTaskNames(sortedKeys, data.names);
        editRenderAddTaskCategories(data.category);
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

/**
 * Generates HTML for displaying a name with a color-coded short name and a checkbox.
 * @param {string} nameKey - The key of the name.
 * @param {string} name - The name.
 * @param {string} firstInitial - The first initial of the first name.
 * @param {string} lastInitial - The first initial of the last name.
 * @param {number} id - The ID for the HTML element.
 * @returns {string} The generated HTML.
 */
function editGenerateNameHTML(nameKey, name, firstInitial, lastInitial) {
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return /*html*/ `
        <div class="dropdown_selection" onclick="editDropdownSelectAssignTo(this)">
            <button class="shortname" style="background-color: ${randomColor};"><span>${firstInitial}${lastInitial}</span></button><span id="editassignname_${nameKey}">${name}</span>
            <input class="checkbox" type="checkbox" id="editassignedto_${nameKey}" data-initials="${firstInitial}${lastInitial}" data-color="${randomColor}" onchange="editLoadSelectedAssignTo()">
        </div>
    `;
};

/**
 * Generates the HTML for names, including initials.
 * @param {Array} sortedKeys - The sorted array of name keys.
 * @param {Object} names - The object containing the names.
 * @returns {string} The generated HTML for the names.
 */
function editRenderNamesHTML(sortedKeys, names) {
    let namesHTML = '';
    let id = 0;

    for (let key of sortedKeys) {
        if (names.hasOwnProperty(key)) {
            let nameObj = names[key];
            let name = nameObj.name;
            let nameParts = name.split(' ');
            let firstInitial = nameParts[0].charAt(0).toUpperCase();
            let lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
            namesHTML += editGenerateNameHTML(key, name, firstInitial, lastInitial, id++);
        }
    }
    return namesHTML;
};

/**
 * Renders names HTML to the DOM.
 * @param {string} namesHTML - The HTML representing names to be rendered.
 */
function editRenderNamesToDOM(namesHTML) {
    let namesContainer = document.getElementById("edit-assignedto");
    namesContainer.innerHTML = namesHTML;
};

/**
 * Renders names for adding a new task to the DOM.
 * @param {Array} sortedKeys - The sorted array of name keys.
 * @param {Object} names - An object containing names.
 */
function editRenderAddTaskNames(sortedKeys, names) {
    let namesHTML = editRenderNamesHTML(sortedKeys, names);
    editRenderNamesToDOM(namesHTML);
};

/**
 * Toggles the visibility of the assign-to selection container.
 * If the container is currently visible, hides it; otherwise, shows it.
 */
function editSelectAssignTo() {
    let assignToContainer = document.getElementById('edit-assignedto');
    let assignToInput = document.getElementById('edit-assignedtoinput');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
        assignToInput.style.backgroundImage = 'url(./assets/img/arrow_drop.png)';
    } else {
        assignToContainer.style.display = 'block';
        assignToInput.style.backgroundImage = 'url(./assets/img/arrow_drop_down.png)';
    }
};

/**
 * Closes the assignto dropdown menu if it is currently open.
 */
function editCloseAssignTo() {
    let assignToContainer = document.getElementById('edit-assignedto');
    let assignToInput = document.getElementById('edit-assignedtoinput');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
    }
    assignToInput.style.backgroundImage = 'url(./assets/img/arrow_drop.png)';
};

/**
 * Creates a button for a selected checkbox.
 * @param {Element} checkbox - The checkbox element.
 * @param {number} position - The left position of the button.
 */
function editCreateButton(checkbox, position) {
    let initials = checkbox.getAttribute("data-initials");
    let color = checkbox.getAttribute("data-color");
    let checkboxId = checkbox.id;
    let button = document.createElement("button");
    button.className = "selectedAssignTo";
    button.id = `edit-selected_${checkboxId}`;
    button.style.backgroundColor = color;
    button.style.left = `${position}px`;
    button.innerText = initials;
    return button;
};

/**
 * Adds a "more" button indicating the number of additional selected checkboxes.
 * @param {number} count - The total number of selected checkboxes.
 * @param {number} position - The left position of the "more" button.
 */
function editAddMoreButton(count, position) {
    let moreButton = document.createElement("button");
    moreButton.className = "moreButton";
    moreButton.style.left = `${position}px`;
    moreButton.innerText = `+${count}`;
    return moreButton;
};

/**
 * Updates the selectedAssignTo div with buttons representing the selected names.
 * This function goes through all checkboxes with the class "checkbox" and, if checked,
 * creates a button with the initials and color associated with the checkbox.
 */
function editLoadSelectedAssignTo() {
    let selectedAssignToDiv = document.getElementById("edit-selectedAssignTo");
    let checkboxes = document.querySelectorAll("#edit-assignedto .checkbox");
    let buttonContainer = document.getElementById("edit-selectedAssignTo")

    selectedAssignToDiv.innerHTML = '';
    let position = 0;
    let count = 0;

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            count++;
            if (count <= 3) {
                let button = editCreateButton(checkbox, position);
                selectedAssignToDiv.appendChild(button);
                position += 12; // Adjust this value to control the overlap
                buttonContainer.style.display = 'inline-block'
            }
        }
    });

    if (count > 3) {
        let moreButton = editAddMoreButton(count - 3, position);
        selectedAssignToDiv.appendChild(moreButton);
    }
    if (count === 0) {
        buttonContainer.style.display = 'none'
    }
};

/**
 * Toggles the "selected_dropdown" class on the given element and toggles the associated checkbox state.
 * If the element is within the "assignedto" container, it updates the checkbox state and reloads the selected names.
 * 
 * @param {HTMLElement} element - The dropdown element that was clicked.
 */
function editDropdownSelectAssignTo(element) {
    element.classList.toggle("selected_dropdown");
    if (element.closest("#edit-assignedto")) {
        let checkbox = element.querySelector(".checkbox");

        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            editLoadSelectedAssignTo();
        }
    }
};

/**
 * Renders categories for adding a new task to the DOM.
 * @param {Object} categories - An object containing categories.
 */
function editRenderAddTaskCategories(categories) {
    let categoryContainer = document.getElementById("edit-taskcategory");
    categoryContainer.innerHTML = '';

    for (let categoryKey in categories) {
        if (categories.hasOwnProperty(categoryKey)) {
            let category = categories[categoryKey];
            let categoryId = categoryKey;
            categoryContainer.innerHTML += /*html*/ `
            <div class="dropdown_selection" onclick="editDropdownSelectCategory(this)">
                <label class="label" id="${categoryId}">${category.task}
                <input class="checkbox" type="checkbox" id="edit-category_${categoryId}"></label>
            </div>
            `;
        }
    }
};

/**
 * Toggles the "selected_dropdown" class on the given element and toggles the associated checkbox state.
 * Ensures that only one checkbox within the "taskcategory" container can be selected at a time.
 * If the element is within the "taskcategory" container, it updates the checkbox state and loads the selected category into the input field.
 * 
 * @param {HTMLElement} element - The dropdown element that was clicked.
 */
function editDropdownSelectCategory(element) {
    if (element.closest("#edit-taskcategory")) {
        let categoryContainer = document.getElementById("edit-taskcategory");
        let checkboxes = categoryContainer.querySelectorAll(".checkbox");

        let clickedCheckbox = element.querySelector(".checkbox");
        let isChecked = clickedCheckbox.checked;

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest(".dropdown_selection").classList.remove("selected_dropdown");
            editCloseSelectCategory();
        });

        clickedCheckbox.checked = !isChecked;
        if (clickedCheckbox.checked) {
            element.classList.add("selected_dropdown");
        } else {
            element.classList.remove("selected_dropdown");
        }

        editLoadToCategoryInput();
    }
};

/**
 * Loads the selected category into the category input field.
 * This function finds the checked checkbox in the taskcategory container and updates
 * the taskcategory input field with the corresponding category label.
 */
function editLoadToCategoryInput() {
    let categoryContainer = document.getElementById("edit-taskcategory");
    let categoryInput = document.getElementById("edit-taskcategoryinput");
    let checkboxes = categoryContainer.querySelectorAll(".checkbox");

    categoryInput.value = '';

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            let labelElement = checkbox.closest(".dropdown_selection").querySelector(".label");
            if (labelElement) {
                categoryInput.value = labelElement.innerText;
            }
            break;
        }
    }
};

/**
 * Toggles the visibility of the category selection container.
 * If the container is currently visible, hides it; otherwise, shows it.
 */
function editSelectCategory() {
    let categoryContainer = document.getElementById('edit-taskcategory');
    let taskcategoryInput = document.getElementById('edit-taskcategoryinput');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
        taskcategoryInput.style.backgroundImage = 'url(./assets/img/arrow_drop.png)';
    } else {
        categoryContainer.style.display = 'block';
        taskcategoryInput.style.backgroundImage = 'url(./assets/img/arrow_drop_down.png)';
    }
};

/**
 * Closes the category dropdown menu if it is currently open.
 */
function editCloseSelectCategory() {
    let categoryContainer = document.getElementById('edit-taskcategory');
    let taskcategoryInput = document.getElementById('edit-taskcategoryinput');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
    }
    taskcategoryInput.style.backgroundImage = 'url(./assets/img/arrow_drop.png)';
};

/**
 * Filters categories based on the entered text and updates the display.
 * @param {string} searchText - The entered text for filtering the categories.
 */
function editFilterCategories(searchText) {
    let categoryContainer = document.getElementById("edit-taskcategory");
    let categories = categoryContainer.querySelectorAll(".dropdown_selection");

    categories.forEach(category => {
        let label = category.querySelector(".label");
        let categoryName = label.innerText.toLowerCase();
        if (categoryName.includes(searchText.toLowerCase())) {
            category.style.display = "flex";
        } else {
            category.style.display = "none";
        }
    });
};

/**
 * Event handler for input in the category input field.
 */
function editHandleCategoryInput() {
    let searchInput = document.getElementById("edit-taskcategoryinput");
    let searchText = searchInput.value.trim();
    editFilterCategories(searchText);
};

/**
 * Prevents event propagation.
 * @param {Event} event - The event object.
 */
function editCloseOnBackground(event) {
    event.stopPropagation();
};

/**
 * Sets the minimum date of the date input field to today's date.
 */
function editSetDateRestriction() {
    let today = new Date();
    let formattedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let dateField = document.getElementById("edit-duedate");
    dateField.min = formattedDate;
};

/**
 * Resets the background color, text color, and image of the given button to default values.
 * @param {HTMLElement} button - The HTML element of the button whose styles are to be reset.
 */
function editResetButtonStyles(button) {
    button.style.background = '';
    button.style.color = '';

};

/**
 * Sets the active state for the given button.
 * If the button is already active, resets its styles and clears the active state.
 * If the button is not active, sets its styles to the active state.
 * @param {HTMLElement} button - The HTML element of the button to set as active.
 */
function editSetActiveButton(button) {
    if (activeButton === button) {
        editResetButtonStyles(button);
        activeButton = null; // Reset the active button
    } else {
        // When clicking on a different button
        if (activeButton) {
            editResetButtonStyles(activeButton); // Reset the previously active button
        }

        activeButton = button;
    }
};

/**
 * Sets the styles and active state for the urgent button.
 */
function editUrgentButton() {
    let urgentButton = document.getElementById('edit-urgent');
    urgentButton.innerHTML = '';
    urgentButton.innerHTML += `Urgent <img src="./assets/img/prio_alta_white.png" alt="">`;
    urgentButton.style.background = buttonColors.urgent.background;
    urgentButton.style.color = buttonColors.urgent.color;
    // Set the low button as active
    editSetActiveButton(urgentButton);
};

/**
 * Sets the styles and active state for the medium button.
 */
function editMediumButton() {
    let mediumButton = document.getElementById('edit-medium');
    mediumButton.innerHTML = '';
    mediumButton.innerHTML += `Medium <img src="./assets/img/prio_media_white.png" alt="">`;
    mediumButton.style.background = buttonColors.medium.background;
    mediumButton.style.color = buttonColors.medium.color;
    editSetActiveButton(mediumButton);
};

/**
 * Sets the styles and active state for the low button.
 */
function editLowButton() {
    let lowButton = document.getElementById('edit-low');
    lowButton.innerHTML = '';
    lowButton.innerHTML += `Low <img src="./assets/img/prio_baja_white.png" alt="">`;
    lowButton.style.background = buttonColors.low.background;
    lowButton.style.color = buttonColors.low.color;
    editSetActiveButton(lowButton);
};

/**
 * Opens the subtask field for adding a new subtask.
 */
function editOpenAddSubtaskField() {
    let addSubtaskField = document.getElementById('edit-addsubtask');
    let subtaskField = document.getElementById('edit-subtask');
    addSubtaskField.style.display = 'none';
    subtaskField.style.display = 'block';

    // Set the focus on the specific input field by ID
    let inputField = document.getElementById('edit-subtask');
    if (inputField) {
        inputField.focus();
    }
};

/**
 * Closes the subtask field.
 */
function editCloseAddSubtaskField() {
    let addSubtaskField = document.getElementById('edit-addsubtask');
    let subtaskField = document.getElementById('edit-subtask');
    addSubtaskField.style.display = 'block';
    subtaskField.style.display = 'none';
    subtaskField.value = "";
};

/**
 * Handles click events on the subtask field.
 * Determines whether to close the field or add a subtask based on the clicked area.
 * @param {MouseEvent} event - The click event object.
 */
function editHandleSubtaskClick(event) {
    let input = document.getElementById("edit-subtask");
    let clickX = event.clientX;
    let inputRight = input.getBoundingClientRect().right;

    // Check if the click is within the area of the close.png image (rightmost 28px)
    if (clickX >= inputRight - 28) {
        editAddSubtask();
    }
    // Check if the click is within the area of the check_black.png image (next 28px from right)
    else if (clickX >= inputRight - 56 && clickX < inputRight - 28) {
        editCloseAddSubtaskField();
    }
};

/**
 * Handles the Enter key press to add a subtask.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function editCheckEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default form submission behavior
        editAddSubtask();
    }
};

/**
 * Handles adding a subtask when the user clicks on the appropriate area.
 * Retrieves the input content from the subtask field, creates a new list item element,
 * sets its content and attributes, appends it to the list of subtasks, and closes the subtask field.
 */
function editAddSubtask() {
    let input = document.getElementById("edit-subtask");
    let inputContent = input.value.trim();

    if (inputContent !== "") {
        let subtasksContainer = document.getElementById("edit-addsubtasks");
        subtasksContainer.classList.add("subtaskblock");

        // Create unique ID for the subtask
        let subtaskId = "subtask" + subtaskCounter;
        subtaskCounter++;

        // Create HTML for the new subtask
        let newSubtaskHTML = `
            <div class="addedtask" id="edit-addedtask${subtaskId}">
                <span class="edit-subtask-title">${inputContent}</span>
                <div class="subtask-buttons">
                    <button onclick="editSubtask('${subtaskId}')"><img src="./assets/img/edit.png" alt=""></button>
                    <img src="./assets/img/separator.png" alt="">
                    <button onclick="deleteSubtask('${subtaskId}')"><img src="./assets/img/delete.png" alt=""></button>
                </div>
            </div>`;

        // Append new subtask HTML to the subtasks container
        subtasksContainer.innerHTML += newSubtaskHTML;

        // Clear input field
        input.value = "";
    }

    return false;
}


/**
 * Enables editing of the specific subtask.
 * @param {string} subtaskId - The ID of the subtask to be edited.
 */
function editEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        let currentText = subtaskElement.innerText;
        document.getElementById('edit-subtask-buttons').style.display = 'none';
        document.getElementById(`${subtaskId}`).style.paddingLeft = '0';
        subtaskElement.innerHTML = /*html*/`
        <input onclick = "editSaveEditedSubtask('${subtaskId}', event)" class="edit-subtask" type="text" id="${subtaskId}-edit" value="${currentText}">
        `;
    }
};

/**
 * Saves the edited subtask content.
 * @param {string} subtaskId - The ID of the subtask to be saved.
 * @param {Event} event - The blur event.
 */
function editSaveEditedSubtask(subtaskId, event) {
    let input = document.getElementById(subtaskId + '-edit');
    let inputRect = input.getBoundingClientRect();
    let clickX = event.clientX - inputRect.left; // Mouse click position relative to the input field
    let deleteIconLeft = inputRect.width - 16; // Left position of the delete icon (assuming width is 16px)
    let checkIconLeft = deleteIconLeft - 34; // Assuming check icon is 34px to the left of the delete icon

    if (clickX >= deleteIconLeft - 2) {
        editDeleteSubtask(subtaskId);
    } else if (clickX >= checkIconLeft - 2 && clickX < deleteIconLeft - 18) {
        let newContent = input.value.trim();
        if (newContent !== "") {
            document.getElementById(subtaskId).innerHTML = newContent;
            document.getElementById('edit-subtask-buttons').style.display = 'flex';
            document.getElementById(`${subtaskId}`).style.padding = '10px';
        } else {
            editDeleteSubtask(subtaskId);
        }
    }
};

/**
 * Deletes a subtask and its associated elements from the DOM.
 *
 * @param {string} subtaskId - The ID of the subtask to delete.
 */
function editDeleteSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let addedTaskSubtask = document.getElementById(`edit-addedtask${subtaskId}`);

    if (subtaskElement) {
        subtaskElement.remove();
    }

    if (addedTaskSubtask) {
        addedTaskSubtask.remove();
    }

    let subtasks = document.getElementById("edit-addsubtasks");
    if (subtasks && subtasks.children.length === 0) {
        subtasks.classList.remove("subtaskblock");
        let addedTaskElement = document.getElementById('edit-addedtask');
        if (addedTaskElement) {
            addedTaskElement.style.display = 'none';
        }
    }
};

/**
 * Retrieves assigned users based on checkbox selection.
 * @returns {string[]} An array of assigned users.
 */
function editGetAssignedTo() {
    let assignedToCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="editassignedto_"]:checked');
    let assignedTo = [];

    assignedToCheckboxes.forEach((checkbox) => {
        // Splitting the ID to get the key parts
        let idParts = checkbox.id.split('_');

        // Handling cases with IDs like -O-2Vl5jkNUBw8YFvq0O
        if (idParts.length >= 3) {
            let nameSpan = document.getElementById(`editassignname_${idParts[1]}_${idParts.slice(2).join('_')}`);
            if (nameSpan) {
                assignedTo.push(nameSpan.innerText.trim());
            }
        } else if (idParts.length === 2) {
            // Handling simpler ID cases, e.g., assignedto_<key>
            let nameSpan = document.getElementById(`editassignname_${idParts[1]}`);
            if (nameSpan) {
                assignedTo.push(nameSpan.innerText.trim());
            }
        }
    });

    console.log(`Assigned to (final): ${assignedTo}`);
    return assignedTo;
};

function getUpdatedTaskData() {
    let titleInput = document.getElementById('edit-tasktitle').value;
    let descriptionInput = document.getElementById('edit-description').value;
    let duedateInput = document.getElementById('edit-duedate').value;
    let categoryInput = document.getElementById('edit-taskcategoryinput').value;

    // Collect subtasks from the DOM
    let subtasks = [...document.querySelectorAll('#edit-addsubtasks .edit-subtask-title')].map(span => ({ Titel: span.innerText }));

    let prio = null;
    let assignto = editGetAssignedTo(); // Call editGetAssignedTo to get assigned users

    if (activeButton) {
        switch (activeButton.id) {
            case 'edit-urgent':
                prio = 'urgent';
                break;
            case 'edit-medium':
                prio = 'medium';
                break;
            case 'edit-low':
                prio = 'low';
                break;
            default:
                prio = null;
                break;
        }
    }

    return {
        title: titleInput,
        description: descriptionInput,
        duedate: duedateInput,
        category: categoryInput,
        prio: prio,
        subtask: subtasks,
        assignto: assignto // Include assigned users in the returned object
    };
}



async function saveUpdatedTask(taskid) {
    console.log('Task ID in saveUpdatedTask:', taskid);

    let updatedData = getUpdatedTaskData(); // Get updated data including assigned users
    let result = await updateTask(taskid, updatedData);
    console.log('Updated task:', result, taskid);
}

async function updateTask(taskid, updatedData) {
    try {
        let response = await fetch(`${BASE_URL}tasks/${taskid}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error updating data:", error);
    }
}



async function handleSaveButtonClicked() {
    let taskid = getCurrentTaskId(); // Hier taskid holen, möglicherweise async
    if (!taskid) {
        console.error('Keine gültige Task-ID gefunden.');
        alert('Fehler: Keine gültige Task-ID gefunden.');
        return;
    }
    await saveUpdatedTask(taskid); // Hier saveUpdatedTask mit taskid aufrufen
    displayTasks();
    closeDialogEdit();

}

async function saveUpdatedTask(taskid) {
    console.log('Task ID in saveUpdatedTask:', taskid); // Überprüfe die taskid hier

    let updatedData = getUpdatedTaskData(taskid);
    let result = await updateTask(taskid, updatedData);
    console.log('Updated task:', result, taskid);
}

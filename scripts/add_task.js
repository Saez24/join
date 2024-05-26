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
 * Loads names and categories for adding a new task asynchronously when the page loads.
 */
async function addTaskLoadNames() {
    try {
        let response = await fetch(BASE_URL + ".json");
        let data = await response.json();
        renderAddTaskNames(data.names);
        renderAddTaskCategories(data.category);
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
function generateNameHTML(nameKey, name, firstInitial, lastInitial, id) {
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return /*html*/ `
        <div class="dropdown_selection" onclick="dropdownSelectAssignTo(this)">
            <button class="shortname" style="background-color: ${randomColor};"><span>${firstInitial}${lastInitial}</span></button><span id="assignname_${nameKey}_${id}">${name}</span>
            <input class="checkbox" type="checkbox" id="assignedto_${nameKey}_${id}" data-initials="${firstInitial}${lastInitial}" data-color="${randomColor}" onchange="loadSelectedAssignTo()">

        </div>
    `;
};

/**
 * Generates the HTML for names, including initials.
 * @param {Object} names - The object containing the names.
 * @returns {string} The generated HTML for the names.
 */
function renderNamesHTML(names) {
    let namesHTML = '';
    let id = 0;

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
};

/**
 * Renders names HTML to the DOM.
 * @param {string} namesHTML - The HTML representing names to be rendered.
 */
function renderNamesToDOM(namesHTML) {
    let namesContainer = document.getElementById("assignedto");
    namesContainer.innerHTML = namesHTML;
};

/**
 * Renders names for adding a new task to the DOM.
 * @param {Object} names - An object containing names.
 */
function renderAddTaskNames(names) {
    let namesHTML = renderNamesHTML(names);
    renderNamesToDOM(namesHTML);
};

/**
 * Toggles the visibility of the assign-to selection container.
 * If the container is currently visible, hides it; otherwise, shows it.
 */
function selectAssignTo() {
    let assignToContainer = document.getElementById('assignedto');
    let assignToInput = document.getElementById('assignedtoinput');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
        assignToInput.style.backgroundImage = 'url(../assets/img/arrow_drop.png)';
    } else {
        assignToContainer.style.display = 'block';
        assignToInput.style.backgroundImage = 'url(../assets/img/arrow_drop_down.png)';
    }
};

/**
 * Closes the assignto dropdown menu if it is currently open.
 */
function closeAssignTo() {
    let assignToContainer = document.getElementById('assignedto');
    let assignToInput = document.getElementById('assignedtoinput');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
    }
    assignToInput.style.backgroundImage = 'url(../assets/img/arrow_drop.png)';
};

/**
 * Updates the selectedAssignTo div with buttons representing the selected names.
 * This function goes through all checkboxes with the class "checkbox" and, if checked,
 * creates a button with the initials and color associated with the checkbox.
 */
function loadSelectedAssignTo() {
    let selectedAssignToDiv = document.getElementById("selectedAssignTo");
    let checkboxes = document.querySelectorAll("#assignedto .checkbox");

    selectedAssignToDiv.innerHTML = '';
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let initials = checkbox.getAttribute("data-initials");
            let color = checkbox.getAttribute("data-color");
            let checkboxId = checkbox.id;

            let button = document.createElement("button");
            button.className = "selectedAssignTo";
            button.id = `selected_${checkboxId}`;
            button.style.backgroundColor = color;
            button.innerText = initials;
            selectedAssignToDiv.appendChild(button);
        }
    });
};

/**
 * Toggles the "selected_dropdown" class on the given element and toggles the associated checkbox state.
 * If the element is within the "assignedto" container, it updates the checkbox state and reloads the selected names.
 * 
 * @param {HTMLElement} element - The dropdown element that was clicked.
 */
function dropdownSelectAssignTo(element) {
    element.classList.toggle("selected_dropdown");
    if (element.closest("#assignedto")) {
        let checkbox = element.querySelector(".checkbox");

        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            loadSelectedAssignTo();
        }
    }
};

/**
 * Renders categories for adding a new task to the DOM.
 * @param {Object} categories - An object containing categories.
 */
function renderAddTaskCategories(categories) {
    let categoryContainer = document.getElementById("taskcategory");
    categoryContainer.innerHTML = '';

    for (let categoryKey in categories) {
        if (categories.hasOwnProperty(categoryKey)) {
            let category = categories[categoryKey];
            let categoryId = categoryKey; // Use a unique key as id
            categoryContainer.innerHTML += /*html*/ `
            <div class="dropdown_selection" onclick="dropdownSelectCategory(this)">
                <label class="label">${category.task}</label>
                <input class="checkbox" type="checkbox" id="category_${categoryId}">
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
function dropdownSelectCategory(element) {
    if (element.closest("#taskcategory")) {
        const categoryContainer = document.getElementById("taskcategory");
        const checkboxes = categoryContainer.querySelectorAll(".checkbox");

        const clickedCheckbox = element.querySelector(".checkbox");
        const isChecked = clickedCheckbox.checked;

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest(".dropdown_selection").classList.remove("selected_dropdown");
        });

        clickedCheckbox.checked = !isChecked;
        if (clickedCheckbox.checked) {
            element.classList.add("selected_dropdown");
        } else {
            element.classList.remove("selected_dropdown");
        }

        loadToCategoryInput();
    }
};

/**
 * Loads the selected category into the category input field.
 * This function finds the checked checkbox in the taskcategory container and updates
 * the taskcategory input field with the corresponding category label.
 */
function loadToCategoryInput() {
    const categoryContainer = document.getElementById("taskcategory");
    const categoryInput = document.getElementById("taskcategoryinput");
    const checkboxes = categoryContainer.querySelectorAll(".checkbox");

    categoryInput.value = '';

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            const labelElement = checkbox.closest(".dropdown_selection").querySelector(".label");
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
function selectCategory() {
    let categoryContainer = document.getElementById('taskcategory');
    let taskcategoryInput = document.getElementById('taskcategoryinput');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
        taskcategoryInput.style.backgroundImage = 'url(../assets/img/arrow_drop.png)';
    } else {
        categoryContainer.style.display = 'block';
        taskcategoryInput.style.backgroundImage = 'url(../assets/img/arrow_drop_down.png)';
    }
};

/**
 * Closes the category dropdown menu if it is currently open.
 */
function closeSelectCategory() {
    let categoryContainer = document.getElementById('taskcategory');
    let taskcategoryInput = document.getElementById('taskcategoryinput');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
    }
    taskcategoryInput.style.backgroundImage = 'url(../assets/img/arrow_drop.png)';
};

/**
 * Filters categories based on the entered text and updates the display.
 * @param {string} searchText - The entered text for filtering the categories.
 */
function filterCategories(searchText) {
    const categoryContainer = document.getElementById("taskcategory");
    const categories = categoryContainer.querySelectorAll(".dropdown_selection");

    categories.forEach(category => {
        const label = category.querySelector(".label");
        const categoryName = label.innerText.toLowerCase();
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
function handleCategoryInput() {
    const searchInput = document.getElementById("taskcategoryinput");
    const searchText = searchInput.value.trim();
    filterCategories(searchText);
};

/**
 * Prevents event propagation.
 * @param {Event} event - The event object.
 */
function closeOnBackground(event) {
    event.stopPropagation();
};

/**
 * Sets the minimum date of the date input field to today's date.
 */
function setDateRestriction() {
    let today = new Date();
    let formattedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let dateField = document.getElementById("duedate");
    dateField.min = formattedDate;
};

/**
 * Resets the background color, text color, and image of the given button to default values.
 * @param {HTMLElement} button - The HTML element of the button whose styles are to be reset.
 */
function resetButtonStyles(button) {
    button.style.background = '';
    button.style.color = '';
    button.querySelector('img').src = buttonImages[button.id];
};

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
};

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
};

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
};

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
};

/**
 * Renders categories for adding a new task to the DOM.
 * @param {Object} categories - An object containing categories.
 */

/**
 * Opens the subtask field for adding a new subtask.
 */
function openAddSubtaskField() {
    let addSubtaskField = document.getElementById('addsubtask');
    let subtaskField = document.getElementById('subtask');
    addSubtaskField.style.display = 'none';
    subtaskField.style.display = 'block';
};

/**
 * Closes the subtask field.
 */
function closeAddSubtaskField() {
    let addSubtaskField = document.getElementById('addsubtask');
    let subtaskField = document.getElementById('subtask');
    addSubtaskField.style.display = 'block';
    subtaskField.style.display = 'none';
};

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
};

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
        <div class="addedtask" id="addedtask${subtaskId}">
            <span class="${subtaskId}" id="${subtaskId}">${inputContent}</span>
            <div id="subtask-buttons" class="subtask-buttons">
                <button onclick="editSubtask('${subtaskId}')" ><img src="./assets/img/edit.png" alt=""></button>
                <img src="./assets/img/separator.png" alt="">
                <button onclick="deleteSubtask('${subtaskId}')"><img src="./assets/img/delete.png" alt=""></button>
            </div>
        </div>`;
        closeAddSubtaskField();
    }
    input.value = "";
};

/**
 * Enables editing of the specific subtask.
 * @param {string} subtaskId - The ID of the subtask to be edited.
 */
function editSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        let currentText = subtaskElement.innerText;
        document.getElementById('subtask-buttons').style.display = 'none';
        document.getElementById(`${subtaskId}`).style.paddingLeft = '0';
        subtaskElement.innerHTML = /*html*/`
        <input onclick = "saveEditedSubtask('${subtaskId}', event)" class="edit-subtask" type="text" id="${subtaskId}-edit" value="${currentText}">
        `;
    }
};

/**
 * Saves the edited subtask content.
 * @param {string} subtaskId - The ID of the subtask to be saved.
 * @param {Event} event - The blur event.
 */
function saveEditedSubtask(subtaskId, event) {
    let input = document.getElementById(subtaskId + '-edit');
    let inputRect = input.getBoundingClientRect();
    let clickX = event.clientX - inputRect.left; // Mouse click position relative to the input field
    let deleteIconLeft = inputRect.width - 16; // Left position of the delete icon (assuming width is 16px)
    let checkIconLeft = deleteIconLeft - 34; // Assuming check icon is 34px to the left of the delete icon

    if (clickX >= deleteIconLeft - 2) {
        deleteSubtask(subtaskId);
    } else if (clickX >= checkIconLeft - 2 && clickX < deleteIconLeft - 18) {
        let newContent = input.value.trim();
        if (newContent !== "") {
            document.getElementById(subtaskId).innerHTML = newContent;
            document.getElementById('subtask-buttons').style.display = 'flex';
            document.getElementById(`${subtaskId}`).style.padding = '10px';
        } else {
            deleteSubtask(subtaskId);
        }
    }
};

/**
 * Deletes a subtask and its associated elements from the DOM.
 *
 * @param {string} subtaskId - The ID of the subtask to delete.
 */
function deleteSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let addedTaskSubtask = document.getElementById(`addedtask${subtaskId}`);

    if (subtaskElement) {
        subtaskElement.remove();
    }

    if (addedTaskSubtask) {
        addedTaskSubtask.remove();
    }

    let subtasks = document.getElementById("addsubtasks");
    if (subtasks && subtasks.children.length === 0) {
        subtasks.classList.remove("subtaskblock");
        let addedTaskElement = document.getElementById('addedtask');
        if (addedTaskElement) {
            addedTaskElement.style.display = 'none';
        }
    }
};

/**
 * Clears the content.
 */
function clearContent() {
    let inputs = document.getElementsByTagName("input");
    let textareas = document.getElementsByTagName("textarea");
    let assignedto = document.getElementById("selectedAssignTo");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "text" || inputs[i].type === "date") {
            inputs[i].value = "";
        } else if (inputs[i].type === "checkbox") {
            inputs[i].checked = false; // Setze Checkboxen zurück
        }
    }

    for (let j = 0; j < textareas.length; j++) {
        textareas[j].value = "";
    }

    assignedto.innerHTML = "";

    let dropdownSelections = document.getElementsByClassName("dropdown_selection");
    for (let k = 0; k < dropdownSelections.length; k++) {
        dropdownSelections[k].classList.remove("selected_dropdown");
    }
    mediumButton();
};
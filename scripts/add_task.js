const BASE_URL = "https://remotestorage-b0ea0-default-rtdb.europe-west1.firebasedatabase.app/"
var names
var category
var id = 0;
var counter = 0;
var activeButton = null;

const buttonImages = {
    urgent: './assets/img/prio_alta.png',
    medium: './assets/img/prio_media.png',
    low: './assets/img/prio_baja.png'
};

const buttonNames = {
    urgent: 'Urgent',
    medium: 'Medium',
    low: 'Low'
};

const buttonColors = {
    urgent: { background: '#FF3D00', color: '#FFFFFF' },
    medium: { background: '#FFA800', color: '#FFFFFF' },
    low: { background: '#7AE229', color: '#FFFFFF' }
};

function resetButtonStyles(button) {
    button.style.background = '';
    button.style.color = '';
    button.querySelector('img').src = buttonImages[button.id];
}

function setActiveButton(button) {
    if (activeButton === button) {
        // Bei einem Klick auf denselben Button
        resetButtonStyles(button);
        activeButton = null; // Setze den aktiven Button zurück
    } else {
        // Bei einem Klick auf einen anderen Button
        if (activeButton) {
            resetButtonStyles(activeButton); // Setze den vorherigen aktiven Button zurück
        }
        button.style.background = buttonColors[button.id].background;
        button.style.color = buttonColors[button.id].color;
        activeButton = button;
    }
}

function urgentButton() {
    let urgentButton = document.getElementById('urgent');
    urgentButton.innerHTML = '';
    urgentButton.innerHTML += `Urgend <img src="./assets/img/prio_alta_white.png" alt="">`;
    urgentButton.style.background = buttonColors.urgent.background;
    urgentButton.style.color = buttonColors.urgent.color;
    setActiveButton(urgentButton);
}

function mediumButton() {
    let mediumButton = document.getElementById('medium');
    mediumButton.innerHTML = '';
    mediumButton.innerHTML += `Medium <img src="./assets/img/prio_media_white.png" alt="">`;
    mediumButton.style.background = buttonColors.medium.background;
    mediumButton.style.color = buttonColors.medium.color;
    setActiveButton(mediumButton);
}

function lowButton() {
    let lowButton = document.getElementById('low');
    lowButton.innerHTML = '';
    lowButton.innerHTML += `Low <img src="./assets/img/prio_baja_white.png" alt="">`;
    lowButton.style.background = buttonColors.low.background;
    lowButton.style.color = buttonColors.low.color;
    setActiveButton(lowButton);
}

function openAddSubtaskField() {
    document.getElementById('addsubtask').style.display = 'none';
    document.getElementById('subtask').style.display = 'block';
}

function closeAddSubtaskField() {
    document.getElementById('addsubtask').style.display = 'block';
    document.getElementById('subtask').style.display = 'none';
}

function handleSubtaskClick(event) {
    var input = document.getElementById("subtask");
    var clickX = event.clientX;
    var inputRight = input.getBoundingClientRect().right;

    // Überprüfe, ob der Klick innerhalb des Bereichs des Bilds close.png liegt
    if (clickX >= inputRight - 56 && clickX <= inputRight - 28) {
        closeAddSubtaskField();
    } else {
        // Überprüfe, ob der Klick innerhalb des Bereichs des Bilds check_black.png liegt
        if (clickX >= inputRight - 8) {
            handleSubtaskClickAdd(event);
        }
    }
}

function handleSubtaskClickAdd() {
    var input = document.getElementById("subtask");
    var inputContent = input.value.trim();
    if (inputContent !== "") {
        var ul = document.getElementById("addsubtasks");
        var li = document.createElement("li");
        li.textContent = inputContent;
        li.setAttribute("id", "subtask_" + counter); // Hier wird die fortlaufende ID gesetzt
        li.onclick = function (event) {
            handleSubtaskDelete(event);
        };
        ul.appendChild(li);
        closeAddSubtaskField();
        input.value = "";
        counter++; // Erhöhe den Zähler für die nächste ID
    }
}

function deleteSubtask() {
    var ul = document.getElementById("addsubtasks");
    ul.innerHTML = '';
}

function handleSubtaskDelete(event) {
    var input = document.getElementById("addsubtask");
    var clickX = event.clientX;
    var inputRight = input.getBoundingClientRect().right;

    // Überprüfe, ob der Klick innerhalb des Bereichs des Bilds close.png liegt
    clickX >= inputRight - 8
    deleteSubtask();

}

function selectCategory() {
    var categoryContainer = document.getElementById('taskcategory');
    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
    } else {
        categoryContainer.style.display = 'block';
    }
}

function selectAssingTo() {
    var assignToContainer = document.getElementById('assignedto');
    if (assignToContainer.style.display === 'block') {
        assignToContainer.style.display = 'none';
    } else {
        assignToContainer.style.display = 'block';
    }
}

function dropdownSelect(element) {
    element.classList.toggle("selected_dropdown");
}

function addTaskOnLoad() {
    console.log("test");
    addTaskLoadNames()
}

async function addTaskLoadNames() {
    try {
        let response = await fetch(BASE_URL + ".json");
        let data = await response.json();
        renderAddTaskNames(data.names);
        renderAddTaskCategorys(data.category)
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function generateNameHTML(nameKey, firstname, lastname, id) {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return /*html*/ `
        <div class="dropdown_selection" onclick="dropdownSelect(this)">
            <button class="shortname" style="background-color: ${randomColor};"><span>${nameKey}</span></button><span>${firstname} ${lastname}</span>
            <input class="checkbox" type="checkbox" id="assignedto_${nameKey}_${id}">
        </div>
    `;
}

function renderNamesHTML(names) {
    let namesHTML = '';
    let id = 0;

    for (let nameKey in names) {
        if (names.hasOwnProperty(nameKey)) {
            const name = names[nameKey];
            const firstname = name.firstname;
            const lastname = name.lastname;
            namesHTML += generateNameHTML(nameKey, firstname, lastname, id++);
        }
    }
    return namesHTML;
}

function renderNamesToDOM(namesHTML) {
    let namesContainer = document.getElementById("assignedto");
    namesContainer.innerHTML = namesHTML;
}

function renderAddTaskNames(names) {
    const namesHTML = renderNamesHTML(names);
    renderNamesToDOM(namesHTML);
}

function renderAddTaskCategorys(categories) {
    let categoryContainer = document.getElementById("taskcategory");
    categoryContainer.innerHTML = '';

    for (let categoryKey in categories) {
        if (categories.hasOwnProperty(categoryKey)) {
            const category = categories[categoryKey];
            const categoryId = id++;
            categoryContainer.innerHTML += /*html*/ `
            <div class="dropdown_selection" onclick="dropdownSelect(this)">
                    <label>${category.task}</label>
                    <input class="checkbox" type="checkbox" id="category_${categoryId}">
                </div>
        `;
        }
    }
}

function clearContent() {
    var inputs = document.getElementsByTagName("input");
    var textareas = document.getElementsByTagName("textarea");

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "text" || inputs[i].type === "date") {
            inputs[i].value = "";
        }
    }

    for (var j = 0; j < textareas.length; j++) {
        textareas[j].value = "";
    }
}

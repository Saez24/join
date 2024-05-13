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
        ul.appendChild(li);
        closeAddSubtaskField();
        input.value = "";
        counter++; // Erhöhe den Zähler für die nächste ID
    }
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

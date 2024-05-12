function urgentButton() {
    let urgendButton = document.getElementById('urgent');
    urgendButton.style.background = '#FF3D00';
    urgendButton.style.color = '#FFFFFF';
    urgendButton.innerHTML = '';
    urgendButton.innerHTML += /*html*/`
    Urgend <img src="./assets/img/prio_alta_white.png" alt="">
    `;
}

function mediumButton() {
    let urgendButton = document.getElementById('medium');
    urgendButton.style.background = '#FFA800';
    urgendButton.style.color = '#FFFFFF';
    urgendButton.innerHTML = '';
    urgendButton.innerHTML += /*html*/`
    Medium <img src="./assets/img/prio_media_white.png" alt="">
    `;
}

function lowButton() {
    let urgendButton = document.getElementById('low');
    urgendButton.style.background = '#7AE229';
    urgendButton.style.color = '#FFFFFF';
    urgendButton.innerHTML = '';
    urgendButton.innerHTML += /*html*/`
    Low <img src="./assets/img/prio_baja_white.png" alt="">
    `;
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

function handleSubtaskClickAdd(event) {
    var input = document.getElementById("subtask");
    var inputContent = input.value.trim();
    if (inputContent !== "") {
        var ul = document.getElementById("addsubtasks");
        var li = document.createElement("li");
        li.textContent = inputContent;
        ul.appendChild(li);
        closeAddSubtaskField();
        input.value = "";
    }
}

function addSubtask() {
    var inputContent = document.getElementById("subtask").value;
    if (inputContent.trim() !== "") {
        var ul = document.getElementById("addsubtasks");
        var li = document.createElement("li");
        li.textContent = inputContent;
        ul.appendChild(li);
    }
}


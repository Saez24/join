function addSubtask() {
    document.getElementById('addsubtask').style.display = 'none';
    document.getElementById('aktive-subtask-block').style.display = 'block';
}

function closeAddSubtask() {
    document.getElementById('addsubtask').style.display = 'block';
    document.getElementById('aktive-subtask-block').style.display = 'none';
}

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
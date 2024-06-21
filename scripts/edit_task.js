function openEditTask() {
    const taskId = getCurrentTaskId();
    
    if (!taskId) {
        console.error('Task-ID fehlt');
        return;
    }

    fetch(`${BASE_URL}/tasks/${taskId}.json`)
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

            let content = renderEditTask(task); // Render the task details
            document.getElementById('editTaskOverlay').innerHTML = content;
            document.getElementById('editTaskOverlay').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Fehler beim Laden der Task-Details:', error);
            alert('Fehler beim Laden der Task-Details: ' + error.message);
        });
}


// Funktion zum Schließen des Editierfensters
function closeEditTask() {
    document.getElementById('editTaskOverlay').classList.add('hidden');
}


async function editTask() {
    let taskDetails = getTaskDetails();

    if (!validateTaskDetails(taskDetails) || !validateTaskInputField(taskDetails)) {
        return;
    }

    let assignedTo = getAssignedTo();
    let subtasks = getSubtasks();
    let taskId = getCurrentTaskId(); // Annahme: getCurrentTaskId() gibt die aktuelle Task-ID zurück

    if (!taskId) {
        console.error('Task-ID fehlt');
        return;
    }

    let taskData = {
        ...taskDetails,
        assignto: assignedTo,
        subtask: subtasks,
        status: 'todo'
    };

    try {
        await updateData(`tasks/${taskId}`, taskData);
        clearContent();
        showSuccessfullTaskUpdate();
        setTimeout(() => {
            window.location.href = "board.html";
        }, 1500);
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        alert('Fehler beim Aktualisieren der Aufgabe: ' + error.message);
    }
}

async function updateData(path, data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Aufgabe');
    }
    return await response.json();
}

// Hier einige Hilfsfunktionen zur Vollständigkeit
function getTaskDetails() {
    return {
        title: document.getElementById('HeadlineBox').value || '',
        description: document.getElementById('description').value || '',
        duedate: document.getElementById('duedate').value || '',
        prio: document.querySelector('#priobuttons .active')?.id || 'medium', // Assuming one button has class 'active'
        category: document.getElementById('taskcategoryinput').value || ''
    };
}


function validateTaskDetails(taskDetails) {
    // Validierungslogik hier
    return true;
}

function validateTaskInputField(taskDetails) {
    // Validierungslogik hier
    return true;
}

function getAssignedTo() {
    return document.getElementById('assignedtoinput').value.split(',').map(name => name.trim());
}

function getSubtasks() {
    // Subtask-Logik hier
    return [];
}

function clearContent() {
    // Logik zum Zurücksetzen der Felder hier
}

function showSuccessfullTaskUpdate() {
    // Logik zur Anzeige einer Erfolgsnachricht hier
}



function editTaskSlideOutToRight() {
    document.getElementById('editTaskOverlay').classList.add('hidden');
}

// Funktion zum Anzeigen der Task-Details und Setzen der Task-ID
function showTaskDetails(task) {
    const taskDetailsDialog = document.getElementById('TaskDetailsDialog');
    taskDetailsDialog.setAttribute('data-taskid', task.id);

    // Zeige das Popup
    document.getElementById('popup').classList.remove('hidden');

}


// Funktion, um die aktuelle Task-ID zu holen
function getCurrentTaskId() {
    return document.getElementById('TaskDetailsDialog').getAttribute('data-taskid');
}

function urgentButton() {
    setActivePrioButton('urgent');
}

function mediumButton() {
    setActivePrioButton('medium');
}

function lowButton() {
    setActivePrioButton('low');
}

function setActivePrioButton(prio) {
    document.getElementById('urgent').classList.remove('active');
    document.getElementById('medium').classList.remove('active');
    document.getElementById('low').classList.remove('active');
    document.getElementById(prio).classList.add('active');
}


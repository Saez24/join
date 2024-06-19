function openEditTask() {
    const taskId = getCurrentTaskId();
    
    if (!taskId) {
        console.error('Task-ID fehlt');
        return;
    }

    fetch(`${BASE_URL}tasks/${taskId}.json`)
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


function editTask() {
    const taskId = getCurrentTaskId();
    
    if (!taskId) {
        console.error('Task-ID fehlt');
        return;
    }

    // Get the active priority button, if any
    const activePrioButton = document.getElementById('priobuttons').querySelector('.active');
    const prio = activePrioButton ? activePrioButton.id : 'medium'; // Default to 'medium' if no button is active

    // Get the updated values from the form
    const updatedTask = {
        title: document.getElementById('HeadlineBox').value,
        description: document.getElementById('description').value,
        assignto: document.getElementById('assignedtoinput').value.split(',').map(name => name.trim()),
        duedate: document.getElementById('duedate').value,
        prio: prio,
        status: 'todo' // oder den aktuellen Status der Aufgabe setzen
    };

    fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren der Aufgabe');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('editTaskOverlay').classList.add('hidden');
        console.log('Aufgabe erfolgreich aktualisiert');
        // Hier können Sie zusätzliche Logik hinzufügen, wie das erneute Laden der Aufgabenliste oder die Anzeige einer Erfolgsmeldung
    })
    .catch(error => {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        alert('Fehler beim Aktualisieren der Aufgabe: ' + error.message);
    });
}

// Prio-Button-Handling
document.getElementById('urgent').addEventListener('click', () => setPrio('urgent'));
document.getElementById('medium').addEventListener('click', () => setPrio('medium'));
document.getElementById('low').addEventListener('click', () => setPrio('low'));

function setPrio(prio) {
    document.getElementById('urgent').classList.remove('active');
    document.getElementById('medium').classList.remove('active');
    document.getElementById('low').classList.remove('active');

    document.getElementById(prio).classList.add('active');
}





function getCurrentTaskId() {
    return document.getElementById('TaskDetailsDialog').getAttribute('data-taskid');
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

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
    // Get the task ID from the task details dialog
    const taskId = document.getElementById('TaskDetailsDialog').getAttribute('data-taskid');
    renderEditTask(task);
    // Get the updated values from the form
    const updatedTask = {
        title: document.getElementById('tasktitle').value,
        description: document.getElementById('description').value,
        assignto: document.getElementById('assignedtoinput').value.split(',').map(name => name.trim()),
        duedate: document.getElementById('duedate').value,
        prio: document.getElementById('priobuttons').value
    };



    // Save the updated task to the database or state
    fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    })
        .then(response => response.json())
        .then(() => {
            // Hide the edit task overlay
            document.getElementById('editTaskOverlay').classList.add('hidden');

            // Refresh the task list to show the updated task details
            displayTasks();
        })
        .catch(error => console.error('Error updating task:', error));
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



async function createTask() {
    // Prüfen, ob die erforderlichen Felder ausgefüllt sind
    let title = document.getElementById('tasktitle').value;
    let description = document.getElementById('description').value;
    let duedate = document.getElementById('duedate').value;
    let category = document.getElementById('taskcategoryinput').value;
    let prio = activeButton ? activeButton.id : null;

    if (!title || !duedate || !category) {
        alert("Bitte füllen Sie alle erforderlichen Felder aus und wählen Sie eine Priorität.");
        return;
    }

    // Namen der zugewiesenen Personen erfassen
    let assignedToCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="assignedto_"]:checked');
    let assignedTo = [];
    assignedToCheckboxes.forEach((checkbox) => {
        let idParts = checkbox.id.split('_');
        let nameSpan = document.getElementById(`assignname_${idParts[1]}_${idParts[2]}`);
        if (nameSpan) {
            assignedTo.push(nameSpan.innerText.trim());
        }
    });

    // Subtasks erfassen
    let subtasksElements = document.querySelectorAll('.addedtask span');
    let subtasks = [];
    subtasksElements.forEach((subtask) => {
        subtasks.push(subtask.innerText);
    });

    // Erstelle ein Objekt mit den erfassten Daten
    let taskData = {
        title: title,
        description: description,
        assignto: assignedTo,
        duedate: duedate,
        prio: prio,
        category: category,
        subtask: subtasks
    };

    // Rufe die postData-Funktion auf, um die Aufgabendaten zu übergeben
    await postData("tasks", taskData);
}

async function postData(path = "tasks", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function postData(path = "tasks", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// relevante funktion generateSubtaskCountHTML, 
// extractTaskData
// generateHTMLContent

// kann ggf gelöscht werden: generateSubtaskCountHTML, updateSubtaskHTML



async function loadSubtaskData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();
    responseToObject = Object.values(responseToJson);
    return responseToObject;
}

async function getSubtasks() {
    let loadedTasks = await loadSubtaskData('tasks');
    if (loadedTasks) {
        for (let i = 0; i < loadedTasks.length; i++) {
            let task = loadedTasks[i];
            console.log(`Task ${i}: ${task.title}`);
            
            if (task.subtask && task.subtask.length > 0) {
                for (let j = 0; j < task.subtask.length; j++) {
                    let subtask = task.subtask[j];
                    console.log(`  -> Subtask ${j}: Boolean = ${subtask.Boolean}, Titel = ${subtask.Titel}`);
                }
            } else {
                console.log('  -> No subtasks');
            }
        }
    } else {
        console.log('No tasks found');
    }


    // return loadedTasks[0]['subtask'][0];
}


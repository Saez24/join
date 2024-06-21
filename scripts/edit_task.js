function openEditTask(){

    let content = document.getElementById('editTaskOverlay');
    content.classList.remove('hidden');
    getValues();
}

function getValues(){
    let title = document.getElementById('HeadlineBox').innerHTML;
    let description = document.getElementById('descriptionDetails').innerHTML;
    let duedate = document.getElementById('dueDate').innerHTML;
    let prio = document.getElementById('Priority').innerHTML;
    // let assignedTo = document.getElementById('assignedTo').innerHTML;
    // let subtasks = document.getElementById('subtask-').innerHTML;
    console.log('Titel: ',title,'Beschreibung: ', description,'Datum: ', duedate,'Prio: ', prio);

    document.getElementById('tasktitle').value = title;
    document.getElementById('description').value = description;
    document.getElementById('duedate').value = duedate;
    document.getElementById('priobuttons').value = prio;
}
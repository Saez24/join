function openDialog() {
    document.getElementById('dialog').classList.remove('d_none');
    let cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = './styles/style_addtask.css';
    document.head.appendChild(cssLink);

    fetch('./add_task.html')
        .then(response => response.text())
        .then(html => {
            let tempElement = document.createElement('div');
            tempElement.innerHTML = html;
            let addTaskContent = tempElement.querySelector('#addtask-content');
            document.getElementById('add_task_dialog_content').appendChild(addTaskContent);
        })
        .catch(error => console.error('Error fetching add_task.html:', error));
};

function closeDialog() {
    document.getElementById('dialog').classList.add('d_none');
}

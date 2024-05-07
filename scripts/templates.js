fetch('../assets/templates/sidebar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('sidebarContainer').innerHTML = html;
    })
    .catch(error => console.error('Error fetching sidebar:', error));


function selectSummary() {
    window.location.href = "summary.html";
}


function selectAddTask() {
    window.location.href = "add_task.html";
}


function selectBoard() {
    window.location.href = "board.html";
}


function selectContacts() {
    window.location.href = "contacts.html";
}


// document.addEventListener("DOMContentLoaded", function(){
//     let currentPage = window.location.pathname;
//     let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];
//     for (let i = 0; i < pages.length; i++) {
//         let buttonId = pages[i].replaceAll("'","");
//         if (currentPage.includes(buttonId)) {
//             let button = document.getElementById(buttonId + 'Btn');
//             if (button) {
//                 button.classList.add('selected');
//             }
//         }
//     }
// });

document.addEventListener("DOMContentLoaded", function(){
    let currentPage = window.location.pathname;
    console.log("Current Page:", currentPage);
    
    let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];
    for (let i = 0; i < pages.length; i++) {
        let buttonId = pages[i].replaceAll("'","");
        console.log("Button ID:", buttonId + 'Btn');
        
        if (currentPage.includes(buttonId)) {
            let button = document.getElementById(buttonId + 'Btn');
            console.log("Button Element:", button);
            
            if (button) {
                button.classList.add('selected');
            }
        }
    }
});
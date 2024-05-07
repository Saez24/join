// fetch('../assets/templates/sidebar.html')
//     .then(response => response.text())
//     .then(html => {
//         document.getElementById('sidebarContainer').innerHTML = html;
//     })
//     .catch(error => console.error('Error fetching sidebar:', error));

document.addEventListener("DOMContentLoaded", function(){
    let currentPage = window.location.pathname;    
    fetch('../assets/templates/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebarContainer').innerHTML = html;

            let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];
            for (let i = 0; i < pages.length; i++) {
                let buttonId = pages[i].replaceAll("'","");
                if (currentPage.includes(buttonId)) {
                    let button = document.getElementById(buttonId + 'Btn');
                    if (button) {
                        button.classList.add('selected');
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching sidebar:', error));
});


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


function selectPrivacyPolicy() {
    window.location.href = "privacy_policy.html";
}


function selectLegalNotice() {
    window.location.href = "legal_notice.html";
}


document.addEventListener("DOMContentLoaded", function(){
    let currentPage = window.location.pathname;  
    let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];
    for (let i = 0; i < pages.length; i++) {
        let buttonId = pages[i].replaceAll("'","");        
        if (currentPage.includes(buttonId)) {
            let button = document.getElementById(buttonId + 'Btn');         
            if (button) {
                button.classList.add('selected');
            }
        }
    }
});
/**
 * Fetches the sidebar HTML content and injects it into the sidebar container.
 * Also, sets the 'selected' class for the button corresponding to the current page.
 */
fetch('./assets/templates/sidebar.html')
    .then(response => response.text())
    .then(html => {
        // Inject the sidebar HTML content into the sidebar container
        document.getElementById('sidebarContainer').innerHTML = html;

        // Get the path of the current page
        let currentPage = window.location.pathname;

        // Define page names without special characters
        let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];

        // Loop through the page names
        for (let i = 0; i < pages.length; i++) {
            // Remove special characters from the page name to match button IDs
            let buttonId = pages[i].replaceAll("'", "");

            // Check if the current page path includes the button ID
            if (currentPage.includes(buttonId)) {
                // Get the corresponding button element
                let button = document.getElementById(buttonId + 'Btn');

                // If the button exists, add the 'selected' class to it
                if (button) {
                    button.classList.add('selected');
                }
            }
        }
    })
    .catch(error => console.error('Error fetching sidebar:', error));


// document.addEventListener("DOMContentLoaded", function () {
//     let currentPage = window.location.pathname;
//     fetch('./assets/templates/sidebar.html')
//         .then(response => response.text())
//         .then(html => {
//             document.getElementById('sidebarContainer').innerHTML = html;

//             let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];
//             for (let i = 0; i < pages.length; i++) {
//                 let buttonId = pages[i].replaceAll("'", "");
//                 if (currentPage.includes(buttonId)) {
//                     let button = document.getElementById(buttonId + 'Btn');
//                     if (button) {
//                         button.classList.add('selected');
//                     }
//                 }
//             }
//         })
//         .catch(error => console.error('Error fetching sidebar:', error));
// });


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

function selectIndex() {
    window.location.href = "index.html";
}


// document.addEventListener("DOMContentLoaded", function () {
//     let currentPage = window.location.pathname;
//     let pages = ['add_task', 'board', 'summary', 'contacts', 'privacy_policy', 'legal_notice'];
//     for (let i = 0; i < pages.length; i++) {
//         let buttonId = pages[i].replaceAll("'", "");
//         if (currentPage.includes(buttonId)) {
//             let button = document.getElementById(buttonId + 'Btn');
//             if (button) {
//                 button.classList.add('selected');
//             }
//         }
//     }
// });

function showSubmenu() {
    let submenu = document.getElementById('submenu');
    if (!submenu.classList.contains('show-submenu')) {
        submenu.classList.remove('d-none');
        setTimeout(function () {
            submenu.classList.add('show-submenu');
        }, 80);
    } else {
        submenu.classList.remove('show-submenu');
        setTimeout(function () {
            submenu.classList.add('d-none');
        }, 80);
    }
}

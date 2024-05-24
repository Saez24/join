window.onload = getNames;
let initialsBackgroundColors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#00FFFF', '#FF00000', '#FF4646', '#FFBB2B'
];

function slideInFromRight() {
    let contactOverlay = document.getElementById('contact-overlay');
    let contactCont = document.getElementById('contact-cont');

    contactOverlay.classList.add('slide-in-from-right');
    contactCont.classList.add('slide-in-from-right');

    setTimeout(() => {
        contactOverlay.classList.add('fade-to-grey-overlay');
    }, 300);
}


function slideOutToRight() {
    debugger;
    let contactOverlay = document.getElementById('contact-overlay');
    let contactCont = document.getElementById('contact-cont');

    contactOverlay.classList.remove('fade-to-grey-overlay');

    setTimeout(() => {
        contactOverlay.classList.remove('slide-in-from-right');
        contactCont.classList.remove('slide-in-from-right');
    }, 100);
}


function closeOverlayWhenGreyAreaWasClicked() { //https://www.tutorialspoint.com/online_html_editor.php

    document.onclick = function (e) {
        if (e.target.id === 'contact-overlay') {
            slideOutToRight();
        }
    };
}


async function getNames() {
    try {
        let response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log("Fetched data:", data); // Debugging Ausgabe

        // Extrahiere die Namen aus den empfangenen Daten
        let names = data.names || [];
        renderContacts(names);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderContacts(data) {
    const container = document.getElementById('contactForString');
    container.innerHTML = '';

    // Gruppieren der Kontakte nach dem Anfangsbuchstaben des Namens
    const groupedContacts = groupByInitial(data);

    for (let initial in groupedContacts) {
        if (groupedContacts.hasOwnProperty(initial)) {
            container.innerHTML += `
                <div class="capital-category">${initial}</div>
                <div class="dividing-line"></div>
            `;
            
            groupedContacts[initial].forEach((contact, index) => {
                const randomColor = getRandomColor(); // Zufällige Farbe auswählen
                container.innerHTML += `
                    <div class="contact-row" onclick="renderContactInformation('${contact.name}', '${contact.email}', '${randomColor}', '${contact.phonenumber}')">
                        <div class="initials" style="background-color: ${randomColor}" id="initials${index}">${getInitials(contact.name)}</div>
                        <div class="name-and-email">
                            <div class="contact-name-row" id="name${index}">${contact.name}</div>
                            <div class="contact-email-row" id="email${index}">${contact.email}</div>
                        </div>
                    </div>
                `;
            });
        }
    }
}


function getRandomColor() {
    return initialsBackgroundColors[Math.floor(Math.random() * initialsBackgroundColors.length)];
}

function groupByInitial(data) {
    return data.reduce((acc, contact) => {
        // Überprüfen, ob contact und contact.name definiert sind
        if (contact && contact.name) {
            let initial = contact.name.charAt(0).toUpperCase();
            if (!acc[initial]) {
                acc[initial] = [];
            }
            acc[initial].push(contact);
        }
        return acc;
    }, {});
}

function getInitials(name) {
    if (!name) return '';
    let initials = name.split(' ').map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
}

function renderContactInformation(name, email, color, phone){
    const contactSummary = document.getElementById('contactSummary');
    contactSummary.innerHTML = `
        <div class="contact-summary-headline">
            <div class="contact-summary-initials" style="background-color: ${color};">${getInitials(name)}</div>
            <div class="contact-summary-headline-rightside">
                <div class="contact-summary-headline-name">${name}</div>
                <div class="edit-and-delete">
                    <div class="edit-and-delete-row"><img src="assets/img/contacts-edit.png" alt="edit">Edit</div>
                    <div class="edit-and-delete-row"><img src="assets/img/contacts-delete.png" alt="delete">Delete</div>
                </div>
            </div>
        </div>
        <div class="contact-summary-contact-information">Contact Information</div>
        <div class="contact-summary-mail-and-phone">
            <div><b>Email</b></div>
            <span>${email}</span>
            <div><b>Phone</b></div>
            <span>+49 151 ${phone}</span> <!-- Hier könntest du das Telefonfeld hinzufügen -->
        </div>
    `;
}
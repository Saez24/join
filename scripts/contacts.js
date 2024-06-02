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
    let contactOverlay = document.getElementById('contact-overlay');
    let contactCont = document.getElementById('contact-cont');

    contactOverlay.classList.remove('fade-to-grey-overlay');

    setTimeout(() => {
        contactOverlay.classList.remove('slide-in-from-right');
        contactCont.classList.remove('slide-in-from-right');
    }, 100);
}


function closeOverlayWhenGreyAreaWasClicked() {
    document.onclick = function (e) {
        if (e.target.id === 'contact-overlay') {
            slideOutToRight();
        }
    };
}


async function addContactData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}


function createContact() {
    if (validateContactInputs()) {
        return;
    }

    let email = document.getElementById('contact-email').value;
    let name = document.getElementById('contact-name').value;
    let phonenumber = document.getElementById('contact-phone').value;
    showSuccessfullContactCreation();
    setTimeout(addContactData, 3000);
    addContactData('names', { 'email': email, 'name': name, 'phonenumber': phonenumber });
}


function validateContactInputs() {
    let emailValid = document.getElementById('contact-email').checkValidity();
    let nameValid = document.getElementById('contact-name').checkValidity();
    let phonenumberValid = document.getElementById('contact-phone').checkValidity();

    if (!emailValid || !nameValid || !phonenumberValid) {
        return true;
    } else {
        return false;
    }
}


function showSuccessfullContactCreation() {
    let contactCreated = document.getElementById('contact-created');

    contactCreated.classList.add('slide-in-from-right');

    setTimeout(() => {
        contactCreated.classList.remove('slide-in-from-right');
    }, 1500);
}


async function getNames() {
    try {
        let response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log("Fetched data:", data); // Debugging Ausgabe

        // Validierung der empfangenen Daten
        if (data && data.names && typeof data.names === 'object') {
            let namesArray = Object.values(data.names);
            renderContacts(namesArray);
        } else {
            throw new Error("Invalid data format");
        }
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
                const uniqueId = `contact-${initial}-${index}`; // Eindeutige ID erstellen
                container.innerHTML += `
                    <div class="contact-row" id="${uniqueId}" onclick="renderContactInformation('${contact.name}', '${contact.email}', '${randomColor}', '${contact.phonenumber}', '${uniqueId}')">
                        <div class="initials" style="background-color: ${randomColor}" id="initials${index}">${getInitials(contact.name)}</div>
                        <div class="name-and-email">
                            <div class="contact-name-row">${contact.name}</div>
                            <div class="contact-email-row">${contact.email}</div>
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

function renderContactInformation(name, email, color, phone, uniqueId) {
    const contactSummary = document.getElementById('mainContacts');
    contactSummary.classList.add('zindex200', 'bgcolorgrey');
    // Entferne die Klasse 'selected-contact' von allen Kontaktzeilen
    const contactRows = document.getElementsByClassName('contact-row');
    for (let row of contactRows) {
        row.classList.remove('selected-contact');
    }
    // Füge die Klasse 'selected-contact' zur angeklickten Zeile hinzu
    let contactName = document.getElementById(uniqueId);
    contactName.classList.add('selected-contact');
    contactSummary.innerHTML = renderContactSummary(color, name, email, phone);
}


function renderContactSummary(color, name, email, phone) {
    return `
    <div class="main-contacts-text">
        <h1>Contacts</h1>
        <div class="vertical-line"></div>
        <h2>Better with a team</h2>
        <div class="horizontal-line"></div>
    </div>
    <div id="contactSummary">
        <div id="backArrow" class="arrow-icon" onclick="closeContactInformation()"><img src="assets/img/arrow_left.png"></div>
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
            <span>+49 151 ${phone}</span>
        </div>
    </div>
    </div>
`;
}

function closeContactInformation() {
    let summary = document.getElementById('contactSummary');
    summary.innerHTML = '';
    getNames();
}
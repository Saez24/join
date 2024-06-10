window.onload = getNames;
let initialsBackgroundColors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#00FFFF', '#FF00000', '#FF4646', '#FFBB2B'
];

let editingContactId = null; // Globale Variable zur Speicherung der Kontakt-ID während der Bearbeitung


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

// David edited: let id
async function createContact() {

    if (validateContactInputs()) {
        return;
    }

    let email = document.getElementById('contact-email').value;
    let name = document.getElementById('contact-name').value;
    let phonenumber = document.getElementById('contact-phone').value;
    // let id = getId();
    // console.log("es wurde geloggt: ", email, "und die ID:", id);

    slideOutToRight();
    showSuccessfullContactCreation();

    await addContactData('names', { 'email': email, 'name': name, 'phonenumber': phonenumber });
    await getNames();
    searchAndRenderLastAddedContact(name);
}

// async function getId(){
//     return 


// }

function searchAndRenderLastAddedContact(name) {
    let lastAddedName = name;

    // Select all elements that could contain the contact name
    const contactElements = document.querySelectorAll(".contact-row");

    // Iterate through the elements to find the one containing the target name
    contactElements.forEach(element => {
        if (element.textContent.includes(lastAddedName)) {
            // Extract parameters from the onclick attribute
            const onclickAttr = element.getAttribute("onclick");
            const paramsRegex = /renderContactInformation\(([^)]+)\)/;
            const match = paramsRegex.exec(onclickAttr);

            if (match) {
                // Get the parameters string and split it into an array
                const paramsString = match[1];
                const paramsArray = paramsString.split(',').map(param => param.trim().replace(/['"]/g, ''));

                // Call the function with the parameters
                renderContactInformation(...paramsArray);
                element.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        }
    });
};


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
            let namesArray = Object.entries(data.names);
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
                const uniqueId = contact[0]; // Eindeutige ID erstellen
                const contactData = contact[1];
                container.innerHTML += `
                    <div class="contact-row" id="${uniqueId}" onclick="renderContactInformation('${contactData.name}', '${contactData.email}', '${randomColor}', '${contactData.phonenumber}', '${uniqueId}')">
                        <div class="initials" style="background-color: ${randomColor}" id="initials${index}">${getInitials(contactData.name)}</div>
                        <div class="name-and-email">
                            <div class="contact-name-row">${contactData.name}</div>
                            <div class="contact-email-row">${contactData.email}</div>
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


// Funktion zur Gruppierung der Kontakte nach dem Anfangsbuchstaben des Namens
function groupByInitial(data) {
    return data.reduce((acc, [id, contact]) => {
        const initial = contact.name.charAt(0).toUpperCase();
        if (!acc[initial]) {
            acc[initial] = [];
        }
        acc[initial].push([id, contact]);
        return acc;
    }, {});
}

function getInitials(name) {
    if (!name) return '';
    let initials = name.split(' ').map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
}

function renderContactInformation(name, email, color, phone, id) {
    console.log(`Name: ${name}, Email: ${email}, Farbe: ${color}, Telefonnummer: ${phone}, ID: ${id}`);
    checkResponsive();
    const contactSummary = document.getElementById('mainContacts');
    contactSummary.classList.add('bgcolorgrey');
    const contactRows = document.getElementsByClassName('contact-row');
    for (let row of contactRows) {
        row.classList.remove('selected-contact');
    }
    let contactName = document.getElementById(id);
    contactName.classList.add('selected-contact');
    contactSummary.innerHTML = renderContactSummary(color, name, email, phone, id);
}


// <!-- Render Contact Summary HTML -->
function renderContactSummary(color, name, email, phone, uniqueId) {
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
                    <div id="edit${uniqueId}" class="edit-and-delete-row" onclick="openEditContactOverlay('${name}', '${email}', '${phone}', '${color}', '${uniqueId}')">
                        <img src="assets/img/contacts-edit.png" alt="edit">Edit
                    </div>
                    <div id="delete${uniqueId}" class="edit-and-delete-row" onclick="openDeleteContactOverlay('${uniqueId}')">
                        <img src="assets/img/contacts-delete.png" alt="delete">Delete
                    </div>
                </div>
                <button onclick="burgerSlideInFromRight()" class="contact-burger-menu" id="contactBurgerMenuIcon">
                    <img src="assets/img/contacts-burger-menu.png" alt="add contact" class="burger-menu-icon">
                </button>
            </div>
        </div>
        <div class="contact-summary-contact-information">Contact Information</div>
        <div class="contact-summary-mail-and-phone">
            <div><b>Email</b></div>
            <span>${email}</span>
            <div><b>Phone</b></div>
            <span>${phone}</span>
        </div>
    </div>
    <!-- BURGER MENU EDIT AND DELETE -->
    <div class="burger-menu-overlay" id="burgerMenu">
        <div class="burgermenu-row" onclick="openEditContactOverlay('${name}', '${email}', '${phone}', '${color}', '${uniqueId}')">
            <img class="burgermenu-menu-icon" src="assets/img/contacts-edit.png">
            Edit
        </div>
        <div class="burgermenu-row" onclick="openDeleteContactOverlay('${uniqueId}')">
            <img class="burgermenu-menu-icon" src="assets/img/contacts-delete.png">
            Delete
        </div>
    </div>
    `;
}


function closeContactInformation() {
    if (window.innerWidth < 1401) {
        document.getElementById('mainContacts').style.display = 'none';
        document.getElementById('contactsLeft').style.display = 'flex';
    }
    let summary = document.getElementById('contactSummary');
    summary.innerHTML = '';
    getNames();
}


function checkResponsive() {
    if (window.innerWidth < 1401) {
        document.getElementById('contactsLeft').style.display = 'none';
        document.getElementById('mainContacts').style.display = 'flex';
    }

}


function burgerSlideInFromRight() {
    let burgerMenu = document.getElementById('burgerMenu');
    let burgerIcon = document.getElementById('contactBurgerMenuIcon');
    burgerMenu.classList.toggle('active');
    burgerIcon.classList.add('d-none');

    // Event-Listener zum Schließen des Menüs hinzufügen
    document.addEventListener('click', closeBurgerMenuWhenGreyAreaWasClicked);
}

function burgerMenuSlideOutToRight() {
    let burgerMenu = document.getElementById('burgerMenu');
    let burgerIcon = document.getElementById('contactBurgerMenuIcon');
    burgerMenu.classList.remove('active');
    burgerIcon.classList.remove('d-none');

    // Event-Listener entfernen
    document.removeEventListener('click', closeBurgerMenuWhenGreyAreaWasClicked);
}

function closeBurgerMenuWhenGreyAreaWasClicked(event) {
    let burgerMenu = document.getElementById('burgerMenu');
    if (!burgerMenu.contains(event.target) && !event.target.closest('.contact-burger-menu')) {
        burgerMenuSlideOutToRight();
    }
}

function openEditContactOverlay(name, email, phone, color, uniqueId) {
    console.log('folgendes wird übergeben: ', name, email, phone, color, uniqueId);
    document.getElementById('edit-contact-name').value = name;
    document.getElementById('edit-contact-email').value = email;
    document.getElementById('edit-contact-phone').value = phone;
    document.getElementById('contactEditProfileInitials').style.background = color;
    document.getElementById('contactEditProfileInitials').innerHTML = getInitials(name);
    editingContactId = uniqueId; // Speichern der ID des zu bearbeitenden Kontakts
    console.log('Kontakt-ID für Bearbeitung gesetzt:', editingContactId); // Debugging Ausgabe
    editSlideInFromRight();
}



function editSlideInFromRight() {
    let editContactOverlay = document.getElementById('edit-contact-overlay');
    let editContactCont = document.getElementById('edit-contact-cont');

    editContactOverlay.classList.add('slide-in-from-right');
    editContactCont.classList.add('slide-in-from-right');

    setTimeout(() => {
        editContactOverlay.classList.add('fade-to-grey-overlay');
    }, 300);
}

function editSlideOutToRight() {
    let contactOverlay = document.getElementById('edit-contact-overlay');
    let contactCont = document.getElementById('edit-contact-cont');

    contactOverlay.classList.remove('fade-to-grey-overlay');

    setTimeout(() => {
        contactOverlay.classList.remove('slide-in-from-right');
        contactCont.classList.remove('slide-in-from-right');
    }, 100);
}

async function editContact(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    let name = document.getElementById('edit-contact-name').value;
    let email = document.getElementById('edit-contact-email').value;
    let phone = document.getElementById('edit-contact-phone').value;


    if (!editingContactId) {
        console.error('Keine Kontakt-ID vorhanden für das Update');
        return;
    }

    // Hier die Kontaktinformationen aktualisieren
    console.log('Aktualisierte Kontaktinformationen:', { name, email, phone });

    // Beispiel: Aktualisierte Kontaktinformationen speichern (implementieren Sie Ihre eigene Speicherlogik)
    await updateContactData(editingContactId, { email: email, name: name, phonenumber: phone });

    editSlideOutToRight();
    await getNames();
    searchAndRenderLastAddedContact(name);
    showSuccessfulEdit();
}

async function updateContactData(id, data) {
    try {
        let response = await fetch(`${BASE_URL}/names/${id}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error updating data:", error);
    }
}


function showSuccessfulEdit() {
    let contactCreated = document.getElementById('contact-created');
    contactCreated.innerHTML = "Contact successfully edited"; // Änderung der Nachricht
    contactCreated.classList.add('slide-in-from-right');

    setTimeout(() => {
        contactCreated.classList.remove('slide-in-from-right');
    }, 1500);
}

// Funktion zum Löschen eines Kontakts

function openDeleteContactOverlay(uniqueId) {
    const deleteContactOverlay = document.getElementById('delete-contact-overlay');
    if (deleteContactOverlay) {
        deleteContactOverlay.classList.add('slide-in-from-right');
        deleteContactOverlay.dataset.contactId = uniqueId;
    } else {
        console.error('delete-contact-overlay Element nicht gefunden');
    }
}

function deleteSlideOutToRight() {
    const deleteContactOverlay = document.getElementById('delete-contact-overlay');
    if (deleteContactOverlay) {
        deleteContactOverlay.classList.remove('slide-in-from-right');
        setTimeout(() => {
            deleteContactOverlay.classList.remove('fade-to-grey-overlay');
        }, 100);
    } else {
        console.error('delete-contact-overlay Element nicht gefunden');
    }
}

async function deleteContact() {
    const deleteContactOverlay = document.getElementById('delete-contact-overlay');
    const contactId = deleteContactOverlay ? deleteContactOverlay.dataset.contactId : null;

    if (!contactId) {
        console.error('Keine Kontakt-ID vorhanden für das Löschen');
        return;
    }

    try {
        let response = await fetch(`${BASE_URL}/names/${contactId}.json`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        deleteSlideOutToRight();
        await getNames();
        closeContactInformation();
        showSuccessfulDelete();
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

function showSuccessfulDelete() {
    let contactDeleted = document.getElementById('contact-deleted');
    if (contactDeleted) {
        contactDeleted.innerHTML = "Contact successfully deleted"; // Anzeige der Nachricht
        contactDeleted.classList.add('slide-in-from-right');

        setTimeout(() => {
            contactDeleted.classList.remove('slide-in-from-right');
        }, 1500);
    } else {
        console.error('contact-deleted Element nicht gefunden');
    }
}

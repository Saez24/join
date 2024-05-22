const colors = ['#FFFF00', '#FFC0CB', '#ADD8E6', '#90EE90', '#FFB6C1', '#FFA07A', '#FFD700', '#D8BFD8', '#E0FFFF', '#FAFAD2'];

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
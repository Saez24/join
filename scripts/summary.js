greet = "yes";

/** Checks if the user has been visited the summary page during log-in. If so, the global var "greet" will be set to "no" and the good morning message will not be displayed */
function checkGreeting() {
    let greeter = document.getElementById("fade-out");
    if (greet === "yes") {
        summaryFadeOut();
        greet = "no";
    } else {
        greeter.classList.add("d-none");
    }
}

/**Adds the class "fade-out" to the Good Morning div-container, which makes the container fade-out after two seconds */
function summaryFadeOut() {
    let greeter = document.getElementById("fade-out");
    setTimeout(function () {
        greeter.classList.add("fade-out");
        setTimeout(function () {
            greeter.classList.add("d-none");
        }, 800);
    }, 2000);
}
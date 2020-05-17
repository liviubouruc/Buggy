var modalSettings = document.getElementById("modalSettings");

function checkGreeting() {
    if(!window.localStorage.getItem("username") || window.localStorage.getItem("username" == ""))
        document.getElementById("greeting").textContent = "Welcome back!";
    else document.getElementById("greeting").textContent = "Welcome back, " + window.localStorage.getItem("username");
}
window.onload = checkGreeting();

function openSettings() {
    modalSettings.style.display = "block";
    document.body.style.position = "fixed";
}

function closeModal() {
    document.body.style.position = "absolute";
    modalSettings.style.display = "none";
}

function saveSettings() {
    var Nume = document.getElementById("user-name").value;
    window.localStorage.setItem("username", Nume);

    if(Nume != "") document.getElementById("greeting").textContent = "Welcome back, " + Nume + "!";
    else document.getElementById("greeting").textContent = "Welcome back!";
    
    closeModal();
}
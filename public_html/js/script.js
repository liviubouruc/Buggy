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

function appendToDOM(bugs) {
    
}

function getBugs() {
    fetch('https://localhost:3000/bugs')
        .then(function(response) {
            response.json().then(function(bugs) {
                appendToDOM(bugs);
            });
        });
}

function postBug() {
    let bugTitle = document.getElementById("b-title").value;
    let bugDesc = document.getElementById("bug-descript").value;
    const bug = {
        title: bugTitle,
        description: bugDesc
    };

    fetch('https://localhost:3000/bugs', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(bug)
    }).then(function() {
        getBugs();
    });
}

function deleteBug(id) {
    fetch('https://localhost:3000/bugs/${id}', {
        method: 'DELETE'
    }).then(function() {
        getBugs();
    });
}

getBugs();
import { listenerCount } from "cluster";

var modalSettings = document.getElementById("modalSettings");
var bugList = document.getElementById("bug-list");

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
    while(bugList.firstChild) bugList.removeChild(bugList.firstChild);
    
    for(let i = 0; i < bugs.length; i++) {
        let bugTitle = document.createElement('div');
        bugTitle.innerText = bugs[i].title;
        bugTitle.classList.add("bug-cap");

        let solveBtn = document.createElement('button');
        solveBtn.innerText = 'Solved';
        solveBtn.classList.add("btn");
        solveBtn.addEventListener('click', function() {
            deleteBug(bugs[i].id);
        });

        let li = document.createElement('li');
        li.appendChild(bugTitle);
        li.appendChild(solveBtn);
        li.classList.add("bug-elem");

        bugList.appendChild(li);
    }
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
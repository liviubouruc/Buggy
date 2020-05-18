var modalSettings = document.getElementById("modalSettings");
var modalView = document.getElementById("modalView");
var bugList = document.getElementById("bug-list");

function checkGreeting() {
    if(!window.localStorage.getItem("username") || window.localStorage.getItem("username" == ""))
        document.getElementById("greeting").textContent = "Welcome back!";
    else document.getElementById("greeting").textContent = "Welcome back, " + window.localStorage.getItem("username");
}
window.onload = checkGreeting();

function saveSettings() {
    var Nume = document.getElementById("user-name").value;
    window.localStorage.setItem("username", Nume);

    if(Nume != "") document.getElementById("greeting").textContent = "Welcome back, " + Nume + "!";
    else document.getElementById("greeting").textContent = "Welcome back!";
    
    closeModal();
}

function openSettings() {
    modalSettings.style.display = "block";
    document.body.style.position = "fixed";
}

function editViewModal(id) {
    let modal = document.getElementById("modalView-info");
    while(modal.firstChild) modal.removeChild(modal.firstChild);

    let modalTitle = document.createElement('h1');
    modalTitle.innerText = "Edit bug";
    modalTitle.classList.add("modal-title");

    let auxP1 = document.createElement('p');
    auxP1.innerText = "Bug Title";

    
}

function openView(id) {
    modalView.style.display = "block";
    document.body.style.positon = "fixed";

    const res = fetch('/bugs/' + id)
        .then((res) => { return res.json() })
        .then((bug) => {
            document.getElementById("modalView-title").textContent = bug.title;
            document.getElementById("modalView-descript").textContent = bug.description;
            document.getElementById("editBug").addEventListener('click', function() {
                editViewModal(id);
            });
        });

}

function closeModal() {
    document.body.style.position = "absolute";
    modalSettings.style.display = "none";
    modalView.style.display = "none";
}


function appendToDOM(bugs) {
    while(bugList.firstChild) bugList.removeChild(bugList.firstChild);
    
    for(let i = 0; i < bugs.length; i++) {
        let bugTitle = document.createElement('div');
        bugTitle.innerText = bugs[i].title;
        bugTitle.classList.add("bug-cap");
        bugTitle.addEventListener('click', function() {
            openView(bugs[i].id);
        });

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
    fetch('/bugs')
        .then(function(response) {
            response.json().then(function(bugs) {
                appendToDOM(bugs);
            });
        });
}

function postBug() {
    let bugTitle = document.getElementById("b-title").value;
    let bugDesc = document.getElementById("b-descript").value;
    const bug = {
        title: bugTitle,
        description: bugDesc
    };

    fetch('/bugs', {
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
    fetch('http://localhost:3000/bugs/${id}', {
        method: 'DELETE'
    }).then(function() {
        getBugs();
    });
}

getBugs();
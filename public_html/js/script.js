var modalSettings = document.getElementById("modalSettings");
var modalView = document.getElementById("modalView");
var modalAdd = document.getElementById("modalAdd");
var bugList = document.getElementById("bug-list");

function checkGreeting() {
    if(!window.localStorage.getItem("username") || window.localStorage.getItem("username" == ""))
        document.getElementById("greeting").textContent = "Welcome back! There's your list of bugs:";
    else document.getElementById("greeting").textContent = "Welcome back, " + window.localStorage.getItem("username") + "! There's your list of bugs:";
}
window.onload = checkGreeting();

document.getElementById("b-title").addEventListener("keyup", function() {
    let Input = document.getElementById('b-title').value;
    if (Input != "") {
        document.getElementById('postBtn').removeAttribute("disabled");
    } else {
        document.getElementById('postBtn').setAttribute("disabled", null);
    }
});
document.getElementById("modal-b-title").addEventListener("keyup", function() {
    let Input = document.getElementById('modal-b-title').value;
    if (Input != "") {
        document.getElementById('postMBtn').removeAttribute("disabled");
    } else {
        document.getElementById('postMBtn').setAttribute("disabled", null);
    }
});

function saveSettings() {
    var Nume = document.getElementById("user-name").value;
    window.localStorage.setItem("username", Nume);

    if(Nume != "") document.getElementById("greeting").textContent = "Welcome back, " + Nume + "! There's your list of bugs:";
    else document.getElementById("greeting").textContent = "Welcome back! There's your list of bugs:";
    
    closeModal();
}

function openSettings() {
    modalSettings.style.display = "block";
    document.body.style.position = "fixed";
}

function openModalAdd() {
    modalAdd.style.display = "block";
    document.body.style.position = "fixed";
}

function editViewModal(id, title, description) {
    let modal = document.getElementById("modalView-info");
    while(modal.firstChild) modal.removeChild(modal.firstChild);

    let modalTitle = document.createElement('h1');
    modalTitle.innerText = "Edit bug";
    modalTitle.classList.add("modal-title");

    let form = document.createElement('form');
    form.action = '/plants/' + id;
    form.method = 'POST';
    form.id = "edit-form";

    let titleLabel = document.createElement('label');
    titleLabel.htmlFor = "bug-title";
    titleLabel.textContent = "Bug Title";

    let titleInput = document.createElement('input');
    titleInput.name = "b-title";
    titleInput.id = "edit-b-title";
    titleInput.value = title;

    let descriptLabel = document.createElement('label');
    descriptLabel.htmlFor = "bug-description";
    descriptLabel.textContent = "Bug Description";

    let descriptTextarea = document.createElement("textarea");
    descriptTextarea.name = "b-descript"
    descriptTextarea.id = "edit-b-descript";
    descriptTextarea.textContent = description;

    let menu = document.createElement('div');
    menu.classList.add("modal-menu");

    let saveBtn = document.createElement('button');
    saveBtn.type = "submit";
    saveBtn.classList.add("btn");
    saveBtn.innerText = "Save";
    saveBtn.addEventListener('click', function() {
        editBug(id);
        closeModal();
    })
    menu.appendChild(saveBtn);

    let closeBtn = document.createElement('button');
    closeBtn.classList.add("btn");
    closeBtn.innerText = "Close";
    closeBtn.addEventListener('click', function() {
        closeModal();
    })
    menu.appendChild(closeBtn);

    titleInput.addEventListener("keyup", function() {
        let Input = titleInput.value;
        if (Input != "") {
            saveBtn.removeAttribute("disabled");
        } else {
            saveBtn.setAttribute("disabled", null);
        }
    });

    modal.appendChild(modalTitle);

    form.appendChild(titleLabel);
    let br1 = document.createElement('br');
    form.appendChild(br1);
    form.appendChild(titleInput);
    let br2 = document.createElement('br');
    form.appendChild(br2);
    form.appendChild(descriptLabel);
    let br3 = document.createElement('br');
    form.appendChild(br3);
    form.appendChild(descriptTextarea);
    let br4 = document.createElement('br');
    form.appendChild(br4);
    modal.appendChild(form);

    modal.appendChild(menu);
}

function openView(id, title, description) {
    modalView.style.display = "block";
    document.body.style.positon = "fixed";

    let modal = document.getElementById("modalView-info");
    while(modal.firstChild) modal.removeChild(modal.firstChild);

    let modalTitle = document.createElement('h1');
    modalTitle.innerText = title;
    modalTitle.classList.add("modal-title");

    let P = document.createElement('p');
    P.innerText = "Description";
    P.classList.add("view-modal-descript");

    let modalDescript = document.createElement('p');
    modalDescript.innerText = description;

    let menu = document.createElement('div');
    menu.classList.add("modal-menu");

    let editBtn = document.createElement('button');
    editBtn.classList.add("btn");
    editBtn.innerText = "Edit";
    editBtn.addEventListener('click', function() {
        editViewModal(id, title, description);
    })
    menu.appendChild(editBtn);

    let closeBtn = document.createElement('button');
    closeBtn.classList.add("btn");
    closeBtn.innerText = "Close";
    closeBtn.addEventListener('click', function() {
        closeModal();
    })
    menu.appendChild(closeBtn);

    modal.appendChild(modalTitle);
    modal.appendChild(P);
    modal.appendChild(modalDescript);
    modal.appendChild(menu);
}

function closeModal() {
    document.body.style.position = "absolute";
    modalSettings.style.display = "none";
    modalView.style.display = "none";
    modalAdd.style.display = "none";
}


function appendToDOM(bugs) {
    while(bugList.firstChild) bugList.removeChild(bugList.firstChild);
    
    for(let i = 0; i < bugs.length; i++) {
        let bugTitle = document.createElement('div');
        bugTitle.innerText = bugs[i].title;
        bugTitle.classList.add("bug-cap");
        bugTitle.addEventListener('click', function() {
            openView(bugs[i].id, bugs[i].title, bugs[i].description);
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
function postMBug() {
    let bugTitle = document.getElementById("modal-b-title").value;
    let bugDesc = document.getElementById("modal-b-descript").value;
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

function editBug(id) {
    const bug = {
        title: document.getElementById('edit-b-title').value,
        description: document.getElementById('edit-b-descript').value
    }
    fetch(`http://localhost:3000/bugs/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(bug)
    }).then(function () {
        getBugs();
    });
}

function deleteBug(id) {
    fetch(`http://localhost:3000/bugs/${id}`, {
        method: 'DELETE'
    }).then(function() {
        getBugs();
    });
}

getBugs();
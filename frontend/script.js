const API = "http://127.0.0.1:5000";

function addVolunteer() {
    fetch(`${API}/add_volunteer`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: document.getElementById("vname").value,
            skill: document.getElementById("vskill").value
        })
    })
    .then(() => loadData());
}

function addTask() {
    fetch(`${API}/add_task`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            task: document.getElementById("tname").value,
            required_skill: document.getElementById("tskill").value,
            priority: document.getElementById("tpriority").value
        })
    })
    .then(() => loadData());
}

function autoAssign() {
    fetch(`${API}/auto_assign`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("output").innerText =
                JSON.stringify(data, null, 2);
        });
}

function loadData() {
    fetch(`${API}/data`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("output").innerText =
                JSON.stringify(data, null, 2);
        });
}

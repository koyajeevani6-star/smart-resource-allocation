const API = "http://127.0.0.1:5000";

// Add volunteer
function addVolunteer(){
    let name = sessionStorage.getItem("volunteerName");
    let skill = document.getElementById("vskill").value;

    fetch(`${API}/add_volunteer`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name, skill})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("vskill").value = "";
    });
}

// Add task
function addTask(){
    let task = document.getElementById("tname").value;
    let skill = document.getElementById("tskill").value;
    let priority = document.getElementById("tpriority").value;
    let location = document.getElementById("tlocation").value;
    let time = document.getElementById("ttime").value;

    fetch(`${API}/add_task`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({task, required_skill:skill, priority, location, time})
    })
    .then(()=>{
        alert("✅ Task Added");
        loadData();
    });
}

// Auto assign
function autoAssign(){
    fetch(`${API}/auto_assign`)
    .then(()=>{
        alert("⚡ Tasks Assigned!");
        loadData();
    });
}

// Reset
function resetSystem(){
    fetch(`${API}/reset`)
    .then(()=>{
        alert("🔄 Reset Done");
        loadData();
    });
}

// ✅ COMPLETE TASK FUNCTION (NEW)
function completeTask(taskName){
    let name = sessionStorage.getItem("volunteerName");

    fetch(`${API}/complete_task`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({task: taskName, name: name})
    })
    .then(res=>res.json())
    .then(()=>{
        alert("✅ Task Completed!");
        window.notified = false; // allow future notifications
        loadVolunteerTasks();
    });
}

// Admin display
function displayData(data) {
    let output = "";

    output += "👥 Volunteers:\n";
    data.volunteers.forEach(v => {
        output += `• ${v.name} (${v.skill}) - ${v.available ? "Available" : "Busy"}\n`;
    });

    output += "\n📌 Tasks:\n";
    data.tasks.forEach(t => {
        output += `
${t.task}
Assigned: ${t.assigned_to}
Status: ${t.status}
----------------------\n`;

        // 🔔 ADMIN ALERT
        if(t.status === "Completed" && !window.adminNotified){
            alert(`🎉 Task "${t.task}" completed!`);
            window.adminNotified = true;
        }
    });

    document.getElementById("output").innerText = output;
}

// Load admin
function loadData(){
    fetch(`${API}/data`)
    .then(res=>res.json())
    .then(data=>displayData(data));
}

// Volunteer tasks
function loadVolunteerTasks(){
    let name = sessionStorage.getItem("volunteerName");

    fetch(`${API}/data`)
    .then(res=>res.json())
    .then(data=>{
        let out = "";

        data.tasks.forEach(t=>{
            let assigned = t.assigned_to ? t.assigned_to.trim().toLowerCase() : "";
            let current = name ? name.trim().toLowerCase() : "";

            if(assigned === current){
                let color = t.priority === "High" ? "red" :
                            t.priority === "Medium" ? "orange" : "green";

                out += `
<div class="task-card">
<b style="color:${color}">${t.task}</b><br>
📍 ${t.location}<br>
⏰ ${t.time}<br>
📅 ${t.date}<br>
⚡ ${t.priority}<br>

<button onclick="completeTask('${t.task}')">
✅ Complete Task
</button>
</div>`;
            }
        });

        if(out !== ""){
            document.getElementById("taskMsg").innerText = "✅ You have been assigned tasks!";

            if(!window.notified){
                alert("🔔 New Task Assigned!");
                window.notified = true;
            }
        }

        document.getElementById("myTasks").innerHTML =
            out || `<div style="text-align:center;color:gray;">🚫 No tasks</div>`;
    });
}

// On load
window.onload = function(){
    let path = window.location.pathname;

    if(path.includes("admin")){
        loadData();
        setInterval(loadData, 3000); // 🔥 auto refresh admin
    }

    if(path.includes("volunteer")){
        let name = sessionStorage.getItem("volunteerName");

        if(name){
            document.getElementById("welcome").innerText = "Welcome " + name;
        }

        loadVolunteerTasks();
        setInterval(loadVolunteerTasks, 3000);
    }
};

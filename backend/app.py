from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

volunteers = []
tasks = []

@app.route('/add_volunteer', methods=['POST'])
def add_volunteer():
    data = request.json

    if any(v["name"] == data["name"] for v in volunteers):
        return jsonify({"message": "Volunteer already exists"})

    volunteers.append({
        "name": data["name"],
        "skill": data["skill"],
        "available": True
    })

    return jsonify({"message": "Volunteer added"})


@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json

    tasks.append({
        "task": data["task"],
        "required_skill": data["required_skill"],
        "priority": data["priority"],
        "assigned_to": None,
        "location": data.get("location", ""),
        "time": data.get("time", ""),
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "Pending"
    })

    return jsonify({"message": "Task added"})


@app.route('/auto_assign', methods=['GET'])
def auto_assign():
    priority_order = {"High": 1, "Medium": 2, "Low": 3}
    tasks.sort(key=lambda x: priority_order.get(x["priority"], 4))

    for task in tasks:
        if task["assigned_to"] is None or task["assigned_to"] == "No suitable volunteer":
            for v in volunteers:
                skill_v = v["skill"].strip().lower()
                skill_t = task["required_skill"].strip().lower()

                if v["available"] and skill_v == skill_t:
                    task["assigned_to"] = v["name"]
                    task["status"] = "Assigned"
                    v["available"] = False
                    break

            if task["assigned_to"] is None:
                task["assigned_to"] = "No suitable volunteer"

    return jsonify(tasks)


@app.route('/data', methods=['GET'])
def get_data():
    return jsonify({
        "volunteers": volunteers,
        "tasks": tasks
    })

@app.route('/reset', methods=['GET'])
def reset():
    global volunteers, tasks
    volunteers = []
    tasks = []
    return jsonify({"message": "System reset"})
@app.route('/complete_task', methods=['POST'])
def complete_task():
    data = request.json
    task_name = data["task"]
    volunteer_name = data["name"]

    for task in tasks:
        if task["task"] == task_name and task["assigned_to"] == volunteer_name:
            task["status"] = "Completed"
            task["assigned_to"] = "Completed"

            # make volunteer available again
            for v in volunteers:
                if v["name"] == volunteer_name:
                    v["available"] = True

            return jsonify({"message": "Task completed"})

    return jsonify({"message": "Task not found"})
if __name__ == '__main__':
    app.run(debug=True)
    

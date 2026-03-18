from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

volunteers = []
tasks = []

# Add volunteer
@app.route('/add_volunteer', methods=['POST'])
def add_volunteer():
    data = request.json
    volunteers.append({
        "name": data["name"],
        "skill": data["skill"],
        "available": True
    })
    return jsonify({"message": "Volunteer added"})

# Add task
@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    tasks.append({
        "task": data["task"],
        "required_skill": data["required_skill"],
        "priority": data["priority"],
        "assigned_to": None
    })
    return jsonify({"message": "Task added"})

# Auto assign with priority + skill
@app.route('/auto_assign', methods=['GET'])
def auto_assign():
    # Sort tasks by priority (High > Medium > Low)
    priority_order = {"High": 1, "Medium": 2, "Low": 3}
    sorted_tasks = sorted(tasks, key=lambda x: priority_order.get(x["priority"], 4))

    for task in sorted_tasks:
        if task["assigned_to"] is None:
            for v in volunteers:
                if v["available"] and v["skill"] == task["required_skill"]:
                    task["assigned_to"] = v["name"]
                    v["available"] = False
                    break

    return jsonify(sorted_tasks)

# Get all data
@app.route('/data', methods=['GET'])
def get_data():
    return jsonify({
        "volunteers": volunteers,
        "tasks": tasks
    })

if __name__ == '__main__':
    app.run(debug=True)

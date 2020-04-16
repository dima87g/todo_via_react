from flask import Flask, render_template, request, json, jsonify
import mysql.connector

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config['JSON_AS_ASCII'] = False


@app.route("/")
def main():
    return render_template("index.html")


@app.route("/save", methods=["GET", "POST"])
def save():
    text = request.json
    connect = mysql.connector.connect(user="todo_list",
                                      password="12345",
                                      host="127.0.0.1",
                                      port="3306",
                                      database="todo")
    cur = connect.cursor()
    insert_command = "INSERT INTO tasks (text, status) VALUES (%s, %s)"
    insert_variables = (text, 0)
    cur.execute(insert_command, insert_variables)
    connect.commit()
    cur.execute("SELECT id FROM tasks ORDER BY id DESC LIMIT 1")
    task_id = cur.fetchall()[0][0]
    connect.close()

    return jsonify(task_id)


@app.route("/load")
def load():
    """
    request: None
    response: json = [
                {"id": "int", "task": "text", "status": "int"},
                .......
            ]
    """
    response = []
    connect = mysql.connector.connect(user="todo_list",
                                      password="12345",
                                      host="127.0.0.1",
                                      port="3306",
                                      database="todo")

    cur = connect.cursor()
    cur.execute("SELECT * FROM tasks")
    for i in cur:
        response.append({"id": i[0], "task": i[1], "status": i[2]})
    connect.close()
    return jsonify(response)


@app.route("/delete", methods=["POST"])
def delete():
    """
    request: 'int' (id of task to be deleted)
    response: {'ok': True}
    """
    task_id = request.json
    connect = mysql.connector.connect(user="todo_list",
                                      password="12345",
                                      host="127.0.0.1",
                                      port="3306",
                                      database="todo")
    cur = connect.cursor()
    delete_command = f"DELETE FROM tasks WHERE id = {task_id}"
    delete_variables = task_id
    cur.execute(delete_command)
    connect.commit()
    connect.close()
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True)

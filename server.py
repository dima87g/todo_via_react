from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import pooling

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config['JSON_AS_ASCII'] = False

# Pool connection add
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="new_pool",
    pool_size=32,
    pool_reset_session=True,
    host="127.0.0.1",
    port="3306",
    user="todo_list",
    password="12345",
    database="todo")

print("Connection Pool Name - ", connection_pool.pool_name)
print("Connection Pool Size - ", connection_pool.pool_size)


@app.route("/")
def main():
    return render_template("index.html")


@app.route("/save", methods=["GET", "POST"])
def save():
    """
    request: todo_text = "str"
    response: task_id = "int"
    """
    todo_text = request.json

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    cur.execute("INSERT INTO tasks (text, status) VALUES (%s, %d)",
                (todo_text, 0))
    connection.commit()
    task_id = cur.lastrowid

    cur.close()
    connection.close()

    return jsonify(task_id)


@app.route("/load")
def load():
    """
    request: None
    response: json = [
                {"id": "int", "task": "text", "status": "str"},
                .......
            ]
    """
    response = []

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    cur.execute("SELECT * from tasks")
    for task in cur:
        response.append({"id": task[0], "task": task[1], "status": task[2]})

    cur.close()
    connection.close()

    return jsonify(response)


@app.route("/delete", methods=["POST"])
def delete():
    """
    request: 'int' (id of task to be deleted)
    response: json =  {'ok': True}
    """
    task_id = request.json

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    cur.execute(f"DELETE FROM tasks WHERE id = {task_id}")
    connection.commit()

    cur.close()
    connection.close()

    return jsonify({"ok": True})


@app.route("/finish_button", methods=["GET", "POST"])
def finish_button():
    """
    request: json = {"id": "int", "status": "int}
    response: json = {"ok": True}
    """
    data = request.json
    task_id = data["id"]
    task_status = int(data['status'])

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    cur.execute(f"UPDATE tasks SET status = {task_status} WHERE id = {task_id}")
    connection.commit()

    cur.close()
    connection.close()

    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True)

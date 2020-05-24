from flask import Flask, render_template, request, jsonify, make_response
import mysql.connector
from mysql.connector import pooling

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config['JSON_AS_ASCII'] = False

# Pool connection add
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="new_pool",
    pool_size=30,
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


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    request: user_name = 'str'
    response: json = {'ok': 'bool'}
    """
    user_name = request.json

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    cur.execute('SELECT * FROM users WHERE user_name = %s', (user_name,))
    cur.fetchall()
    count = cur.rowcount

    cur.close()
    connection.close()

    response = make_response(jsonify({'ok': bool(count)}), 200)

    return response


@app.route('/user_register', methods=['GET', 'POST'])
def user_register():
    """
    request: user_name = 'str'
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    user_name = request.json

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    try:
        cur.execute('INSERT INTO users (user_name) VALUES (%s)', (user_name, ))
    except mysql.connector.errors.IntegrityError as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    else:
        connection.commit()

        return jsonify({'ok': True, 'error_code': None, 'error_message': None})
    finally:
        cur.close()
        connection.close()


@app.route("/load", methods=['GET', 'POST'])
def load():
    """
    request: user_name = 'str' response: json = {'ok': 'bool', 'user_id':
    'int', 'tasks': [ {"task_id": "int", "user_id": "int" "task_text":
    "text", "status": "str"}, ....... ]
    """
    user_name = request.json

    tasks = []

    connection = connection_pool.get_connection()
    cur = connection.cursor()

    cur.execute('SELECT id FROM users WHERE user_name = %s', (user_name, ))
    id_list = cur.fetchall()

    if id_list:
        user_id = id_list[0][0]

        cur.execute('SELECT * from tasks_test WHERE user_id = %s', (user_id, ))
        for task in cur:
            tasks.append({"task_id": task[0], "user_id": task[1],
                          "task_text": task[2], "status": bool(task[3])})

        cur.close()
        connection.close()

        response = {'ok': True, 'user_id': user_id, 'tasks': tasks}

        return jsonify(response)
    else:
        return jsonify({'ok': False})


@app.route("/save", methods=["GET", "POST"])
def save():
    """
    request: json = {'user_id' = 'int', 'task_text' = 'str'}
    response: json = {'ok': 'bool', 'task_id' = 'int'}
    """
    data = request.json
    user_id = data['user_id']
    task_text = data['task_text']
    connection = connection_pool.get_connection()
    cur = connection.cursor()

    try:
        cur.execute('INSERT INTO tasks_test (user_id, text, status) VALUES ('
                    '%s, %s, %s)', (user_id, task_text, 0))
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    else:
        connection.commit()
        task_id = cur.lastrowid

        return jsonify({'ok': True, 'task_id': task_id})
    finally:
        cur.close()
        connection.close()


@app.route("/delete", methods=["POST"])
def delete():
    """
    request: 'task_id' = 'int'
    response: json =  {'ok': True}
    """
    task_id = request.json

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    try:
        cur.execute('DELETE FROM tasks_test WHERE id = %s', (task_id, ))
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    else:
        connection.commit()

        return jsonify({"ok": True})
    finally:
        cur.close()
        connection.close()


@app.route("/finish_task", methods=["GET", "POST"])
def finish_task():
    """
    request: json = {"task_id": "int", "status": "int}
    response: json = {"ok": True}
    """
    data = request.json
    task_id = data["task_id"]
    task_status = int(data['status'])

    connection = connection_pool.get_connection()
    cur = connection.cursor()
    try:
        cur.execute('UPDATE tasks_test SET status = %s WHERE id = %s',
                    (task_status, task_id))
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    else:
        connection.commit()

        return jsonify({"ok": True})
    finally:
        cur.close()
        connection.close()


if __name__ == "__main__":
    app.run(debug=True)

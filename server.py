from flask import Flask, render_template, request, jsonify
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
    request: json = {userName: 'str'}
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_name = data['userName']

        cur.execute('SELECT * FROM users WHERE user_name = %s', (user_name,))

        cur.fetchall()
        count = cur.rowcount

        if count == 1:
            return jsonify({'ok': True, 'error_code': None,
                            'error_message': None})
        else:
            return jsonify({"ok": False, "error_code": None, 
                            "error_message": "No user " + user_name + " or incorrect password"})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


@app.route('/user_register', methods=['GET', 'POST'])
def user_register():
    """
    request: json = {userName: 'str'}
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_name = data['newUserName']

        cur.execute('SELECT * FROM users WHERE user_name = %s', (user_name,))

        cur.fetchall()
        count = cur.rowcount

        if count > 0:
            return jsonify({'ok': False, 'error_code': 1062, 'error_message': None})

        cur.execute('INSERT INTO users (user_name) VALUES (%s)', (user_name,))

        connection.commit()

        return jsonify({'ok': True, 'error_code': None, 'error_message': None})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()

@app.route("/user_delete", methods=["GET", "POST"])
def user_delete():
    """
    request: json = {"userName": "str"}
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """
    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_name = data["userName"]

        cur.execute("DELETE FROM users WHERE user_name = %s", (user_name,))

        connection.commit()

        return jsonify({"ok": True, "error_code": None, 
                        "error_message": None})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


@app.route("/load", methods=['GET', 'POST'])
def load():
    """
    request: user_name = 'str'
    response:
    if OK = True: json = {'ok': 'bool', 'user_id':
    'int', 'tasks': [ {"task_id": "int", "user_id": "int" "task_text":
    "text", "status": "str"}, ....... ]
    if OK = False: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_name = data['userName']
        tasks = []

        cur.execute('SELECT id FROM users WHERE user_name = %s', (user_name,))

        id_list = cur.fetchall()

        if id_list:
            user_id = id_list[0][0]

            cur.execute('SELECT * from tasks_test WHERE user_id = %s',
                        (user_id,))
            for task in cur:
                tasks.append({"task_id": task[0], "user_id": task[1],
                              "task_text": task[2],
                              "status": bool(task[3])})
            return jsonify({'ok': True, 'user_id': user_id, 'tasks': tasks})
        else:
            return jsonify({'ok': False})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


@app.route("/save", methods=["GET", "POST"])
def save():
    """
    request: json = {'userId' = 'int', 'taskText' = 'str'}
    response:
    if OK = True: json = {'ok': 'bool', 'task_id' = 'int'}
    if OK = False : json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_id = data['userId']
        task_text = data['taskText']

        cur.execute('INSERT INTO tasks_test (user_id, text, status) VALUES ('
                    '%s, %s, %s)', (user_id, task_text, 0))

        connection.commit()
        task_id = cur.lastrowid

        return jsonify({'ok': True, 'task_id': task_id})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


@app.route("/delete", methods=["POST"])
def delete():
    """
    request: 'task_id' = 'int'
    response:
    if OK = True: json =  {'ok': True}
    if OK = False : json = {'ok': 'bool', 'error_code': 'int' or None,
    'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        task_id = data['taskId']

        cur.execute('DELETE FROM tasks_test WHERE id = %s', (task_id,))

        connection.commit()

        return jsonify({"ok": True})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


@app.route("/finish_task", methods=["GET", "POST"])
def finish_task():
    """
    request: json = {"taskId": "int", "status": "int}
    response:
    if OK = True: json =  {'ok': True}
    if OK = False : json = {'ok': 'bool', 'error_code': 'int' or None,
    'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        task_id = data["taskId"]
        task_status = int(data['status'])

        cur.execute('UPDATE tasks_test SET status = %s WHERE id = %s',
                    (task_status, task_id))

        connection.commit()

        return jsonify({"ok": True})
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, render_template, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib
import random
import mysql.connector
from mysql.connector import pooling

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config['JSON_AS_ASCII'] = False

static_salt = "pcdo2g0w2Bra6MT_SAy6XGjv6pqzBvebAUGJDpE-sVhZYEkFfLN4ig72L5GdcDlg"

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
    request: json = {"userName": 'str', "password": "str"}
    response: json = {"ok": bool, "error_code": "int" or None,
                    "error_message": "str" or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_name = data['userName']
        user_password = data["password"]

        cur.execute('SELECT user_text_id, hashed_password FROM users WHERE user_name = %s', (user_name,))

        rows = cur.fetchall()

        if not rows:
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "Username or Password are incorrect!"})

        user_text_id = rows[0][0]
        hashed_password = rows[0][1]

        if check_password_hash(hashed_password, user_password) != True:
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "Username or Password are incorrect!"})
        
        sign = hashlib.sha256((static_salt + user_text_id).encode()).hexdigest()

        response = make_response(jsonify({"ok": True, "error_code": None,
                                        "error_message": None}))
        response.set_cookie("id", user_text_id)
        response.set_cookie("sign", sign)

        return response
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

@app.route("/load_tasks", methods=["GET", "POST"])
def load_tasks():
    
    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        tasks = []
        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "This will be disconnect in future!"})

        cur.execute('SELECT id FROM users WHERE user_text_id = %s', (user_text_id,))

        rows = cur.fetchall()

        if not rows:
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "Some Error"})
        user_id = rows[0][0]


        cur.execute('SELECT * from tasks_test WHERE user_id = %s', (user_id,))
            
        for task in cur:
            tasks.append({"task_id": task[0],
                          "task_text": task[2],
                          "status": bool(task[3])})
        return jsonify({'ok': True, 'user_id': user_id, 'tasks': tasks})
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
    request: json = {userName: 'str', password: 'str'}
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        user_name = data["newUserName"]
        user_password = data["password"]

        user_text_id = create_text_id()
        hashed_password = generate_password_hash(user_password)

        cur.execute('INSERT INTO users (user_text_id, user_name, hashed_password) VALUES (%s, %s, %s)'
                    , (user_text_id, user_name, hashed_password,))

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
    request: cookies: "id", "sign"
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """
    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "This will be disconnect in future!"})


        cur.execute("DELETE FROM users WHERE user_text_id = %s", (user_text_id,))

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
        task_text = data['taskText']

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "This willbe disconnect in future!"})
        cur.execute("SELECT id FROM users WHERE user_text_id = %s", (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

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

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "This will be disconnect in future!"})

        cur.execute("SELECT id FROM users where user_text_id = %s", (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]


        cur.execute('DELETE FROM tasks_test WHERE id = %s and user_id = %s', (task_id, user_id,))

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
        
        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            return jsonify({"ok": False, "error_code": None,
                            "error_message": "This will be disconnect in future!"})
        
        cur.execute("SELECT id FROM users WHERE user_text_id = %s", (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

        cur.execute('UPDATE tasks_test SET status = %s WHERE id = %s and user_id = %s',
                    (task_status, task_id, user_id,))

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

def create_text_id():
    symbols = list("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_")
    salt = random.choices(symbols, k=64)

    return "".join(salt)

def  check_cookies(user_text_id, sign):
    if not user_text_id or not sign:
        return False
    
    control_sign = hashlib.sha256((static_salt + user_text_id).encode()).hexdigest()

    if sign != control_sign:
        return False
    return True 

if __name__ == "__main__":
    app.run(debug=True)

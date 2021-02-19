from flask import Flask, render_template, request, jsonify, make_response, \
    g, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from alchemy_sql import make_session, User, List, Task
import hashlib
import random
import mysql.connector
from mysql.connector import pooling
import sqlalchemy.exc
import configparser
import os
import sys
import traceback

# TODO try resolve code duplicate in functions

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config['JSON_AS_ASCII'] = False

# Read configs from 'server_config.ini'
config = configparser.ConfigParser()
config.read(os.path.dirname(__file__) + '/server_config.ini')
db_config = config['data_base']
security_config = config['security']
cookies_config = config['cookies']

static_salt = security_config['static_salt']

# Pool connection add
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name=db_config['pool_name'],
    pool_size=int(db_config['pool_size']),
    pool_reset_session=bool(db_config['pool_reset_session']),
    host=db_config['host'],
    port=db_config['port'],
    user=db_config['user'],
    password=db_config['password'],
    database=db_config['database']
)

routes_to_check = ["/create_list", "/delete_list"]

# print("Connection Pool Name - ", connection_pool.pool_name)
# print("Connection Pool Size - ", connection_pool.pool_size)


@app.before_request
def dev_check():
    access_mode = config["access"]["access_mode"]
    if request.path == "/auth_check" or request.path == "/user_login" or \
            request.path == "/user_register":
        if access_mode == "developer":

            dev_cookie = request.cookies.get("developer")
            dev_cookie_sign = request.cookies.get("developer_sign")

            if not check_cookies(dev_cookie, dev_cookie_sign):
                response = make_response(
                    {
                        "ok": False,
                        "error_message": "Sorry, this app is working only for "
                                         "developers now. Will be worked soon;)"
                    },
                    403
                )

                return response


@app.before_request
def before_request():
    if request.path in routes_to_check:
        session = None
        try:
            user_text_id = request.cookies.get("id")
            sign = request.cookies.get("sign")

            if not check_cookies(user_text_id, sign):
                response = make_response(
                    {
                        "ok": False,
                        "error_code": 401,
                        "error_message": "Disconnect"

                    }, 401
                )

                return response

            session = make_session()

            query = session.query(User).filter(
                User.user_text_id == user_text_id)

            user = query.first()

            if not user:
                response = make_response(
                    {
                        "ok": False,
                        "error_code": 401,
                        "error_message": "Not Authorized!"
                    }, 401
                )

                return response
        except mysql.connector.Error as error:
            return jsonify({'ok': False, 'error_code': error.errno,
                            'error_message': error.msg})
        except sqlalchemy.exc.SQLAlchemyError as error:
            return jsonify(
                {
                    "ok": False,
                    "error": error
                }
            )
        except Exception as error:
            return jsonify({'ok': False, 'error_code': None,
                            'error_message': error.args[0]})
        finally:
            if session is not None:
                session.close()


@app.teardown_appcontext
def teardown_appcontext(err):
    if hasattr(g, "cur"):
        print(g.cur)
        g.cur.close()
    if hasattr(g, "connection"):
        print(g.connection)
        g.connection.close()


@app.route("/")
def main():
    user_language = request.accept_languages[0][0]

    return redirect(url_for('change_language', lang=user_language))


@app.route('/<lang>', methods=['GET', 'POST'])
def change_language(lang):
    local = configparser.ConfigParser()

    if lang == 'ru':
        local.read('localisation/localisation_ru.ini')

        response = make_response(render_template('index.html',
                                                 data=config_to_dict(local)))
        response.set_cookie('lang', 'ru')

        return response
    elif lang == 'en':
        local.read('localisation/localisation_en.ini')

        response = make_response(render_template('index.html',
                                                 data=config_to_dict(local)))
        response.set_cookie('lang', 'en')

        return response
    else:
        local.read('localisation/localisation_en.ini')

        response = make_response(render_template('index.html',
                                                 data=config_to_dict(local)))
        return response


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

        cur.execute('INSERT INTO users (user_text_id, user_name, '
                    'hashed_password) VALUES (%s, %s, %s)', 
                    (user_text_id, user_name, hashed_password,))

        new_user_id = cur.lastrowid

        cur.execute('INSERT INTO lists (user_id, name) VALUES (%s, %s)',
                    (new_user_id, 'main'))

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


@app.route('/change_password', methods=['GET', 'POST'])
def change_password():
    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        old_password = data['oldPassword']
        new_password = data['newPassword']

        user_text_id = request.cookies.get('id')
        sign = request.cookies.get('sign')

        if not check_cookies(user_text_id, sign):
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute('SELECT hashed_password FROM users WHERE user_text_id = '
                    '%s', (user_text_id,))

        rows = cur.fetchall()

        if not rows:
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            return response

        hashed_password = rows[0][0]

        if not check_password_hash(hashed_password, old_password):
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Your password are incorrect!"
                }), 401)

            return response

        new_hashed_password = generate_password_hash(new_password)

        cur.execute('UPDATE users SET hashed_password = %s WHERE '
                    'user_text_id = %s',
                    (new_hashed_password, user_text_id))

        connection.commit()

        response = make_response(jsonify({
            "ok": True
        }), 200)
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


@app.route('/user_login', methods=['GET', 'POST'])
def user_login():
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

        cur.execute('SELECT user_text_id, user_name, hashed_password FROM '
                    'users WHERE user_name = %s', (user_name,))

        rows = cur.fetchall()

        if not rows:
            response = make_response(
                jsonify(
                    {
                        'ok': False,
                        'error_message': 'Username or Password are incorrect!'
                    }
                ), 401)
            return response

        user_text_id = rows[0][0]
        user_name = rows[0][1]
        hashed_password = rows[0][2]

        if not check_password_hash(hashed_password, user_password):
            response = make_response(
                jsonify(
                    {
                        'ok': False,
                        'error_message': 'Username or password are incorrect!'
                    }
                ), 401)

            return response

        sign = hashlib.sha256()
        sign.update(static_salt.encode())
        sign.update(user_text_id.encode())
        sign = sign.hexdigest()

        response = make_response(jsonify(
            {
                "ok": True,
                "user_name": user_name
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        if user_name == "dima87g":
            response = make_dev(response)

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
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute("DELETE FROM users WHERE user_text_id = %s",
                    (user_text_id,))

        connection.commit()

        response = make_response(jsonify(
            {
                "ok": True,
                "error_code": None,
                "error_message": None
            }), 200)

        response.delete_cookie("id")
        response.delete_cookie("sign")

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


@app.route("/save_task", methods=["GET", "POST"])
def save_task():
    """
    request: json = {'taskText' = 'str', 'parentId' = 'int'}
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
        list_id = data["listId"]
        task_text = data['taskText']
        parent_id = data['parentId']

        if parent_id:
            return make_response({"ok": False}, 403)

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            response = make_response(jsonify(
                {
                    "ok": False,
                    "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute("SELECT id FROM users WHERE user_text_id = %s",
                    (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

        cur.execute("SELECT * FROM lists WHERE id = %s AND user_id = %s",
                    (list_id, user_id))

        rows = cur.fetchall()

        if not rows:
            response = make_response(jsonify(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "List is not exists!"
                }
            ), 200)

            return response

        cur.execute('INSERT INTO tasks (user_id, text, status, parent_id, '
                    'list_id) '
                    'VALUES ( '
                    '%s, %s, %s, %s, %s)', (user_id, task_text, 0, parent_id,
                                            list_id))

        task_id = cur.lastrowid

        cur.execute('UPDATE tasks SET task_position = %s WHERE id = %s',
                    (task_id, task_id))

        connection.commit()

        response = make_response(jsonify(
            {
                "ok": True,
                "task_id": task_id
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        return response
    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except Exception as error:
        print(error)
        return jsonify({'ok': False, 'error_code': None,
                        'error_message': error.args[0]})
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


@app.route('/save_edit_task', methods=['GET', 'POST'])
def save_edit_task():
    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json
        task_id = data['taskId']
        task_text = data['taskText']

        user_text_id = request.cookies.get('id')
        sign = request.cookies.get('sign')

        if not check_cookies(user_text_id, sign):
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute('SELECT id FROM users WHERE user_text_id = %s',
                    (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

        cur.execute('UPDATE tasks SET text = %s WHERE id = %s AND user_id = '
                    '%s', (task_text, task_id, user_id))

        connection.commit()

        response = make_response(jsonify(
            {
                "ok": True
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )

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


@app.route("/delete_task", methods=["POST"])
def delete_task():
    """
    request: 'taskId' = 'int'
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
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 200)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute("SELECT id FROM users where user_text_id = %s",
                    (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

        cur.execute("SELECT * FROM tasks WHERE id = %s AND user_id = %s",
                    (task_id, user_id))

        rows = cur.fetchall()

        if not rows:
            response = make_response(jsonify(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "Task is not exists!"
                }), 200)

            return response

        cur.execute('DELETE FROM tasks WHERE id = %s and user_id = %s',
                    (task_id, user_id,))

        connection.commit()

        response = make_response(jsonify(
            {
                "ok": True
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
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
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute("SELECT id FROM users WHERE user_text_id = %s",
                    (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

        cur.execute('UPDATE tasks SET status = %s WHERE id = %s and user_id '
                    '= %s',
                    (task_status, task_id, user_id,))

        connection.commit()

        response = make_response(jsonify(
            {
                "ok": True
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
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


@app.route("/change_position", methods=["POST"])
def change_position():
    """
    request: json = {"currentTaskId": "int", "currentTaskPosition": "int,
    "taskToSwapID: "int", "taskToSwapPosition: "int"}
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

        current_task_id = data["currentTaskId"]
        current_task_position = data["currentTaskPosition"]
        task_to_swap_id = data["taskToSwapId"]
        task_to_swap_position = data["taskToSwapPosition"]

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute("SELECT id FROM users WHERE user_text_id = %s",
                    (user_text_id,))

        rows = cur.fetchall()
        user_id = rows[0][0]

        cur.execute('UPDATE tasks SET task_position = %s WHERE id = %s and '
                    'user_id = %s',
                    (task_to_swap_position, current_task_id, user_id,))
        cur.execute('UPDATE tasks SET task_position = %s WHERE id = %s AND '
                    'user_id = %s',
                    (current_task_position, task_to_swap_id, user_id,))

        connection.commit()

        response = make_response(jsonify(
            {
                "ok": True
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
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


@app.route("/auth_check", methods=["GET", "POST"])
def auth_check():
    connection = None
    cur = None

    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            response = make_response(jsonify(
                {
                    "ok": False
                }), 200)
            return response

        cur.execute("SELECT * FROM users WHERE user_text_id = %s",
                    (user_text_id,))

        rows = cur.fetchall()

        if not rows:
            response = make_response(jsonify(
                {
                    "ok": False
                }
            ), 200)

            return response

        response = make_response(jsonify(
            {
                "ok": True
            }), 200)
        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config['MAX_AGE'])
                            )
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
    # TODO Check if list id exists even user auth is correct
    try:
        connection = connection_pool.get_connection()
        cur = connection.cursor()

        data = request.json

        tasks = []
        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        if not check_cookies(user_text_id, sign):
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        cur.execute('SELECT id, user_name FROM users WHERE user_text_id = %s',
                    (user_text_id,))

        rows = cur.fetchall()

        if not rows:
            response = make_response(jsonify(
                {
                    "ok": False, "error_code": 401,
                    "error_message": "Disconnect"
                }), 401)
            response.delete_cookie("id")
            response.delete_cookie("sign")

            return response

        user_id = rows[0][0]
        user_name = rows[0][1]

        cur.execute('SELECT id, name FROM lists WHERE user_id = %s',
                    (user_id,))

        rows = cur.fetchall()

        lists_dict = {}

        for list_info in rows:
            lists_dict[list_info[0]] = list_info[1]

        if data["listId"]:
            list_id = data["listId"]
        else:
            cur.execute(
                'SELECT id FROM lists WHERE user_id = %s AND name = %s',
                (user_id, 'main',))

            rows = cur.fetchall()

            if not rows:
                response = make_response(jsonify(
                    {
                        "ok": False, "error_code": 401,
                        "error_message": "Disconnect"
                    }), 401)
                response.delete_cookie("id")
                response.delete_cookie("sign")

                return response

            list_id = rows[0][0]

        cur.execute('SELECT * from tasks WHERE user_id = %s AND list_id = %s',
                    (user_id, list_id,))

        for task in cur:
            tasks.append({"task_id": task[0],
                          "task_text": task[2],
                          "task_status": bool(task[3]),
                          "parent_id": task[4],
                          "task_position": task[5]})

        response = make_response(jsonify(
            {
                "ok": True,
                "user_name": user_name,
                "list_id": list_id,
                "lists_dict": lists_dict,
                "tasks": tasks
            }), 200)

        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config["MAX_AGE"])
                            )
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config["MAX_AGE"])
                            )

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


@app.route("/create_list", methods=["POST"])
def create_list():
    """
    request: json = {"newListName": "str"}
    response: json = {"ok": "bool",
    """
    session = None

    try:

        user_text_id = request.cookies.get("id")

        session = make_session()

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        data = request.json

        new_list = List(user_id=user.id, name=data["newListName"])

        session.add(new_list)

        session.commit()

        response = make_response(
            {
                "ok": True,
                "new_list_id": new_list.id
            }, 200
        )

        return response

    except mysql.connector.Error as error:
        return jsonify({'ok': False, 'error_code': error.errno,
                        'error_message': error.msg})
    except sqlalchemy.exc.SQLAlchemyError as error:
        return jsonify(
            {
                "ok": False,
                "Error": error
            }
        )
    except Exception as error:
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": error.args[0]
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/delete_list", methods=["POST"])
def delete_list():
    session = None

    try:
        lists_dict = {}
        tasks = []

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")
        data = request.json

        list_id = data["listId"]

        session = make_session()

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        query = session.query(List).filter(List.user_id == user.id, List.id ==
                                           list_id)

        list_to_delete = query.first()

        session.delete(list_to_delete)

        query = session.query(List).filter(List.user_id == user.id,
                                           List.name == "main")

        main_list = query.first()

        query = session.query(List).filter(List.user_id == user.id)

        user_lists = query.all()

        for row in user_lists:
            lists_dict[row.id] = row.name

        query = session.query(Task).filter(Task.user_id == user.id,
                                           Task.list_id == main_list.id)

        rows = query.all()

        for task in rows:
            tasks.append(
                {
                    "task_id": task.id,
                    "task_text": task.text,
                    "task_status": bool(task.status),
                    "patent_id": task.parent_id,
                    "task_position": task.task_position
                }
            )

        session.commit()

        response = make_response(
            {
                "ok": True,
                "user_name": user.user_name,
                "list_id": main_list.id,
                "lists_dict": lists_dict,
                "tasks": tasks
            }
        )

        response.set_cookie("id", user_text_id,
                            max_age=int(cookies_config["MAX_AGE"]))
        response.set_cookie("sign", sign,
                            max_age=int(cookies_config["MAX_AGE"]))

        return response
    except sqlalchemy.exc.SQLAlchemyError as error:
        tb = sys.exc_info()
        traceback.print_exception(*tb)
        return jsonify(
            {
                "ok": False,
                "Error": error.args
            }
        )
    except Exception as error:
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": error.args[0]
            }
        )
    finally:
        if session is not None:
            session.close()


# Service functions
def create_text_id():
    symbols = list(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_"
    )
    salt = random.choices(symbols, k=64)

    return "".join(salt)


def make_dev(response):
    dev_cookie = create_text_id()
    dev_cookie_sign = hashlib.sha256()
    dev_cookie_sign.update(static_salt.encode())
    dev_cookie_sign.update(dev_cookie.encode())
    dev_cookie_sign = dev_cookie_sign.hexdigest()

    response.set_cookie("developer", dev_cookie, max_age=60*60*24*7)
    response.set_cookie("developer_sign", dev_cookie_sign, max_age=60*60*24*7)

    return response


def check_cookies(user_text_id: str, sign: str):
    if not user_text_id or not sign:
        return False

    control_sign = hashlib.sha256()
    control_sign.update(static_salt.encode())
    control_sign.update(user_text_id.encode())
    control_sign = control_sign.hexdigest()

    if sign != control_sign:
        return False
    return True


def config_to_dict(config_file) = > dict:
    out_dict = {}

    for section in config_file.sections():
        out_dict[section] = {}
        for key, value in config_file.items(section):
            out_dict[section][key] = value

    return out_dict


def debug_print(debug_output):
    print()
    print('*' * 40)
    print('*' * 40)
    print()
    print(debug_output)
    print()
    print('*' * 40)
    print('*' * 40)
    print()


if __name__ == "__main__":
    app.run(debug=True)

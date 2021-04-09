from flask import Flask, render_template, request, jsonify, make_response, \
    redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from alchemy_sql import make_session, User, List, Task
import hashlib
import random
import sqlalchemy.exc
import configparser
import os
import sys
import logger_man

# TODO try resolve code duplicate in functions

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config['JSON_AS_ASCII'] = False

logger = logger_man.LoggerMan()

config = configparser.ConfigParser()
config.read(os.path.dirname(__file__) + '/server_config.ini')
security_config = config['security']
cookies_config = config['cookies']

static_salt = security_config['static_salt']

developers = [
    "dima87g",
    "test",
]

routes_to_check = [
    "/create_list",
    "/delete_list",
    "/change_password",
    "/user_delete",
    "/save_task",
    "/save_edit_task",
    "/delete_task",
    "/finish_task",
    "/change_position",
    "/load_tasks",
    "/auth_check",
]

routes_to_dev_check = [
    "/auth_check",
    "/user_register",
]


# print("Connection Pool Name - ", connection_pool.pool_name)
# print("Connection Pool Size - ", connection_pool.pool_size)


@app.before_request
def dev_check():
    access_mode = config["access"]["access_mode"]
    if access_mode == "developer":
        data = request.json
        if (request.path in routes_to_dev_check and data is not None and data["userName"] not in developers) or \
                (request.path == "/user_login" and
                 data is not None and data["userName"] and data["userName"]
                 not in developers):
            dev_cookie = request.cookies.get("developer")
            dev_cookie_sign = request.cookies.get("developer_sign")

            if not check_cookies(dev_cookie, dev_cookie_sign):
                response = make_response(
                    {
                        "ok": False,
                        "error_message": "Sorry, this app is working only "
                                         "for developers now. Will be worked soon;)"
                    }, 403
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
                if request.path == "/auth_check":
                    response = make_response(
                        {
                            "ok": False,
                            "error_code": 401,
                            "error_message": None
                        }, 200
                    )
                    return response
                else:
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

        except sqlalchemy.exc.SQLAlchemyError:
            session.rollback()
            exception = sys.exc_info()
            logger.log(exception)
            return jsonify(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "Contact admin for log checking..."
                }
            )
        except BaseException:
            session.rollback()
            exception = sys.exc_info()
            logger.log(exception)
            return jsonify(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "Contact admin for log checking..."
                }
            )
        finally:
            if session is not None:
                session.close()


@app.route("/auth_check", methods=["GET", "POST"])
def auth_check():
    try:
        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        response = make_response(
            {
                "ok": True
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except BaseException:
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )


@app.route("/")
def main():
    user_language = request.cookies.get('lang')

    if not user_language:
        user_language = request.accept_languages[0][0]
    return redirect(url_for('change_language', lang=user_language))


@app.route("/<lang>", methods=["GET", "POST"])
def change_language(lang):
    try:
        local = configparser.ConfigParser()

        if lang == "ru" or lang == "ru-RU":
            local.read(os.path.join(os.path.dirname(__file__), "localisation/localisation_ru.ini"))
            cookie_lang = "ru"
        elif lang == "en" or lang == "en-US":
            local.read(os.path.join(os.path.dirname(__file__), "localisation/localisation_en.ini"))
            cookie_lang = "en"
        else:
            local.read(os.path.join(os.path.dirname(__file__), "localisation/localisation_en.ini"))
            cookie_lang = "en"

        response = make_response(
            render_template(
                "index.html",
                data=config_to_dict(local)
            )
        )
        response.set_cookie(
            "lang", cookie_lang, max_age=int(cookies_config["MAX_AGE"])
        )
        return response
    except Exception:
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                'ok': False,
                'error_code': None,
                'error_message': 'Contact admin for log checking...'
            }
        )


@app.route('/user_register', methods=['GET', 'POST'])
def user_register():
    # TODO Make check if user is exists and return correct response from view
    #  function, not via error exception
    """
    request: json = {newUserName: 'str', password: 'str'}
    response: json = {'ok': 'bool', 'error_code': 'int' or None,
     'error_message': 'str' or None}
    """

    session = None

    try:
        session = make_session()

        data = request.json
        user_name = data["userName"]
        user_password = data["password"]

        user_text_id = create_text_id()
        hashed_password = generate_password_hash(user_password)

        new_user = User(
            user_text_id=user_text_id,
            user_name=user_name,
            hashed_password=hashed_password
        )

        session.add(new_user)

        session.commit()

        new_user_id = new_user.id

        new_list = List(user_id=new_user_id, name='main')

        session.add(new_list)

        session.commit()

        response = make_response(
            {
                'ok': True
            }, 200
        )
        if user_name in developers:
            response = make_dev(response)
        return response
    except sqlalchemy.exc.IntegrityError as error:
        session.rollback()
        debug_print(error.__dict__)
        return jsonify(
            {
                'ok': False,
                'error_code': 1062,
                'error_message': 'Contact admin for log checking...'
            }
        )
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                'ok': False,
                'error_code': None,
                'error_message': 'Contact admin for log checking...'
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                'ok': False,
                'error_code': None,
                'error_message': 'Contact admin for log checking...'
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route('/change_password', methods=['GET', 'POST'])
def change_password():
    """
    request: json = {oldPassword: "str", newPassword: "str"}
    response: json = {"ok": bool, "error_code": "int" or None,
                    "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        data = request.json
        old_password = data['oldPassword']
        new_password = data['newPassword']

        user_text_id = request.cookies.get('id')
        sign = request.cookies.get('sign')

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        hashed_password = user.hashed_password

        if not check_password_hash(hashed_password, old_password):
            response = make_response(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "Your password are incorrect!"
                }, 200
            )
            return response

        new_hashed_password = generate_password_hash(new_password)

        user.hashed_password = new_hashed_password

        session.commit()

        response = make_response(
            {
                "ok": True
            }, 200
        )

        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", signmax_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                'ok': False,
                'error_code': None,
                'error_message': 'Contact admin for log checking...'
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                'ok': False,
                'error_code': None,
                'error_message': 'Contact admin for log checking...'
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route('/user_login', methods=['GET', 'POST'])
def user_login():
    """
    request: json = {userName: "str", password: "str"}
    response: json = {"ok": "bool", "error_code": "int" or None,
                    "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        data = request.json
        user_name = data['userName']
        user_password = data["password"]

        query = session.query(User).filter(User.user_name == user_name)

        user = query.first()

        if not user:
            response = make_response(
                jsonify(
                    {
                        "ok": False,
                        "error_code": 401,
                        "error_message": "Username or Password are incorrect!"
                    }
                ), 401
            )
            return response

        user_text_id = user.user_text_id
        user_name = user.user_name
        hashed_password = user.hashed_password

        if not check_password_hash(hashed_password, user_password):
            response = make_response(
                jsonify(
                    {
                        "ok": False,
                        "error_code": 401,
                        "error_message": "Username or password are incorrect!"
                    }
                ), 401
            )
            return response
        sign = hashlib.sha256()
        sign.update(static_salt.encode())
        sign.update(user_text_id.encode())
        sign = sign.hexdigest()

        response = make_response(
            {
                "ok": True,
                "user_name": user_name
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )

        if user_name in developers:
            response = make_dev(response)
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": 'Contact admin for log checking...'
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": 'Contact admin for log checking...'
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/user_delete", methods=["GET", "POST"])
def user_delete():
    """
    request: cookies: "id", "sign"
    response: json = {"ok": "bool", "error_code": "int" or None,
                    "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        user_text_id = request.cookies.get("id")

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user_to_delete = query.first()

        session.delete(user_to_delete)

        session.commit()

        response = make_response(
            {
                "ok": True,
                "error_code": None,
                "error_message": None
            }, 200
        )

        response.delete_cookie("id")
        response.delete_cookie("sign")
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/save_task", methods=["GET", "POST"])
def save_task():
    """
    request: json = {taskText = "str", parentId = "int"}
    response:
    if OK = True: json = {"ok": "bool", "task_id" = "int"}
    if OK = False : json = {"ok": "bool", "error_code": "int" or None,
                            "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")
        data = request.json
        list_id = data["listId"]
        task_text = data["taskText"]
        parent_id = data["parentId"]
        task_position = data["taskPosition"]

        if parent_id:
            return make_response(
                {
                    "ok": False
                }, 403
            )

        query = session.query(User).filter(
            User.user_text_id == user_text_id
        )

        user = query.first()
        user_id = user.id

        query = session.query(List).filter(
            List.id == list_id, List.user_id == user_id
        )

        current_list = query.first()

        if not current_list:
            response = make_response(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "List is not exists!"
                }, 204
            )
            return response

        new_task = Task(
            user_id=user_id,
            text=task_text,
            parent_id=parent_id,
            list_id=list_id,
            task_position=task_position,
        )

        session.add(new_task)

        session.commit()

        task_id = new_task.id

        response = make_response(
            {
                "ok": True,
                "task_id": task_id,
                "task_position": task_position
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route('/save_edit_task', methods=['GET', 'POST'])
def save_edit_task():
    """
    request: json = {taskId = "int", taskText = "str"}
    response:
    if OK = True: json = {"ok": "bool"}
    if OK = False : json = {"ok": "bool", "error_code": "int" or None,
                            "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        user_text_id = request.cookies.get('id')
        sign = request.cookies.get('sign')
        data = request.json
        task_id = data["taskId"]
        task_text = data["taskText"]

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()
        user_id = user.id

        query = session.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user_id
        )

        task_to_update = query.first()

        task_to_update.text = task_text

        session.commit()

        response = make_response(
            {
                "ok": True
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/delete_task", methods=["POST"])
def delete_task():
    """
    request: json = {taskId = "int"}
    response:
    if OK = True: json =  {"ok": "bool"}
    if OK = False : json = {"ok": "bool", "error_code": "int" or None,
                            "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")
        data = request.json
        task_to_delete_id = data['taskId']

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        user_id = user.id

        query = session.query(Task).filter(
            Task.id == task_to_delete_id,
            Task.user_id == user_id
        )

        task_to_delete = query.first()

        if not task_to_delete:
            response = make_response(
                {
                    "ok": False,
                    "error_code": None,
                    "error_message": "Task is not exists!"
                }, 204
            )
            return response

        session.delete(task_to_delete)

        session.commit()

        response = make_response(
            {
                "ok": True
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError :
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/finish_task", methods=["GET", "POST"])
def finish_task():
    """
    request: json = {taskId: "int", status: "int}
    response:
    if OK = True: json =  {"ok": "bool"}
    if OK = False : json = {"ok": "bool', "error_code": "int" or None,
                            "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")
        data = request.json
        task_id = data["taskId"]
        task_status = int(data['status'])

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        user_id = user.id

        query = session.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user_id
        )

        task = query.first()

        task.status = task_status

        session.commit()

        response = make_response(
            {
                "ok": True
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception as error:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/change_position", methods=["POST"])
def change_position():
    """
    request: json = {currentTaskId: "int", currentTaskPosition: "int",
                    taskToSwapID: "int", taskToSwapPosition: "int"}
    response:
    if OK = True: json =  {"ok": "bool"}
    if OK = False : json = {"ok": "bool", "error_code": "int" or None,
                            "error_message": "str" or None}
    """
    session = None

    try:
        session = make_session()

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")
        data = request.json
        current_task_id = data["currentTaskId"]
        current_task_position = data["currentTaskPosition"]

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        user_id = user.id

        query = session.query(Task).filter(
            Task.id == current_task_id,
            Task.user_id == user_id
        )

        current_task = query.first()

        current_task.task_position = current_task_position

        session.commit()

        response = make_response(
            {
                "ok": True
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config['MAX_AGE'])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config['MAX_AGE'])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


@app.route("/load_tasks", methods=["GET", "POST"])
def load_tasks():
    """
    request: cookies: "id", "sign"
    response: json = {"ok": "bool", "error_code": "int" or None,
                    "error_message": "str" or None}
    """
    session = None

    try:
        tasks = []

        session = make_session()

        data = request.json

        user_text_id = request.cookies.get("id")
        sign = request.cookies.get("sign")

        query = session.query(User).filter(User.user_text_id == user_text_id)

        user = query.first()

        user_id = user.id
        user_name = user.user_name

        query = session.query(List).filter(List.user_id == user_id)

        current_user_lists = query.all()

        lists_dict = {}

        for list_info in current_user_lists:
            lists_dict[list_info.id] = list_info.name

        if data["listId"]:
            current_list_id = data["listId"]
        else:
            query = session.query(List).filter(
                List.user_id == user_id,
                List.name == "main"
            )

            current_list = query.first()

            if not current_list:
                response = make_response(
                    {
                        "ok": False,
                        "error_code": 401,
                        "error_message": "Disconnect"
                    }, 401
                )
                response.delete_cookie("id")
                response.delete_cookie("sign")
                return response
            current_list_id = current_list.id

        query = session.query(Task).filter(
            Task.user_id == user_id,
            Task.list_id == current_list_id
        )

        current_tasks = query.all()

        for task in current_tasks:
            tasks.append(
                {
                    "task_id": task.id,
                    "task_text": task.text,
                    "task_status": bool(task.status),
                    "parent_id": task.parent_id,
                    "task_position": task.task_position
                }
            )

        response = make_response(
            {
                "ok": True,
                "user_name": user_name,
                "list_id": current_list_id,
                "lists_dict": lists_dict,
                "tasks": tasks
            }, 200
        )
        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config["MAX_AGE"])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config["MAX_AGE"])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    finally:
        if session is not None:
            session.close()


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
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
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

        query = session.query(List).filter(
            List.user_id == user.id,
            List.id == list_id
        )

        list_to_delete = query.first()

        session.delete(list_to_delete)

        query = session.query(List).filter(
            List.user_id == user.id,
            List.name == "main"
        )

        main_list = query.first()

        query = session.query(List).filter(List.user_id == user.id)

        user_lists = query.all()

        for row in user_lists:
            lists_dict[row.id] = row.name

        query = session.query(Task).filter(
            Task.user_id == user.id,
            Task.list_id == main_list.id
        )

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

        response.set_cookie(
            "id", user_text_id, max_age=int(cookies_config["MAX_AGE"])
        )
        response.set_cookie(
            "sign", sign, max_age=int(cookies_config["MAX_AGE"])
        )
        return response
    except sqlalchemy.exc.SQLAlchemyError:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
            }
        )
    except Exception:
        session.rollback()
        exception = sys.exc_info()
        logger.log(exception)
        return jsonify(
            {
                "ok": False,
                "error_code": None,
                "error_message": "Contact admin for log checking..."
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

    response.set_cookie("developer", dev_cookie, max_age=60 * 60 * 24 * 7)
    response.set_cookie("developer_sign", dev_cookie_sign, max_age=60 * 60 * 24 * 7)

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


def config_to_dict(config_file) -> dict:
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

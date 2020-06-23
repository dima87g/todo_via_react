class TaskList {
    constructor() {
        this.userId = undefined;
        this.tasks = [];
    }

    addTask() {
        /**
         * POST: json = {'user_id': 'number', taskText = 'string'}
         * GET:
         * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        const self = this;
        if (document.getElementById("task_input_field").value) {
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value = "";
            let sendData = {'userId': this.userId, 'taskText': taskText};

            function add(answer) {
                if (answer['ok'] === true) {
                    let taskId = answer['task_id'];
                    let newTask = new Task(self, taskId, taskText);

                    self.tasks.push(newTask);

                    self.updateDom();
                }
            }
            knock_knock('save', sendData, add);
        }
    }

    finishTask(node) {
        /**
         * POST: json = {'task_id': 'number', 'status': 'boolean'}
         * GET:
         * if OK = true: json = {'ok': true}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        const self = this;
        node.status = node.status === false;
        let sendData = {"taskId": node.id, "status": node.status};

        function finish(answer) {
            if (answer['ok'] === true) {
                self.updateDom();
            }
        }
        knock_knock('finish_task', sendData, finish);
    }

    removeTask(node) {
        /**
         * POST: {taskId: 'number'}
         * GET:
         * if OK = true: json = {'ok': true}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        const self = this;
        let sendData = {'taskId': node.id}

        function remove(answer) {
            if (answer['ok'] === true) {
                self.tasks.splice(self.tasks.indexOf(node), 1);
                self.updateDom();
            }
        }
        knock_knock('delete', sendData, remove);
    }

    updateDom(tasksParentId = 'main_tasks', existsTasksClass = 'task') {
        let tasksParent = document.getElementById(tasksParentId);
        let existTasks = document.getElementsByClassName(existsTasksClass);
        let i = 0;

        for (i; i < this.tasks.length; i++) {
            if (existTasks[i]) {
                this.tasks[i].replaceTaskNode(existTasks[i]);
            } else {
                tasksParent.appendChild(this.tasks[i].createTaskNode());
            }
        }
        if (existTasks[i]) {
            // for (i; i < existTasks.length; i++) {
            //     existTasks[i].remove();
            //     i--;
            // }
            tasksParent.removeChild(tasksParent.lastChild);
        }
    }
}


class Task {
    constructor(taskList, id, text, status = false) {
        this.taskList = taskList;
        this.id = id;
        this.text = text;
        this.status = status;
    }

    createTaskNode() {
        const node = this;
        let taskDiv = document.createElement("div");
        taskDiv.setAttribute("class", "task");
        let finishButton = document.createElement("input");
        finishButton.setAttribute("type", "button");
        finishButton.setAttribute("class", "task_finish_button");

        if (this.status === false) {
            finishButton.setAttribute("value", "Выполнено");
        } else {
            finishButton.setAttribute("value", "Не выполнено");
            taskDiv.setAttribute("class", "task finished_task");
        }
        finishButton.onclick = function () {
            node.taskList.finishTask(node);
        };

        let removeButton = document.createElement("input");

        removeButton.setAttribute("type", "button");
        removeButton.setAttribute("value", "X");
        removeButton.setAttribute("class", "task_remove_button");
        removeButton.onclick = function () {
            node.taskList.removeTask(node);
        };

        let par = document.createElement("p");

        par.appendChild(document.createTextNode(this.text));
        par.setAttribute("class", "paragraph");
        taskDiv.appendChild(finishButton);
        taskDiv.appendChild(par);
        taskDiv.appendChild(removeButton);

        return taskDiv;
    }

    replaceTaskNode(existTask) {
        const node = this;
        let finishButton = existTask.getElementsByClassName("task_finish_button")[0];
        let removeButton = existTask.getElementsByClassName("task_remove_button")[0];
        existTask.getElementsByTagName("p")[0].textContent = this.text;
        if (this.status === false) {
            finishButton.setAttribute("value", "Выполнено");
            existTask.setAttribute("class", "task");
        } else {
            finishButton.setAttribute("value", "Не выполнено");
            existTask.setAttribute("class", "task finished_task");
        }
        finishButton.onclick = function () {
            node.taskList.finishTask(node);
        };
        removeButton.onclick = function () {
            node.taskList.removeTask(node);
        };
    }
}


class Login {
    constructor() {
        const self = this;
        this.switchRegisterButton = document.getElementById("register_button");
        this.switchLoginButton = document.getElementById("login_button");
        this.logInButton = document.getElementById("login_field_button");
        this.logOutButton = document.getElementById('user_logout_button');
        this.userDeleteButton = document.getElementById("user_delete_button");
        this.userRegisterButton = document.getElementById("register_form_button");

        this.switchRegisterButton.onclick = function() {
            self.switchLogin(this.value);
        }
        this.switchLoginButton.onclick = function() {
            self.switchLogin(this.value);
        }
        this.logInButton.onclick = function() {
            self.logIn();
        }
        this.logOutButton.onclick = function() {
            self.logOut();
        }
        this.userDeleteButton.onclick = function() {
            self.userDelete();
        }
        this.userRegisterButton.onclick = function() {
            self.userRegister();
        }
    }


    onLoad(userName) {
    /**
     * POST: userName = 'string'
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'user_id': 'number', 'tasks': [
     *                                          {'user_id': 'number', 'task_text': 'string', 'status': 'string'},
     *                                          ...
     *                                          ]
     *             }
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
        let sendData = {'userName': userName};

        function loadTasks(answer) {
            let authMenu = document.getElementById("auth_menu");
            let infoMessage = document.getElementById('login_form_info');

            if (answer['ok'] === true) {
                infoMessage.textContent = '';
                authMenu.style.opacity = '0';
                setTimeout(function() {
                    authMenu.style.display = 'none';
                    document.getElementById('task_input_field').focus();
                    }, 500);

                let userNameField = document.getElementById('user_name_field');
                let logOutButton = document.getElementById('logout_button');

                userNameField.appendChild(document.createTextNode(userName));
                logOutButton.disabled = false;

                let userId = answer['user_id'];
                let tasksFromServer = answer['tasks'];

                createNewTaskList(userId, tasksFromServer, 'task_input_button', 'main_tasks', 'task');

            } else {
                infoMessage.textContent = 'Проблема(((((';
                }
        }
        knock_knock('load', sendData, loadTasks);
    }

    switchLogin(val) {
        let loginWindow = document.getElementById('login_form');
        // let registerButton = document.getElementById('register_button');
        let registerWindow = document.getElementById('register_form');
        // let loginButton = document.getElementById('login_button');


        if (val === 'register') {
            windowChange(registerWindow, this.switchLoginButton, loginWindow, this.switchRegisterButton, 'login_form_info');
        } else if (val === 'login') {
            windowChange(loginWindow, this.switchRegisterButton, registerWindow, this.switchLoginButton, 'register_form_info');
        }

            function windowChange(activate, activateButton, deactivate, deactivateButton, infoFieldName) {
            let infoField = document.getElementById(infoFieldName);

            infoField.textContent = '';
            deactivate.style.opacity = '0';
            deactivateButton.disabled = true;
            activate.style.display = 'block';
            setTimeout(function () {
                activate.style.opacity = '1';
            });
            setTimeout(function () {
                deactivate.style.display = 'none';
                activateButton.disabled = false;
            }, 500);
        }
    }

    logIn() {
    /**
     * POST: json =  {userName: 'string'}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
     */
        const self = this;
        let infoMessage = document.getElementById('login_form_info');
        if (document.getElementById("login_field").value) {
            let userName = document.getElementById("login_field").value;
            document.getElementById("login_field").value = '';
            let sendData = {'userName': userName};

            function login(answer) {
                if (answer['ok'] === true) {
                    self.onLoad(userName);
                } else {
                    infoMessage.textContent = 'Авторизация не удалась =(';
                }
            }
            knock_knock('login', sendData, login);
        } else {
            infoMessage.textContent = 'Please, enter user name!';
        }
    }

    logOut() {
        let userName = document.getElementById('user_name_field');
        let logOutButton = document.getElementById('user_logout_button');
        let tasksParent = document.getElementById("main_tasks");
        let authMenu = document.getElementById('auth_menu');

        // userName.textContent = '';
        while (userName.firstChild) {
            userName.removeChild(userName.firstChild);
        }

        logOutButton.disabled = true;

        while (tasksParent.firstChild) {
            tasksParent.removeChild(tasksParent.firstChild);
        }

        authMenu.style.display = 'block';
        setTimeout(function() {
            authMenu.style.opacity = '1';
        });
    }

    userDelete() {
        function del() {

        }
        createConfirmWindow(del, "Are you sure, you want to delete user?");
    }

    userRegister() {
    /**
     * POST: json =  {newUserName: 'string'}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
     */
        let infoMessage = document.getElementById("register_form_info");
        if (document.getElementById('register_form_text').value) {
            let newUserName = document.getElementById('register_form_text').value;
            let sendData = {'newUserName': newUserName};

            function register(answer) {
            if (answer['ok'] === true) {
                infoMessage.textContent = 'New user ' + newUserName + ' successfully created!';
            } else if (answer['error_code'] === 1062) {
                infoMessage.textContent = 'Name ' + newUserName + ' is already used!';
            } else {
                infoMessage.textContent = answer['error_message'] + ' Код ошибки: ' + answer['error_code'];
            }
        }
            knock_knock('user_register', sendData, register);
        } else {
                infoMessage.textContent = 'Please, enter new user name!';
        }
    }
}


function events() {
    function noEnterRefreshLogin(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("task_input_button").click();
        }
    }

    function noEnterRefreshRegister(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("register_form_button").click();
        }
    }

    let taskInputField = document.getElementById("task_input_field");
    taskInputField.addEventListener("keydown", noEnterRefreshLogin, false);

    let registerField = document.getElementById("register_form_text");
    registerField.addEventListener('keydown', noEnterRefreshRegister, false);
}

function knock_knock(path, sendData, func) {
    if (window.fetch) {
        let init = {method: 'POST',
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: JSON.stringify(sendData)}

        fetch('http://127.0.0.1:5000/' + path, init)
            .then((answer) => {
                if (answer.ok && answer.headers.get('Content-Type') === 'application/json') {
                    return answer.json();
                }
            })
            .then((answer) => {
                func(answer);
            })
    } else {
        let req = new XMLHttpRequest();
        req.open('POST', 'http://127.0.0.1:5000/' + path);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify(sendData));

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200 && req.getResponseHeader('Content-type') === 'application/json') {
                        func(JSON.parse(req.responseText));
                }
            }
        }
    }
}

function createNewTaskList(userId, tasksFromServer, taskInputButtonId, taskParentId, existsTasksClass) {
    let taskList = new TaskList();
    let taskInputButton = document.getElementById(taskInputButtonId);

    taskInputButton.onclick = function() {
        taskList.addTask();
    }

    taskList.userId = userId;
    for (let task of tasksFromServer) {
        taskList.tasks.push(new Task(taskList, task["task_id"], task["task_text"], task["status"]));
    }
    taskList.updateDom(taskParentId, existsTasksClass);
}

function createConfirmWindow(func, message) {
    let shadow = document.getElementById("shadow");
    let confirmWindow = document.getElementById("confirm_window");
    let confirmWindowMessage = document.getElementById("confirm_window_message");
    let confirmWindowOkButton = document.getElementById("confirm_window_ok_button");
    let confirmWindowCancelbutton = document.getElementById("confirm_window_cancel_button");

}

document.addEventListener('DOMContentLoaded', function() {
    let login = new Login();
    events();
});

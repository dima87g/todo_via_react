"use strict";

class TaskList {
    constructor() {
        this.userId = undefined;
        this.tasks = [];
        this.tasksTree = new Map();
        this.loginClass = undefined;
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
            let sendData = {"taskText": taskText, "parentId": 0};

            const add = (answer) => {
                if (answer['ok'] === true) {
                    let taskId = answer['task_id'];
                    let newTask = new Task(self, taskId, taskText);

                    self.tasks.push(newTask);

                    self.updateDom();
                }
                if (answer["error_code"] === 401) {
                    this.loginClass.logOut();
                    showInfoWindow("Authorisation problem!");
                }
            }
            knock_knock('save_task', add, sendData);
        }
    }

    finishTask(node) {
        //FIXME Сделать изменение статуса задачи ТОЛЬКО после полодительного ответа от сервера, а не перед отправкой запроса на сервер.
        //FIXME Make task status change ONLY after positive answer from server, not before send request to server.
        /**
         * POST: json = {'task_id': 'number', 'status': 'boolean'}
         * GET:
         * if OK = true: json = {'ok': true}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        let taskStatus = node.status === false;
        let sendData = {"taskId": node.id, "status": taskStatus};

        const finish = (answer) => {
            if (answer['ok'] === true) {
                node.status = node.status === false;

                this.updateDom();
            }
            if (answer["error_code"] === 401) {
                this.loginClass.logOut();
                showInfoWindow("Authorisation problem!");
            }
        }
        knock_knock('finish_task', finish, sendData);
    }

    removeTask(node) {
        /**
         * POST: {taskId: 'number'}
         * GET:
         * if OK = true: json = {'ok': true}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        let sendData = {'taskId': node.id}

        const remove = (answer) => {
            if (answer['ok'] === true) {
                if (this.tasksTree.has(node.parentId)) {
                    let parentList = this.tasksTree.get(node.parentId).subtasks;
                    parentList.splice(parentList.indexOf(node), 1);
                } else {
                    this.tasks.splice(this.tasks.indexOf(node), 1);
                }
                this.tasksTree.delete(node.id);
                this.updateDom();
            } else if (answer["error_code"] === 401) {
                this.loginClass.logOut();
                showInfoWindow("Authorisation problem!");
            }
        }
        knock_knock('delete_task', remove, sendData);
    }

    updateDom() {
        let tasksParent = document.getElementById("main_tasks");
        let existTasks = document.getElementsByClassName("task");

        let linearTasksList = [];

        function linearTaskListFiller(tasks) {
            for (let task of tasks) {
                linearTasksList.push(task);
                if (task.subtasks.length > 0) {
                    linearTaskListFiller(task.subtasks);
                }
            }
        }

        linearTaskListFiller(this.tasks);

        let i = 0;

        for (i; i < linearTasksList.length; i++) {
            if (existTasks[i]) {
                linearTasksList[i].replaceTaskNode(existTasks[i]);
            } else {
                tasksParent.appendChild(linearTasksList[i].createTaskNode());
            }
        }
        while (existTasks[i]) {
            tasksParent.removeChild(tasksParent.lastChild);
        }
    }
}


class Task {
    constructor(taskList, id, text, parentId, status = false) {
        this.taskList = taskList;
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.subtasks = [];
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
        this.taskList = undefined;
        this.authMenu = document.getElementById("auth_menu");
        this.loginWindow = document.getElementById("login_window");
        this.loginWindowInfo = document.getElementById("login_window_info");
        this.loginFormUsername = document.getElementById("login_form_username");
        this.loginFormPassword = document.getElementById("login_form_password");
        this.loginButton = document.getElementById("login_form_button");
        this.registerWindow = document.getElementById("register_window");
        this.registerWindowInfo = document.getElementById("register_window_info");
        this.registerFormUsername = document.getElementById("register_form_username");
        this.registerFormPassword = document.getElementById("register_form_password");
        this.registerFormPasswordConfirm = document.getElementById("register_form_password_confirm");
        this.userRegisterButton = document.getElementById("register_form_button");
        this.switchRegisterButton = document.getElementById("register_button");
        this.switchLoginButton = document.getElementById("login_button");
        this.userNameField = document.getElementById("user_name_field");
        this.userLogOutButton = document.getElementById('user_logout_button');
        this.userDeleteButton = document.getElementById("user_delete_button");
        this.shadow = document.getElementById("shadow");
        
        this.loginFormUsername.focus();
        this.userLogOutButton.disabled = true;

        this.switchRegisterButton.onclick = function() {
            self.switchLogin(this.value);
        }
        this.switchLoginButton.onclick = function() {
            self.switchLogin(this.value);
        }
        this.loginButton.onclick = function() {
            self.logIn();
        }
        this.userLogOutButton.onclick = function() {
            self.logOut();
        }
        this.userDeleteButton.onclick = function() {
            self.userDelete();
        }
        this.userRegisterButton.onclick = function() {
            self.userRegister();
        }
    }


    switchLogin(val) {
        if (val === 'register') {
            windowChange(this.registerWindow, this.switchLoginButton, this.loginWindow, this.switchRegisterButton, this.registerFormUsername, this.loginWindowInfo);
        } else if (val === 'login') {
            windowChange(this.loginWindow, this.switchRegisterButton, this.registerWindow, this.switchLoginButton, this.loginFormUsername, this.registerWindowInfo);
        }

        function windowChange(activate, activateButton, deactivate, deactivateButton, focusField, infoField) {
            removeChilds(infoField);
            deactivate.style.opacity = '0';
            deactivateButton.disabled = true;
            activate.style.display = 'block';
            focusField.focus();
            setTimeout(function () {
                activate.style.opacity = '1';
            });
            setTimeout(function () {
                deactivate.style.display = 'none';
                activateButton.disabled = false;
            }, 500);
        }
    }


    hideLoginWindow() {
        this.loginFormUsername.value = "";
        removeChilds(this.loginWindowInfo);
        this.authMenu.style.opacity = '0';
        this.shadow.style.display = "none";

        setTimeout(() => {
            this.authMenu.style.display = 'none';
            document.getElementById('task_input_field').focus();
        }, 500);
    }


    showLoginWindow() {
        this.shadow.style.display = "block";
        removeChilds(this.userNameField);
        this.userLogOutButton.disabled = true;
        this.authMenu.style.display = 'block';
        this.loginFormUsername.focus();
        setTimeout(() => {
            this.authMenu.style.opacity = '1';
        });
    }


    onLoad() {
        /**
         * POST:
         * GET:
         * if OK = true: json = {'ok': 'boolean', 'user_id': 'number', 'tasks': [
         *                                          {"task_id": "number", 'task_text': 'string', 'status': 'string'},
         *                                          ...
         *                                          ]
         *             }
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        const loadTasks = (answer) => {
            if (answer['ok'] === true) {
                let userId = answer['user_id'];
                let userName = answer["user_name"];
                let tasksFromServer = answer['tasks'];

                if (!this.userNameField.firstChild) {
                    this.userNameField.appendChild(document.createTextNode(userName));
                    this.userLogOutButton.disabled = false;
                }

                this.taskList = new TaskList();
                this.taskList.loginClass = this;
                let taskInputButton = document.getElementById("task_input_button");

                taskInputButton.onclick = () => {
                    this.taskList.addTask();
                }

                this.taskList.userId = userId;

                let tasksTree = this.taskList.tasksTree;

                for (let task of tasksFromServer) {
                    let taskId = task["task_id"];
                    let taskText = task["task_text"];
                    let taskStatus = task["task_status"];
                    let parentId = task["parent_id"];

                    tasksTree.set(taskId, new Task(this.taskList, taskId, taskText, parentId, taskStatus));
                }

                for (let task of tasksTree.values()) {
                    if (tasksTree.has(task.parentId)) {
                        tasksTree.get(task.parentId).subtasks.push(task);
                    } else {
                        this.taskList.tasks.push(task);
                    }
                }

                this.taskList.updateDom();

            }
            if (answer["error_code"] === 401) {
                this.logOut();
                showInfoWindow("Authorisation problem!");
            }
        }
        knock_knock('load_tasks', loadTasks);
    }

    logIn() {
        /**
         * POST: json = {"userName": "string", "password": "string"}
         * GET:
         * if OK = true: json = {"ok": "boolean", "user_id": "number",
         *                         "tasks": [{"task_id": "number", "task_text": "string", "status": "boolean"},
         *                                  ..........] }
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         *                        'error_message': 'string' or null}
         */

        removeChilds(this.loginWindowInfo);
        if (this.loginFormUsername.value) {
            if (this.loginFormPassword.value) {
                let userName = this.loginFormUsername.value;
                let password = this.loginFormPassword.value;
                const sendData = {"userName": userName, "password": password};

                this.loginFormPassword.value = "";

                const login = (answer) => {
                    if (answer["ok"] === true) {
                        let userName = answer["user_name"];

                        this.userNameField.appendChild(document.createTextNode(userName));
                        this.userLogOutButton.disabled = false;

                        this.hideLoginWindow();

                        this.onLoad()
                    } else {
                        this.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
                    }
                }
                knock_knock('user_login', login, sendData);
            } else {
                this.loginWindowInfo.appendChild(document.createTextNode("Enter password!"));
            }
        } else {
            this.loginWindowInfo.appendChild(document.createTextNode('Please, enter user name!'));
        }
    }

    logOut() {
        this.taskList = null;
        document.cookie = "id=; expires=-1";
        document.cookie = "sign=; expires=-1";

        let tasksParent = document.getElementById("main_tasks");
        removeChilds(tasksParent);

        this.showLoginWindow();

    }

    userDelete() {
        const confirm = function() {
            knock_knock("user_delete", del);
        }

        const del = (answer) => {
            if (answer["ok"] === true) {
                this.logOut();
            }
            if (answer["error_code"] === 401) {
                this.logOut();
                showInfoWindow("Authorisation problem!");
            }
        }

        showConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }

    userRegister() {
        // TODO: Слишком большая вложенность, нужно попробовать переписать метод через конструкцию SWITCH
    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
     */
        removeChilds(this.registerWindowInfo);
        if (this.registerFormUsername.value) {
            if (this.registerFormPassword.value) {
                if (this.registerFormPasswordConfirm.value) {
                    let newUserName = this.registerFormUsername.value;
                    let password = this.registerFormPassword.value;
                    let passwordConform = this.registerFormPasswordConfirm.value;

                    if (password === passwordConform) {
                        const sendData = {"newUserName": newUserName, "password": password};
        
                        const register = (answer) => {
                            if (answer['ok'] === true) {
                                this.registerFormUsername.value = "";
                                this.registerFormPassword.value = "";
                                this.registerFormPasswordConfirm.value = "";
                                this.registerWindowInfo.appendChild(document.createTextNode("New user " + newUserName + " successfully created!"));
                            } else if (answer['error_code'] === 1062) {
                                this.registerWindowInfo.appendChild(document.createTextNode("Name " + newUserName + " is already used!"));
                            } else {
                                this.registerWindowInfo.appendChild(document.createTextNode(answer['error_message'] + ' Код ошибки: ' + answer['error_code']));
                            }
                        }
                        knock_knock('user_register', register, sendData);
                    } else {
                        this.registerWindowInfo.appendChild(document.createTextNode("Passwords are not match!"));
                    }
                } else {
                    this.registerWindowInfo.appendChild(document.createTextNode("Please, confirm password!"));
                }
            } else {
                this.registerWindowInfo.appendChild(document.createTextNode("Please, enter new password!"))
            }
        } else {
            this.registerWindowInfo.appendChild(document.createTextNode("Please, enter new user name!"));
        }
    }
}


class LoadingWindow {
    constructor() {
        this.isAlive = false;
        this.reqCount = 0;
        this.timerShow = undefined;
        this.timerHide = undefined;
        this.startTime = undefined;
        this.stopTime = undefined;
    }
    showWindow(loadingWindow) {
        this.reqCount++;
     if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(() => {
            loadingWindow.style.display = "block";
            this.startTime = Date.now();
            this.isAlive = true;
        }, 200);
     }
    }
    hideWindow(loadingWindow) {
        if (this.reqCount > 0) {
            this.reqCount--;
            this.stopTime = Date.now();
        }   if (this.reqCount === 0) {
            this.timerShow = clearTimeout(this.timerShow);
            if (this.isAlive) {
                if (this.stopTime - this.startTime >= 200) {
                    loadingWindow.style.display = "none";
                    this.isAlive = false;
                } else {
                    this.timerHide = setTimeout(() => {
                        loadingWindow.style.display = "none";
                        this.isAlive = false;
                    }, 200 - (this.stopTime - this.startTime));
                }
            }
        }
    }
}

let showLoading = new LoadingWindow();

function events() {
    function noEnterRefreshTaskInput(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("task_input_button").click();
        }
    }
    
    function noEnterRefreshLogin(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("login_form_button").click();
        }
    }

    function noEnterRefreshRegister(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("register_form_button").click();
        }
    }

    let loginForm = document.forms.login_form;
    loginForm.addEventListener("keydown", noEnterRefreshLogin, false);

    let registerForm = document.forms.register_form;
    registerForm.addEventListener("keydown", noEnterRefreshRegister, false);

    let taskInputField = document.getElementById("task_input_field");
    taskInputField.addEventListener("keydown", noEnterRefreshTaskInput, false);
}

function knock_knock(path, func, sendData = undefined) {
    let loadingWindow = document.getElementById("loading_window");
    showLoading.showWindow(loadingWindow);
    if (window.fetch) {
        let init = {method: 'POST',
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: JSON.stringify(sendData)}

        fetch('http://127.0.0.1:5000/' + path, init)
            .then((answer) => {
                if (answer.ok && answer.headers.get('Content-Type') === 'application/json') {
                    return answer.json();
                } else {
                    return Promise.reject({"ok": false});
                }
            })
            .then((answer) => {
                showLoading.hideWindow(loadingWindow);
                func(answer);
            }, (error) => {
                showLoading.hideWindow(loadingWindow);
                func(error);
            });
    } else {
        let req = new XMLHttpRequest();
        req.open('POST', 'http://127.0.0.1:5000/' + path);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify(sendData));

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200 && req.getResponseHeader('Content-type') === 'application/json') {
                    showLoading.hideWindow(loadingWindow);
                    func(JSON.parse(req.responseText));
                }
            }
        }
    }
}

function showConfirmWindow(func, message) {
    let shadow = document.getElementById("shadow");
    let confirmWindow = document.getElementById("confirm_window");
    let confirmWindowMessage = document.getElementById("confirm_window_message");
    let okButton = document.getElementById("confirm_window_ok_button");
    let cancelButton = document.getElementById("confirm_window_cancel_button");

    shadow.style.display = "block";
    confirmWindowMessage.appendChild(document.createTextNode(message));
    confirmWindow.style.display = "block";

    setTimeout(function() {
        shadow.style.opacity = "0.5";
    })

    okButton.onclick = click;
    cancelButton.onclick = click;

    function click() {
        if (this.value === "OK") {
            func();
        }
        shadow.style.display = "none";
        confirmWindow.style.display = "none";
        confirmWindowMessage.removeChild(confirmWindowMessage.firstChild);
    }
}

function showInfoWindow(message) {

    let infoWindow = document.getElementById("info_window");
    let infoWindowMessage = document.getElementById("info_window_message");

    removeChilds(infoWindowMessage);

    infoWindowMessage.appendChild(document.createTextNode(message));
    infoWindow.style.display = "block";

    setTimeout(function() {
        infoWindow.style.display = "none";
    }, 3000)
}

function removeChilds(field) {
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
}

function authCheck(mainLogin) {
    const check = (answer) => {
        if (answer["ok"] === true) {
            mainLogin.hideLoginWindow();
            mainLogin.onLoad();
        }
    }
    knock_knock("/auth_check", check);
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

document.addEventListener('DOMContentLoaded', function() {
    let mainLogin = new Login();
    authCheck(mainLogin);
    events();
});
"use strict";

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
        this.authMenu = document.getElementById("auth_menu");
        this.loginForm = document.getElementById("login_form");
        this.loginFormInfo = document.getElementById("login_form_info");
        this.loginFormUsername = document.getElementById("login_form_username");
        this.loginFormPassword = document.getElementById("login_form_password");
        this.loginButton = document.getElementById("login_form_button");
        this.registerForm = document.getElementById("register_form");
        this.registerFormInfo = document.getElementById("register_form_info");
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
            windowChange(this.registerForm, this.switchLoginButton, this.loginForm, this.switchRegisterButton, this.registerFormUsername, this.loginFormInfo);
        } else if (val === 'login') {
            windowChange(this.loginForm, this.switchRegisterButton, this.registerForm, this.switchLoginButton, this.loginFormUsername, this.registerFormInfo);
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

        removeChilds(this.loginFormInfo);
        if (this.loginFormUsername.value) {
            if (this.loginFormPassword.value) {
                let userName = this.loginFormUsername.value;
                let password = this.loginFormPassword.value;
                const sendData = {"userName": userName, "password": password};

                this.loginFormPassword.value = "";

                const login = (answer) => {
                    if (answer["ok"] === true) {
                        this.loginFormUsername.value = "";
                        removeChilds(this.loginFormInfo);
                        this.authMenu.style.opacity = '0';
                        this.shadow.style.display = "none";
                        
                        setTimeout(() => {
                            this.authMenu.style.display = 'none';
                            document.getElementById('task_input_field').focus();
                            }, 500);

                        this.userNameField.appendChild(document.createTextNode(userName));
                        this.userLogOutButton.disabled = false;

                        let userId = answer['user_id'];
                        let tasksFromServer = answer['tasks'];

                        createNewTaskList(userId, tasksFromServer, 'task_input_button', 'main_tasks', 'task');
                    } else {
                        this.loginFormInfo.appendChild(document.createTextNode(answer["error_message"]));
                    }
                }
                knock_knock('login', sendData, login);
            } else {
                this.loginFormInfo.appendChild(document.createTextNode("Enter password!"));
            }
        } else {
            this.loginFormInfo.appendChild(document.createTextNode('Please, enter user name!'));
        }
    }

    logOut() {
        // let userNameField = document.getElementById('user_name_field');
        let tasksParent = document.getElementById("main_tasks");
        
        this.shadow.style.display = "block";
        removeChilds(this.userNameField);
        this.userLogOutButton.disabled = true;
        removeChilds(tasksParent);
        this.authMenu.style.display = 'block';
        this.loginFormUsername.focus();
        setTimeout(() => {
            this.authMenu.style.opacity = '1';
        });
    }

    userDelete() {
        let userName = document.getElementById('user_name_field').textContent;
        const sendData = {"userName": userName};

        const confirm = function() {
            knock_knock("user_delete", sendData, del);
        }

        const del = (answer) => {
            if (answer["ok"] === true) {
                this.logOut();
            }
        }

        createConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }

    userRegister() {
    /**
     * POST: json =  {newUserName: 'string'}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
     */
        // let infoMessage = document.getElementById("register_form_info");
        removeChilds(this.registerFormInfo);
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
                                this.registerFormInfo.appendChild(document.createTextNode("New user " + newUserName + " successfully created!"));
                            } else if (answer['error_code'] === 1062) {
                                this.registerFormInfo.appendChild(document.createTextNode("Name " + newUserName + " is already used!"));
                            } else {
                                this.registerFormInfo.appendChild(document.createTextNode(answer['error_message'] + ' Код ошибки: ' + answer['error_code']));
                            }
                        }
                        knock_knock('user_register', sendData, register);
                    } else {
                        this.registerFormInfo.appendChild(document.createTextNode("Passwords arenot match!"));
                    }
                } else {
                    this.registerFormInfo.appendChild(document.createTextNode("Please, confirm password!"));
                }
            } else {
                this.registerFormInfo.appendChild(document.createTextNode("Please, enter new password!"))
            }
        } else {
            this.registerFormInfo.appendChild(document.createTextNode("Please, enter new user name!"));
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

    let registerField = document.getElementById("register_form_username");
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

function removeChilds(field) {
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let login = new Login();
    events();
});
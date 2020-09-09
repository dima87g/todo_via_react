"use strict";

//TODO In all animations with 'shadow', change 'display' property to 'visibility', think, this will be the best.
// Maybe i should do it to all 'display' property???????

class TaskList {
    constructor() {
        this.tasks = [];
        this.tasksTree = new Map();
        this.loginClass = null;
    }

    addTask() {
        /**
         * POST: json = {'taskText': 'string', 'parentId' = 'number'}
         * GET:
         * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        if (document.getElementById("task_input_field").value) {
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value = "";
            let sendData = {"taskText": taskText, "parentId": null};

            const add = (answer) => {
                if (answer['ok'] === true) {
                    let taskId = answer['task_id'];
                    let newTask = new Task(this, taskId, taskText);

                    this.tasksTree.set(newTask.id, newTask);
                    this.tasks.push(newTask);

                    this.updateDom();
                }
                if (answer["error_code"] === 401) {
                    this.loginClass.logOut();
                    showInfoWindow("Authorisation problem!");
                }
            }
            knock_knock('save_task', add, sendData);
        }
    }

    addSubtask(taskObject, DOMElement) {
        /**
         * POST: json = {'taskText': 'string', 'parentId': 'number'}
         * GET:
         * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
         * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
         * 'error_message': 'string' or null}
         */
        let subtaskDiv = DOMElement.parentNode;
        let taskDiv = subtaskDiv.parentNode;
        if (subtaskDiv.getElementsByClassName('subtask_text_field')[0].value) {
            let taskText = subtaskDiv.getElementsByClassName('subtask_text_field')[0].value;
            subtaskDiv.getElementsByClassName('subtask_text_field')[0].value = '';
            taskDiv.getElementsByClassName('show_subtask_input_button')[0].click();
            let parentId = taskObject.id;
            let sendData = {'taskText': taskText, 'parentId': parentId}
            const add = (answer) => {
                if (answer['ok'] === true) {
                    let taskId = answer['task_id'];
                    let newTask = new Task(this, taskId, taskText, parentId);

                    this.tasksTree.set(taskId, newTask);
                    taskObject.subtasks.push(newTask);

                    this.updateDom();
                } else if (answer['error_code'] === 401) {
                    this.loginClass.logOut();
                    showInfoWindow("Authorisation problem!");
                }
            }
            knock_knock('save_task', add, sendData);
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
        let taskStatus = node.status === false;
        let sendData = {"taskId": node.id, "status": taskStatus};

        const finish = (answer) => {
            if (answer['ok'] === true) {
                node.status = taskStatus;

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
         * @param {object} - Task instance object
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
    constructor(taskList, id, text, parentId = null, status = false) {
        this.taskList = taskList;
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.subtasks = [];
    }

    showSubtaskInput() {
        let showed = false;
        let timerShow = null;
        let timerHide = null;
        let timerEnableButton = null;
        return function() {
            let taskText = this.parentNode.getElementsByClassName('task_text')[0];
            let removeButton = this.parentNode.getElementsByClassName('task_remove_button')[0];
            let subtaskDiv = this.parentNode.getElementsByClassName('subtask_div')[0];
            let subtaskTextField = this.parentNode.getElementsByClassName('subtask_text_field')[0];
            let addSubtaskButton = this.parentNode.getElementsByClassName('add_subtask_button')[0];
            let addSubtaskButtonIcon = addSubtaskButton.firstChild;
            if (showed === false) {
                showed = true;
                removeButton.disabled = true;
                // addSubtaskButton.disabled = false;
                timerHide = clearTimeout(timerHide);
                removeButton.style.transitionDelay = '0s';
                removeButton.style.opacity = '0';
                removeButton.style.transform = 'scale(0)'
                // taskText.style.transitionDelay = '0s';
                taskText.style.opacity = '0';
                subtaskDiv.style.display = 'flex';
                subtaskTextField.style.display = 'inline-block';
                addSubtaskButton.style.display = 'inline-block';
                addSubtaskButtonIcon.style.display = 'inline-block';

                timerShow = setTimeout(function() {
                    subtaskTextField.style.opacity = '1';
                    subtaskTextField.style.width = '65%';
                    addSubtaskButton.style.transitionDelay = '0.2s';
                    addSubtaskButton.style.opacity = '1';
                    addSubtaskButton.style.transform = 'scale(1)';
                }, );

                timerEnableButton = setTimeout(function() {
                    addSubtaskButton.disabled = false;
                    taskText.style.visibility = 'hidden';
                }, 700);
            } else {
                showed = false;
                addSubtaskButton.disabled = true;
                timerShow = clearTimeout(timerShow);
                timerEnableButton = clearTimeout(timerEnableButton);
                removeButton.style.transitionDelay = '0.2s';
                removeButton.style.opacity = '1';
                removeButton.style.transform = 'scale(1)';
                // taskText.style.transitionDelay = '0.5s';
                taskText.style.visibility = 'visible';
                taskText.style.opacity = '1';
                subtaskTextField.value = '';
                subtaskTextField.style.opacity = '0';
                subtaskTextField.style.width = '0';
                addSubtaskButton.style.transitionDelay = '0s';
                addSubtaskButton.style.opacity = '0';
                addSubtaskButton.style.transform = 'scale(0)';

                timerHide = setTimeout(function() {
                    removeButton.disabled = false;
                    subtaskDiv.style.display = 'none';
                    subtaskTextField.style.display = 'none';
                    addSubtaskButton.style.display = 'none';
                    addSubtaskButtonIcon.style.display = 'none';
                }, 700);
            }
        }
    }

    createTaskNode() {
        const self = this;
        let taskDiv = document.createElement("div");
        taskDiv.setAttribute("class", "task");

        let taskDivContent = document.createElement('div');
        taskDivContent.setAttribute('class', 'task_div_content');

        let finishButton = document.createElement('button');
        finishButton.setAttribute('type', 'submit');
        finishButton.setAttribute('class', 'task_finish_button');

        let finishButtonIcon = document.createElement('img');
        finishButtonIcon.setAttribute('src', '../static/icons/check.svg');
        finishButton.appendChild(finishButtonIcon);

        if (this.status === true) {
            taskDiv.setAttribute("class", "task finished_task");
        }

        finishButton.onclick = function () {
            self.taskList.finishTask(self);
        };

        let showSubtaskDivButton = document.createElement('input');
        showSubtaskDivButton.setAttribute('type', 'button');
        showSubtaskDivButton.setAttribute('class', 'show_subtask_input_button');
        showSubtaskDivButton.setAttribute('value', '+');

        showSubtaskDivButton.onclick = this.showSubtaskInput();

        let subtaskDiv = document.createElement('div');
        subtaskDiv.setAttribute('class', 'subtask_div');

        let subtaskTextField = document.createElement('input');
        subtaskTextField.setAttribute('type', 'text');
        subtaskTextField.setAttribute('class', 'subtask_text_field');

        let addSubtaskButton = document.createElement('button');

        addSubtaskButton.setAttribute('type', 'submit');
        addSubtaskButton.setAttribute('class', 'add_subtask_button');

        let addSubtaskButtonIcon = document.createElement('img');

        addSubtaskButtonIcon.setAttribute('src', 'static/icons/add_sub.svg');
        addSubtaskButton.appendChild(addSubtaskButtonIcon);

        function noEnterRefreshAddSubtaskButton(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                addSubtaskButton.click();
            }
        }

        subtaskTextField.addEventListener('keydown', noEnterRefreshAddSubtaskButton, false);

        addSubtaskButton.onclick = function () {
            self.taskList.addSubtask(self, this);
        }

        subtaskDiv.appendChild(subtaskTextField);
        subtaskDiv.appendChild(addSubtaskButton);

        let par = document.createElement("p");

        par.appendChild(document.createTextNode(this.text));
        par.setAttribute("class", "task_text");

        let removeButton = document.createElement('button');

        removeButton.setAttribute('type', 'submit');
        removeButton.setAttribute('class', 'task_remove_button');

        let removeButtonIcon = document.createElement('img');

        removeButtonIcon.setAttribute('src','static/icons/delete.svg');

        removeButton.appendChild(removeButtonIcon);

        removeButton.onclick = function () {
            self.taskList.removeTask(self);
        };

        taskDiv.appendChild(finishButton);
        taskDiv.appendChild(showSubtaskDivButton);
        taskDiv.appendChild(subtaskDiv);
        taskDiv.appendChild(par);
        taskDiv.appendChild(removeButton);

        return taskDiv;
    }

    replaceTaskNode(existTask) {
        const self = this;
        let finishButton = existTask.getElementsByClassName("task_finish_button")[0];
        let addSubtaskButton = existTask.getElementsByClassName('add_subtask_button')[0];
        let removeButton = existTask.getElementsByClassName("task_remove_button")[0];
        existTask.getElementsByTagName("p")[0].textContent = this.text;
        if (this.status === false) {
            existTask.setAttribute("class", "task");
        } else {
            existTask.setAttribute("class", "task finished_task");
        }
        finishButton.onclick = function () {
            self.taskList.finishTask(self);
        };
        addSubtaskButton.onclick = function() {
            self.taskList.addSubtask(self, this);
        };
        removeButton.onclick = function () {
            self.taskList.removeTask(self);
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
        this.userDeleteButton.disabled = true;

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
            // focusField.focus();
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
        this.registerFormUsername.value = '';
        this.registerFormPassword.value = '';
        this.registerFormPasswordConfirm.value = '';
        removeChilds(this.loginWindowInfo);
        this.authMenu.style.opacity = '0';
        // this.shadow.style.display = "none";
        hideShadow();

        setTimeout(() => {
            this.authMenu.style.display = 'none';
            document.getElementById('task_input_field').focus();
        }, 500);
    }


    showLoginWindow() {
        // this.shadow.style.display = "block";
        showShadow();
        removeChilds(this.userNameField);
        this.userLogOutButton.disabled = true;
        this.userDeleteButton.disabled = true;
        this.authMenu.style.display = 'flex';
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
                let userName = answer["user_name"];
                let tasksFromServer = answer['tasks'];

                if (!this.userNameField.firstChild) {
                    this.userNameField.appendChild(document.createTextNode(userName));
                    this.userLogOutButton.disabled = false;
                    this.userDeleteButton.disabled = false;
                }

                this.taskList = new TaskList();
                this.taskList.loginClass = this;
                let taskInputButton = document.getElementById("task_input_button");

                taskInputButton.onclick = () => {
                    this.taskList.addTask();
                    return false;
                }

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

        if (this.loginFormUsername.value && this.loginFormPassword.value) {
            let userName = this.loginFormUsername.value;
            let password = this.loginFormPassword.value;
            const sendData = {"userName": userName, "password": password};

            this.loginFormPassword.value = "";

            const login = (answer) => {
                if (answer["ok"] === true) {
                    let userName = answer["user_name"];

                    this.userNameField.appendChild(document.createTextNode(userName));
                    this.userLogOutButton.disabled = false;
                    this.userDeleteButton.disabled = false;

                    this.hideLoginWindow();

                    this.onLoad()
                } else {
                    this.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
                }
            }
            knock_knock('user_login', login, sendData);
        } else if (!this.loginFormUsername.value) {
            this.loginWindowInfo.appendChild(document.createTextNode('Please, enter user name!'));
        } else if (!this.loginFormPassword.value) {
            this.loginWindowInfo.appendChild(document.createTextNode('Please, enter password!'))
        }
    }

    logOut() {
        const out = () => {
            this.taskList = null;
            document.cookie = "id=; expires=-1";
            document.cookie = "sign=; expires=-1";

            let tasksParent = document.getElementById("main_tasks");
            removeChilds(tasksParent);

            this.showLoginWindow();
        }

        showConfirmWindow(out, 'Are you sure, you want to log out?');

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
    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
     */
        removeChilds(this.registerWindowInfo);

        if (this.registerFormUsername.value && this.registerFormPassword.value && this.registerFormPasswordConfirm.value) {
            if (this.registerFormPassword.value === this.registerFormPasswordConfirm.value) {
                let newUserName = this.registerFormUsername.value;
                let password = this.registerFormPassword.value;

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
                this.registerWindowInfo.appendChild(document.createTextNode('Passwords are not match!'));
            }
        } else if (!this.registerFormUsername.value) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, enter new user name!'));
        } else if (!this.registerFormPassword.value) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, enter Password!'));
        } else if (!this.registerFormPasswordConfirm.value) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, confirm Password!'));
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

    let loginForm = document.forms['login_form'];
    loginForm.addEventListener("keydown", noEnterRefreshLogin, false);

    let registerForm = document.forms['register_form'];
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

        fetch(path, init)
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
        req.open('POST', path);
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

    // shadow.style.display = "block";
    showShadow();
    confirmWindowMessage.appendChild(document.createTextNode(message));
    // confirmWindow.style.display = "block";
    confirmWindow.style.visibility = 'visible';
    confirmWindow.style.opacity = '1';
    // setTimeout(function() {
    //     shadow.style.opacity = "0.5";
    // })

    okButton.onclick = click;
    cancelButton.onclick = click;

    function click() {
        if (this.value === "OK") {
            func();
        }
        // shadow.style.display = "none";
        // confirmWindow.style.display = "none";
        hideShadow();
        confirmWindow.style.opacity = '0';
        setTimeout(function () {
            confirmWindow.style.visibility = 'hidden';
            confirmWindowMessage.removeChild(confirmWindowMessage.firstChild);
        }, 500);
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

function showShadow() {
    let shadow = document.getElementById('shadow');

    shadow.style.visibility = 'visible';
    shadow.style.opacity = '0.5';
}

function hideShadow() {
    let shadow = document.getElementById('shadow');

    shadow.style.opacity = '0';

    setTimeout(function() {
        shadow.style.visibility = 'hidden';
    }, 500);
}

function removeChilds(field) {
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
}

function showCookiesAlertWindow() {
    let userLanguage = window.navigator.language;
    let cookiesAlertWindow = document.getElementById('cookies_alert_window');
    let cookiesAlertWindowText = document.getElementById('cookies_alert_window_text');
    let cookiesAlertWindowConfirmButton = document.getElementById('cookies_alert_confirm_button');

    if (userLanguage === 'en-US' || userLanguage === 'en') {
        cookiesAlertWindowText.appendChild(document.createTextNode(
            'By continuing to use our site, you consent to the processing of' +
            ' cookies, which ensure the correct operation of the site.'));
    } else if (userLanguage === 'ru-RU' || userLanguage === 'ru') {
        cookiesAlertWindowText.appendChild(document.createTextNode(
            'Продолжая использовать наш сайт, вы даете согласие на обработку' +
            '  файлов cookie, которые обеспечивают правильную работу сайта.'));
    }

    cookiesAlertWindowConfirmButton.onclick = function() {
        cookiesAlertWindow.style.opacity = '0';

        setTimeout(function() {
            cookiesAlertWindow.style.display = 'none';
        }, 500);
    }
    cookiesAlertWindow.style.display = 'block';
}

function authCheck(mainLogin) {
    const check = (answer) => {
        if (answer["ok"] === true) {
            mainLogin.hideLoginWindow();
            mainLogin.onLoad();
        } else {
            showCookiesAlertWindow();
        }
    }
    knock_knock("/auth_check", check);
}

document.addEventListener('DOMContentLoaded', function() {
    let mainLogin = new Login();
    authCheck(mainLogin);
    events();
});
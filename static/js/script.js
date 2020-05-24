class TaskList {
    constructor() {
        this.userId = undefined;
        this.tasks = [];
    }

    addTask() {
        /**
         * POST: json = {'user_id': 'number', taskText = 'string'}
         * GET: json = {'task_id': 'number'}
         */
        const list = this;
        if (document.getElementById("task_input_field").value) {
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value = "";
            let data = {'user_id': this.userId, 'task_text': taskText};

            function add(answer) {
                if (answer['ok'] === true) {
                    let taskId = answer['task_id'];
                    let newTask = new Task(taskId, taskText);

                    list.tasks.push(newTask);

                    list.updateDom();
                }
            }
            knock_knock('save', data, add);
        }
    }

    finishTask(node) {
        /**
         * POST: json = {'task_id': 'number', 'status': 'boolean'}
         * GET: json = {'ok': true}
         */
        const list = this;
        node.status = node.status === false;
        let data = {"task_id": node.id, "status": node.status};

        function finish(answer) {
            if (answer['ok'] === true) {
                list.updateDom();
            }
        }
        knock_knock('finish_task', data, finish);
    }

    removeTask(node) {
        /**
         * POST: task_id = 'number'
         * GET: json = {'ok': true}
         */
        const list = this;

        function remove(answer) {
            if (answer['ok'] === true) {
                list.tasks.splice(list.tasks.indexOf(node), 1);
                list.updateDom();
            }
        }
        knock_knock('delete', node.id, remove);
    }

    updateDom() {
        let tasksParent = document.getElementById("tasks");
        let existTasks = document.getElementsByClassName("task");
        let i = 0;

        for (i; i < this.tasks.length; i++) {
            if (existTasks[i]) {
                this.tasks[i].replaceTaskNode(existTasks[i]);
            } else {
                tasksParent.append(this.tasks[i].createTaskNode());
            }
        }
        if (existTasks[i]) {
            for (i; i < existTasks.length; i++) {
                existTasks[i].remove();
            }
        }
    }
}


class Task {
    constructor(id, text, status = false) {
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
            taskList.finishTask(node);
        };

        let removeButton = document.createElement("input");

        removeButton.setAttribute("type", "button");
        removeButton.setAttribute("value", "Удалить");
        removeButton.setAttribute("class", "task_remove_button");
        removeButton.onclick = function () {
            taskList.removeTask(node);
        };

        let par = document.createElement("p");

        par.append(this.text);
        par.setAttribute("class", "paragraph");
        taskDiv.append(finishButton);
        taskDiv.append(par);
        taskDiv.append(removeButton);

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
            taskList.finishTask(node);
        };
        removeButton.onclick = function () {
            taskList.removeTask(node);
        };
    }
}

//todo
// create login class (functions onLad, login, switchLogin, userRegister)



function onLoad(userName) {
    /**
     * POST: userName = 'string'
     * GET: json = {'user_id': 'number', 'tasks': [
     *                                          {'user_id': 'number', 'task_text': 'string', 'status': 'string'},
     *                                          ...
     *                                          ]
     *             }
     */
    function loadTasks(answer) {
    let menu = document.getElementById("auth_menu");
    let infoMessage = document.getElementById('login_form_info');

    if (answer['ok'] === true) {
        menu.style.opacity = '0%';
        setTimeout(function() {
            menu.style.display = 'none';
            document.getElementById('task_input_field').focus();
            }, 500);
        let userId = answer['user_id'];
        let tasksFromServer = answer['tasks'];

        taskList.userId = userId;
        for (let task of tasksFromServer) {
            taskList.tasks.push(new Task(task["task_id"], task["task_text"], task["status"]));
        }
        taskList.updateDom();
    } else {
        infoMessage.textContent = 'Проблема(((((';
        }
    }
    knock_knock('load', userName, loadTasks);
}

function switchLogin(val) {
    let loginWindow = document.getElementById('login_form');
    let registerButton = document.getElementById('register_button');
    let registerWindow = document.getElementById('register_form');
    let loginButton = document.getElementById('login_button');


    if (val === 'register') {
        windowChange(registerWindow, loginButton, loginWindow, registerButton);
    } else if (val === 'login') {
        windowChange(loginWindow, registerButton, registerWindow, loginButton);
    }

        function windowChange(activate, activateButton, deactivate, deactivateButton) {
        deactivate.style.opacity = '0%';
        deactivateButton.disabled = true;
        activate.style.display = 'block';
        setTimeout(function () {
            activate.style.opacity = '100%';
        })
        setTimeout(function () {
            deactivate.style.display = 'none';
            activateButton.disabled = false;
        }, 500);
    }
}

function loginButton() {
    /**
     * POST: userName = 'string'
     * GET: answer = 'boolean'
     */
    let userName = document.getElementById("login_field").value;
    document.getElementById("login_field").value = '';
    let infoMessage = document.getElementById('login_form_info');

    function login(answer) {
        if (answer['ok'] === true) {
        onLoad(userName);
        } else {
        infoMessage.textContent = 'Авторизация не удалась =(';
        }
    }
    knock_knock('login', userName, login);
}

function userRegisterButton() {
    /**
     * POST: newUserName = 'string'
     * GET: answer = json = {'ok': 'boolean', 'error_coder': 'number', 'error_message': 'string'}
     */
    let infoMessage = document.getElementById("register_form_info");
    if (document.getElementById('register_form_text').value) {
        let newUserName = document.getElementById('register_form_text').value;

        function register(answer) {
        if (answer['ok'] === true) {
            infoMessage.textContent = 'New user ' + newUserName + ' successfully created!';
        } else if (answer['error_code'] === 1062) {
            infoMessage.textContent = 'Name ' + newUserName + ' is already used!';
        } else {
            infoMessage.textContent = answer['error_message'] + ' Код ошибки: ' + answer['error_code'];
        }
    }
        knock_knock('user_register', newUserName, register);
    } else {
            infoMessage.textContent = 'Please, enter new user name!';
            infoMessage.style.color = 'red';
    }
}

function events() {
    function noEnterRefresh(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("task_input_button").click();
        }
    }

    let taskInputField = document.getElementById("task_input_field");
    taskInputField.addEventListener("keydown", noEnterRefresh, false);
}

function knock_knock(path, sendData, func) {
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

let taskList = new TaskList();
events();

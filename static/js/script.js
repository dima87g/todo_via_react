class TaskList {
    constructor() {
        this.userId = undefined;
        this.tasks = [];
    }

    addTask() {
        /**
         * POST: taskText = 'string'
         * GET: taskId = 'number'
         */
        if (document.getElementById("task_input_field").value) {
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value = "";

            let req = new XMLHttpRequest();
            req.open("POST", "http://127.0.0.1:5000/save", false);
            req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            req.send(JSON.stringify({'user_id': this.userId, 'task_text': taskText}));

            let taskId = req.responseText;
            let newTask = new Task(taskId, taskText);

            this.tasks.push(newTask);

            this.updateDom();
        }
    }

    finishTask(node) {
        /**
         * POST: json = {'task_id': 'number', 'status': 'boolean'}
         * GET: json = {'ok': true}
         */
        node.status = node.status === false;

        let req = new XMLHttpRequest();
        req.open("POST", "http://127.0.0.1:5000/finish_button", false);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify({"task_id": node.id, "status": node.status}));

        this.updateDom();
    }

    removeTask(node) {
        /**
         * POST: task_id = 'number'
         * GET: json = {'ok': true}
         */
        let req = new XMLHttpRequest();
        req.open("POST", "http://127.0.0.1:5000/delete", false);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify(node.id));

        this.tasks.splice(this.tasks.indexOf(node), 1);
        this.updateDom();
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
    let req = new XMLHttpRequest();
    req.open("POST", "http://127.0.0.1:5000/load", true);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(userName));

    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            let data = JSON.parse(req.responseText);
            let userId = data['user_id'];
            let tasksFromServer = data['tasks'];

            taskList.userId = userId;

            for (let task of tasksFromServer) {
                taskList.tasks.push(new Task(task["task_id"], task["task_text"], !!+task["status"]));
            }
        }   taskList.updateDom();
    }
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

function login() {
    /**
     * POST: userName = 'string'
     * GET: answer = 'boolean'
     */
    let menu = document.getElementById("auth_menu");
    let userName = document.getElementById("login_field").value;
    document.getElementById("login_field").value = '';

    let req = new XMLHttpRequest();
    req.open('POST', 'http://127.0.0.1:5000/auth', false);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(userName));

    let answer = JSON.parse(req.responseText);

    if (answer['ok'] === true) {
        menu.style.opacity = '0%';
        setTimeout(function() {
            menu.style.display = 'none';
            document.getElementById('task_input_field').focus();
        }, 500);
        onLoad(userName);
    } else {
        alert('Авторизация не удалась =(');
    }
}

function userRegister() {
    /**
     * POST: newUserName = 'string
     * GET: answer = json = {'ok': 'boolean', 'error_coder': 'number', 'error_message': 'string'}
     */
    let infoMessage = document.getElementById("register_form_info");
    if (document.getElementById('register_form_text').value) {
        let newUserName = document.getElementById('register_form_text').value;

        let req = new XMLHttpRequest();
        req.open('POST', 'http://127.0.0.1:5000/user_register',false);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify(newUserName));

        let answer = JSON.parse(req.responseText);

        console.log(answer);

        if (answer['ok'] === true) {
            infoMessage.textContent = 'New user ' + newUserName + ' successfully created!';
        } else if (answer['error_code'] === 1062) {
            infoMessage.textContent = 'Name ' + newUserName + ' is already used!';
        } else {
            infoMessage.textContent = answer['error_message'] + ' Код ошибки: ' + answer['error_code'];
        }
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


//todo
// insert knock_knock function into all functions with network requests

function knock_knock(adress, request) {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://127.0.0.1:5000/' + adress, false);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send();

    return JSON.parse(req.responseText);
}

let taskList = new TaskList();
events();

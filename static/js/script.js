class TaskList {
    constructor() {
        this.tasks = [];
    }

    addTask() {
        /**
         * post: taskText = 'string'
         * get: taskId = 'number'
         */
        if (document.getElementById("task_input_field").value) {
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value = "";

            let req = new XMLHttpRequest();
            req.open("POST", "http://127.0.0.1:5000/save", false);
            req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            req.send(JSON.stringify(taskText));
            let taskId = req.responseText;

            let newTask = new Task(taskId, taskText, false);
            this.tasks.push(newTask);

            this.updateDom();
        }
    }

    finishTask(node) {
        /**
         * post: json = {'id': 'number', 'status': 'boolean'}
         * get: json = {'ok': true}
         */
        node.status = node.status === false;

        let req = new XMLHttpRequest();
        req.open("POST", "http://127.0.0.1:5000/finish_button", false);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify({"id": node.id, "status": node.status}));

        this.updateDom();
    }

    removeTask(node) {
        /**
         * post: node.id = 'number'
         * get: json = {'ok': true}
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


function onLoad() {
    /**
     * post: none
     * get: json = [
     * {'id': 'number', 'task': 'string', 'status': 'string'},
     * ...
     * ]
     */
    let req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:5000/load", true);
    req.send();

    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            let tasksFromServer = JSON.parse(req.responseText);
            for (let task of tasksFromServer) {
                taskList.tasks.push(new Task(task["id"], task["task"], !!+task["status"]));
            }
        }   taskList.updateDom();
    }
}

function loginPass() {
    let menu = document.getElementById("auth_menu");
    // let login = document.getElementById("login").value;
    // if (login === "dima87g") {
    //     menu.style.opacity = "0%";
    //     setTimeout(function () {menu.style.display = "none"}, 1000);
    //     onLoad();
    // } else {
    //     document.write("Invalid Login");
    // }

    menu.style.opacity = "0%";
    setTimeout(function () {menu.style.display = "none"}, 1000);

    onLoad();
}

function events() {
    function noEnterRefresh(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("task_input_button").click();
    }
}

    let inputByEnterKey = document.getElementById("task_input_field");
    inputByEnterKey.addEventListener("keydown", noEnterRefresh, false);
}

let taskList = new TaskList();
events();

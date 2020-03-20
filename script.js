class TaskList {
    constructor() {
        this.tasks = [];
    }

    addTask() {
        if (document.getElementById("task_input_field").value) {
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value = "";

            let newTask = new Task(taskText);
            this.tasks.push(newTask);

            this.updateDom();
        }
    }

    finishTask(node) {
        node.status = node.status === false;
        this.updateDom();
    }

    removeTask(node) {
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
    constructor(text) {
        this.text = text;
        this.status = false;
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


let taskList = new TaskList();

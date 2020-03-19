class TaskList {
    constructor() {
        this.tasks = [];
    }

    addTask() {
        if (document.getElementById("task_input_field").value){
            let taskText = document.getElementById("task_input_field").value;
            document.getElementById("task_input_field").value= "";

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
        while (document.getElementById("tasks").firstElementChild) {
            document.getElementById("tasks").firstElementChild.remove();
        }

        for (let task of this.tasks) {
            document.getElementById("tasks").append(task.createTaskNode());
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
        taskDiv.setAttribute("class", "task")
        let finishButton = document.createElement("input");
        finishButton.setAttribute("type", "button");
        finishButton.setAttribute("class", "task_finish_button")
        if (this.status === false){
            finishButton.setAttribute("value", "Выполнено");
        } else {
            finishButton.setAttribute("value", "Не выполнено");
            taskDiv.setAttribute("class", "task finished_task");
        }
        finishButton.onclick = function() {
            taskList.finishTask(node);
        };
        let removeButton = document.createElement("input");
        removeButton.setAttribute("type", "button");
        removeButton.setAttribute("value", "Удалить");
        removeButton.setAttribute("class", "task_remove_button");
        removeButton.onclick = function() {
            taskList.removeTask(node);
        };
        taskDiv.append(finishButton);
        taskDiv.append(this.text);
        taskDiv.append(removeButton);

        return taskDiv;
    }
}

let taskList = new TaskList();

let data = fetch("http://127.0.0.1:5000/status");
console.log(data.catch());
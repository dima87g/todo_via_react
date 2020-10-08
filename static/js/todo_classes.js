'use strict';

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
                    this.loginClass.forceLogOut();
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
                    this.loginClass.forceLogOut();
                    showInfoWindow("Authorisation problem!");
                }
            }
            knock_knock('save_task', add, sendData);
        }
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
                this.loginClass.forceLogOut();
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
    constructor(loginInst, taskList, id, text, parentId = null, status = false) {
        this.loginInst = loginInst;
        this.taskList = taskList;
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.subtasks = [];
    }

    createTaskNode() {
        const self = this;
        let taskDiv = document.createElement("div");
        taskDiv.setAttribute("class", "task");

        ReactDOM.render(<TaskReact loginInst={this.loginInst} taskList={this.taskList} taskId={this.id} taskText={this.text}/>, taskDiv);
        let removeTaskButton = taskDiv.getElementsByClassName('remove_task_button')[0];

        removeTaskButton.onclick = function () {
            self.taskList.removeTask(self);
        };
        return taskDiv;
    }

    replaceTaskNode(existTask) {
        const self = this;
        let finishButton = existTask.getElementsByClassName("task_finish_button")[0];
        let addSubtaskButton = existTask.getElementsByClassName('add_subtask_button')[0];
        let removeButton = existTask.getElementsByClassName("remove_task_button")[0];
        existTask.getElementsByTagName("p")[0].textContent = this.text;
        if (this.status === false) {
            existTask.setAttribute("class", "task");
        } else {
            existTask.setAttribute("class", "task finished_task");
        }
        finishButton.onclick = function () {
            self.taskList.finishTask(self);
        };
        addSubtaskButton.onclick = function () {
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
        this.userChangePasswordButton = document.getElementById('change_password_button');
        this.changePasswordWindow = document.getElementById('change_password_window');
        this.changePasswordWindowCancelButton = document.getElementById('change_password_window_cancel_button');
        this.changePasswordButton = document.getElementById('change_password_form_button');

        this.loginFormUsername.focus();
        this.userLogOutButton.disabled = true;
        this.userDeleteButton.disabled = true;
        this.userChangePasswordButton.disabled = true;

        this.switchRegisterButton.onclick = function () {
            self.switchLogin(this.value);
        }
        this.switchLoginButton.onclick = function () {
            self.switchLogin(this.value);
        }
        this.loginButton.onclick = function () {
            self.logIn();
        }
        this.userLogOutButton.onclick = function () {
            self.logOut();
        }
        this.userDeleteButton.onclick = function () {
            self.userDelete();
        }
        this.userChangePasswordButton.onclick = function() {
            self.showChangePasswordWindow();
        }
        this.changePasswordWindowCancelButton.onclick = function () {
            self.hideChangePasswordWindow();
        }
        this.userRegisterButton.onclick = function () {
            self.userRegister();
        }
    }


    switchLogin(val) {
        if (val === 'register') {
            windowChange(this.registerWindow, this.switchLoginButton, this.loginWindow, this.switchRegisterButton, this.loginWindowInfo);
        } else if (val === 'login') {
            windowChange(this.loginWindow, this.switchRegisterButton, this.registerWindow, this.switchLoginButton, this.registerWindowInfo);
        }

        function windowChange(activate, activateButton, deactivate, deactivateButton, infoField) {
            removeChildren(infoField);
            deactivate.style.opacity = '0';
            deactivateButton.disabled = true;
            activate.style.visibility = 'inherit';
            setTimeout(function () {
                activate.style.opacity = '1';
            });
            setTimeout(function () {
                deactivate.style.visibility = 'hidden';
                activateButton.disabled = false;
            }, 500);
        }
    }


    hideLoginWindow() {
        this.loginFormUsername.value = "";
        this.registerFormUsername.value = '';
        this.registerFormPassword.value = '';
        this.registerFormPasswordConfirm.value = '';
        removeChildren(this.loginWindowInfo);
        this.authMenu.style.opacity = '0';
        hideShadow();

        setTimeout(() => {
            this.authMenu.style.visibility = 'hidden';
            // document.getElementById('task_input_field').focus();
        }, 500);
    }


    showLoginWindow() {
        showShadow();
        removeChildren(this.userNameField);
        this.userLogOutButton.disabled = true;
        this.userDeleteButton.disabled = true;
        this.authMenu.style.visibility = 'visible';
        this.loginFormUsername.focus();
        setTimeout(() => {
            this.authMenu.style.opacity = '1';
        });
    }

    showChangePasswordWindow() {
        this.userLogOutButton.disabled = true;
        this.userDeleteButton.disabled = true;
        this.userChangePasswordButton.disabled = true;
        this.changePasswordWindow.style.visibility = 'visible';
        this.changePasswordWindowCancelButton.disabled = false;
        this.changePasswordButton.disabled = false;
    }

    hideChangePasswordWindow() {
        this.userLogOutButton.disabled = false;
        this.userDeleteButton.disabled = false;
        this.userChangePasswordButton.disabled = false;
        this.changePasswordWindow.style.visibility = 'hidden';
        this.changePasswordWindowCancelButton.disabled = true;
        this.changePasswordButton.disabled = true;
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
                    this.userChangePasswordButton.disabled = false;
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

                    tasksTree.set(taskId, new Task(this, this.taskList, taskId, taskText, parentId, taskStatus));
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
                this.forceLogOut();
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

        removeChildren(this.loginWindowInfo);

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
            removeChildren(tasksParent);

            this.showLoginWindow();
        }

        showConfirmWindow(out, 'Are you sure, you want to log out?');

    }

    forceLogOut() {
        this.taskList = null;
        document.cookie = 'id=; expires=-1';
        document.cookie = 'sign=; expires=-1';

        let taskParent = document.getElementById('main_tasks');
        removeChildren(taskParent);

        this.showLoginWindow();
    }

    userDelete() {
        const confirm = function () {
            knock_knock("user_delete", del);
        }

        const del = (answer) => {
            if (answer["ok"] === true) {
                this.forceLogOut();
            }
            if (answer["error_code"] === 401) {
                this.forceLogOut();
                showInfoWindow("Authorisation problem!");
            }
        }

        showConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }

    changePassword() {
        this.changePasswordConfirmButton.disabled = false;
    }

    userRegister() {
        /**
         * POST: json =  {"newUserName": "string",  "password": "string"}
         * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
         */
        removeChildren(this.registerWindowInfo);

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

class TaskReact extends React.Component {
    constructor(props) {
        super(props);
        this.loginInst = this.props.loginInst;
        this.taskList = this.props.taskList;
        this.shadow = shadow();
        this.state = {
            status: false,
            showSubtaskDivButtonZIndex: '0',
            showSubtaskDivButtonDisabled: false,
            taskTextValue: this.props.taskText,
            taskTextOpacity: '1',
            removeTaskButtonDisabled: false,
            removeTaskButtonScale: 'scale(1)',
            removeTaskButtonTransitionDelay: '0',
            subtaskDivShowed: false,
            subtaskDivVisibility: 'hidden',
            subtaskTimerShow: null,
            subtaskTimerHide: null,
            subtaskTextFieldOpacity: '0',
            subtaskTextFieldWidth: '0',
            addSubtaskButtonOpacity: '0',
            addSubtaskButtonScale: 'scale(0)',
            addSubtaskButtonTransitionDelay: '0.2s',
            taskTextEditDivShowed: false,
            taskTextEditDivVisibility: 'hidden',
            taskTextEditFieldWidth: '0',
            taskTextEditFieldOpacity: '0',
            taskTextEditFieldScale: 'scale(0)',
            saveEditButtonScale: 'scale(0)',
            saveEditButtonTransitionDelay: '0',
        }
        this.finishTask = this.finishTask.bind(this);
        this.showEditTaskField = this.showEditTaskField.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.showSubtaskField = this.showSubtaskField.bind(this);
        this.editTextField = React.createRef();
    }

    /**
     * POST: json = {'task_id': 'number', 'status': 'boolean'}
     * GET:
     * if OK = true: json = {'ok': true}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    finishTask() {
        let taskStatus = this.state.status === false;
        let sendData = {
            'taskId': this.props.taskId,
            'status': taskStatus
        };
        const finish = (answer) => {
            if (answer['ok'] === true) {
                this.setState({
                    status: taskStatus
                });
            } else if (answer['error_code'] === 401) {
                this.loginInst.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        knock_knock('finish_task', finish, sendData);
    }

    showSubtaskField() {
        if (this.state.subtaskDivShowed === false) {
            this.shadow();
            this.subtaskDivHideTimer = clearTimeout(this.subtaskDivHideTimer);
            this.setState({
                subtaskDivShowed: true,
                showSubtaskDivButtonZIndex: '1',
                removeTaskButtonDisabled: true,
                removeTaskButtonScale: 'scale(0)',
                removeTaskButtonTransitionDelay: '0s',
                taskTextOpacity: '0.2',
                subtaskDivVisibility: 'visible',
                subtaskTextFieldOpacity: '1',
                subtaskTextFieldWidth: '65%',
                addSubtaskButtonOpacity: '1',
                addSubtaskButtonScale: 'scale(1)',
                addSubtaskButtonTransitionDelay: '0.2s',
            })
        } else {
            this.shadow();
            this.setState({
                subtaskDivShowed: false,

                removeTaskButtonDisabled: false,
                removeTaskButtonScale: 'scale(1)',
                removeTaskButtonTransitionDelay: '0.2s',
                taskTextOpacity: '1',
                subtaskTextFieldOpacity: '0',
                subtaskTextFieldWidth: '0',
                addSubtaskButtonOpacity: '0',
                addSubtaskButtonScale: 'scale(0)',
                addSubtaskButtonTransitionDelay: '0s',
            })
            this.subtaskDivHideTimer = setTimeout(() => {
                this.setState({
                    subtaskDivVisibility: 'hidden',
                    showSubtaskDivButtonZIndex: '0',
                });
            }, 700);
        }
    }

    showEditTaskField() {
        if (this.state.taskTextEditDivShowed === false) {
            this.shadow();
            this.hideEditDivTimer = clearTimeout(this.hideEditDivTimer);
            this.setState({
                taskTextEditDivShowed: true,
                showSubtaskDivButtonDisabled: true,
                taskTextEditDivVisibility: 'visible',
                taskTextEditFieldOpacity: '1',
                taskTextEditFieldScale: 'scale(1)',
                taskTextEditFieldWidth: '65%',
                removeTaskButtonScale: 'scale(0)',
                removeTaskButtonTransitionDelay: '0s',
                saveEditButtonScale: 'scale(1)',
                saveEditButtonTransitionDelay: '0.2s',
                taskTextOpacity: '0.2',
            })
            this.editTextField.current.value = this.state.taskTextValue;
        } else {
            this.shadow();
            this.setState({
                taskTextEditDivShowed: false,
                showSubtaskDivButtonDisabled: false,
                taskTextEditFieldOpacity: '0',
                taskTextEditFieldScale: 'scale(0)',
                taskTextEditFieldWidth: '0',
                removeTaskButtonScale: 'scale(1)',
                removeTaskButtonTransitionDelay: '0.2s',
                saveEditButtonScale: 'scale(0)',
                saveEditButtonTransitionDelay: '0s',
                taskTextValue: this.editTextField.current.value,
                taskTextOpacity: '1',
            })
            this.hideEditDivTimer = setTimeout(() => {
                this.setState({
                    taskTextEditDivVisibility: 'hidden',
                })
            }, 500);
        }
    }

    saveEdit(e) {
        if (e.keyCode === 13) {
            this.showEditTaskField();
        }
    }

    render() {
        return (
            <div className={this.state.status === false ? 'task_div_content' : 'task_div_content finished_task'}>
                <button className={'task_finish_button'}
                        type={'button'}
                        onClick={this.finishTask}>
                    <img src="/static/icons/check.svg" alt="V"/>
                </button>
                <button className={'show_subtask_input_button'}
                        style={
                            {
                                zIndex: this.state.showSubtaskDivButtonZIndex,
                            }
                        }
                        onClick={this.showSubtaskField}
                        disabled={this.state.showSubtaskDivButtonDisabled}>+</button>
                <p className={'task_text'}
                   style={
                       {
                           opacity: this.state.taskTextOpacity,
                       }
                   }
                   onClick={this.showEditTaskField}>{this.state.taskTextValue}</p>
                <button className={'remove_task_button'}
                        style={
                            {
                                transform: this.state.removeTaskButtonScale,
                                transitionDelay: this.state.removeTaskButtonTransitionDelay,
                            }
                        }
                        disabled={this.state.removeTaskButtonDisabled} type={'button'}>
                    <img src="/static/icons/delete.svg" alt=""/>
                </button>
                <div className={'subtask_div'} style={{visibility: this.state.subtaskDivVisibility}}>
                    <input className={'subtask_text_field'}
                           type="text"
                           style={
                               {
                                   width: this.state.subtaskTextFieldWidth,
                                   opacity: this.state.subtaskTextFieldOpacity,
                               }
                           }/>
                    <button className={'add_subtask_button'}
                            type={'button'}
                            style={
                                {
                                    opacity: this.state.addSubtaskButtonOpacity,
                                    transform: this.state.addSubtaskButtonScale,
                                    transitionDelay: this.state.addSubtaskButtonTransitionDelay,
                                }
                            }>
                        <img src="/static/icons/add_sub.svg" alt="+"/>
                    </button>
                </div>
                <div className={'task_text_edit_div'}
                     style={
                         {
                             visibility: this.state.taskTextEditDivVisibility,
                         }
                     }>
                    <input className={'task_text_edit_field'}
                           style={
                               {
                                   opacity: this.state.taskTextEditFieldOpacity,
                                   width: this.state.taskTextEditFieldWidth,
                                   transform: this.state.taskTextEditFieldScale,
                               }
                           }
                           type={'text'}
                           ref={this.editTextField}
                           onKeyDown={this.saveEdit}
                           // onBlur={this.showEditTaskField}
                    />
                    <button className={'save_edit_button'}
                            style={
                                {
                                    transform: this.state.saveEditButtonScale,
                                    transitionDelay: this.state.saveEditButtonTransitionDelay,
                                }
                            }
                            type={'button'}
                            onClick={this.showEditTaskField}>
                        <img src='/static/icons/edit.svg' alt='+'/>
                    </button>
                </div>
            </div>
        )
    }
}

//TODO Maybe compile class LoadingWindow and knock_knock function together????
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
                loadingWindow.style.visibility = 'visible';
                this.startTime = Date.now();
                this.isAlive = true;
            }, 200);
        }
    }

    hideWindow(loadingWindow) {
        if (this.reqCount > 0) {
            this.reqCount--;
            this.stopTime = Date.now();
        }
        if (this.reqCount === 0) {
            this.timerShow = clearTimeout(this.timerShow);
            if (this.isAlive) {
                if (this.stopTime - this.startTime >= 200) {
                    loadingWindow.style.visibility = 'hidden';
                    this.isAlive = false;
                } else {
                    this.timerHide = setTimeout(() => {
                        loadingWindow.style.visibility = 'hidden';
                        this.isAlive = false;
                    }, 200 - (this.stopTime - this.startTime));
                }
            }
        }
    }
}

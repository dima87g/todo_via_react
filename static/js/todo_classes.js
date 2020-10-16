'use strict';

class TaskList {
    constructor(loginInst, rawTasks) {
        this.loginInst = null;
        this.rawTasks = rawTasks;
        this.tasksTree = new Map();
        this.tasks = [];

        for (let task of this.rawTasks) {
            let taskId = task['task_id'];
            let taskText = task['task_text'];
            let taskStatus = task['task_status'];
            let taskParentId = task['parent_id'];

            this.tasksTree.set(taskId, new Task(taskId, taskText, taskParentId, taskStatus));
        }

        for (let task of this.tasksTree.values()) {
            if (this.tasksTree.has(task.parentId)) {
                this.tasksTree.get(task.parentId).subtasks.push(task);
            } else {
                this.tasks.push(task);
            }
        }

        ReactDOM.render(<TaskListReact loginInst={this.loginInst}
                                       taskListInst={this}
                                       tasksTree={this.tasksTree}
                                       tasks={this.tasks}/>, document.getElementById('root'));
    }
}

class Task {
    constructor(id, text, parentId = null, status = false) {
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.subtasks = [];
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
        this.agreementCheckbox = document.getElementById('agreement_checkbox');
        this.userRegisterButton = document.getElementById("register_form_button");
        this.switchRegisterButton = document.getElementById("register_button");
        this.switchLoginButton = document.getElementById("login_button");
        this.userNameField = document.getElementById("user_name_field");
        this.userLogOutButton = document.getElementById('user_logout_button');
        this.userDeleteButton = document.getElementById("user_delete_button");
        this.userChangePasswordButton = document.getElementById('change_password_button');
        this.changePasswordWindow = document.getElementById('change_password_window');
        this.changePasswordWindowCancelButton = document.getElementById('change_password_window_cancel_button');
        this.changePasswordFormOldPassword = document.getElementById('change_password_form_old_password');
        this.changePasswordFormNewPassword = document.getElementById('change_password_form_new_password');
        this.changePasswordFormNewPasswordConfirm = document.getElementById('change_password_form_new_password_confirm');
        this.changePasswordButton = document.getElementById('change_password_form_button');
        this.changePasswordWindowInfo = document.getElementById('change_password_window_info');

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
        this.changePasswordButton.onclick = function() {
            self.changePassword();
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
        this.userChangePasswordButton.disabled = true;
        this.authMenu.style.visibility = 'visible';
        this.loginFormUsername.focus();
        setTimeout(() => {
            this.authMenu.style.opacity = '1';
        });
    }

    showChangePasswordWindow() {
        showShadow();
        this.userLogOutButton.disabled = true;
        this.userDeleteButton.disabled = true;
        this.userChangePasswordButton.disabled = true;
        this.changePasswordWindow.style.visibility = 'visible';
        this.changePasswordWindowCancelButton.disabled = false;
        this.changePasswordButton.disabled = false;
    }

    hideChangePasswordWindow() {
        hideShadow();
        this.changePasswordFormOldPassword.value = '';
        this.changePasswordFormNewPassword.value = '';
        this.changePasswordFormNewPasswordConfirm.value = '';
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

                this.taskList = new TaskList(this, tasksFromServer);
                // let taskInputButton = document.getElementById("task_input_button");
                //
                // taskInputButton.onclick = () => {
                //     this.taskList.addTask();
                //     return false;
                // }

                // let tasksTree = this.taskList.tasksTree;
                //
                // for (let task of tasksFromServer) {
                //     let taskId = task["task_id"];
                //     let taskText = task["task_text"];
                //     let taskStatus = task["task_status"];
                //     let parentId = task["parent_id"];
                //
                //     tasksTree.set(taskId, new Task(this, this.taskList, taskId, taskText, parentId, taskStatus));
                // }
                //
                // for (let task of tasksTree.values()) {
                //     if (tasksTree.has(task.parentId)) {
                //         tasksTree.get(task.parentId).subtasks.push(task);
                //     } else {
                //         this.taskList.tasks.push(task);
                //     }
                // }
                //
                // this.taskList.updateDom();

            }
            if (answer["error_code"] === 401) {
                this.forceLogOut();
                showInfoWindow("Authorisation problem!");
            }
        }
        knock_knock('/load_tasks', loadTasks);
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
                    this.userChangePasswordButton.disabled = false;

                    this.hideLoginWindow();

                    this.onLoad()
                } else {
                    this.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
                }
            }
            knock_knock('/user_login', login, sendData);
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
        let userLanguage = getCookie('lang');
        let message = null;

        if (userLanguage === 'ru') {
            message = 'Вы уверены, что хотите выйти?';
        } else if (userLanguage === 'en') {
            message = 'Are you sure, you want to log out?';
        }
        showConfirmWindow(out, message);

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
            knock_knock("/user_delete", del);
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
        let userLanguage = getCookie('lang');
        let message = null;

        if (userLanguage === 'ru') {
            message = 'Вы уверены, что хотите удалить пользователя?';
        } else if (userLanguage === 'en') {
            message = 'Are you sure, you want to delete user?';
        }
        showConfirmWindow(confirm, message);
    }

    changePassword() {
        removeChildren(this.changePasswordWindowInfo);

        if (this.changePasswordFormOldPassword.value && this.changePasswordFormNewPassword.value && this.changePasswordFormNewPasswordConfirm.value) {
            if (this.changePasswordFormNewPassword.value === this.changePasswordFormNewPasswordConfirm.value) {
                let oldPassword = this.changePasswordFormOldPassword.value;
                let newPassword = this.changePasswordFormNewPassword.value;

                const sendData = {'oldPassword': oldPassword, 'newPassword': newPassword};

                const change = (answer) => {
                    if (answer['ok'] === true) {
                        this.hideChangePasswordWindow();
                        showInfoWindow('Password is successfully changed!');
                    } else if (answer['error_code'] === 401) {
                        this.hideChangePasswordWindow();
                        this.forceLogOut();
                        showInfoWindow('Authorisation problem!');
                    } else {
                        this.changePasswordWindowInfo.appendChild(document.createTextNode(answer['error_message']));
                    }
                }
                knock_knock('/change_password', change, sendData);
            } else {
                this.changePasswordWindowInfo.appendChild(document.createTextNode('Passwords are not match!'));
            }
        } else if (!this.changePasswordFormOldPassword.value) {
            this.changePasswordWindowInfo.appendChild(document.createTextNode('Please, enter your old password!'));
        } else if (!this.changePasswordFormNewPassword.value) {
            this.changePasswordWindowInfo.appendChild(document.createTextNode('Please, enter new password!'));
        } else if (!this.changePasswordFormNewPasswordConfirm.value) {
            this.changePasswordWindowInfo.appendChild(document.createTextNode('Please, confirm new password!'));
        }
    }

    userRegister() {
        /**
         * POST: json =  {"newUserName": "string",  "password": "string"}
         * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
     'error_message': 'string' or null}
         */
        removeChildren(this.registerWindowInfo);

        if (this.registerFormUsername.value && this.registerFormPassword.value
            && this.registerFormPasswordConfirm.value && this.agreementCheckbox.checked === true) {
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
                knock_knock('/user_register', register, sendData);
            } else {
                this.registerWindowInfo.appendChild(document.createTextNode('Passwords are not match!'));
            }
        } else if (!this.registerFormUsername.value) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, enter new user name!'));
        } else if (!this.registerFormPassword.value) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, enter Password!'));
        } else if (!this.registerFormPasswordConfirm.value) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, confirm Password!'));
        } else if (!this.agreementCheckbox.checked) {
            this.registerWindowInfo.appendChild(document.createTextNode('Please, accept agreements!'));
        }
    }
}

class TaskListReact extends React.Component {
    constructor(props) {
        super(props)
        this.loginInst = this.props.loginInst;
        this.taskListInst = this.props.taskListInst;
        this.tasksTree = this.props.tasksTree;
        this.tasks = this.props.tasks;
        this.state = {
            linearTasksList: this.makeLinearList(this.tasks),
        }
        this.linearTasksList = this.makeLinearList(this.tasks);
        this.addTask = this.addTask.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.textInputField = React.createRef();
    }

    makeLinearList(tasksList) {
        let linearTasksList = [];

        function recursionWalk(tasksList) {
            for (let task of tasksList) {
                linearTasksList.push(task);
                if (task.subtasks.length > 0) {
                    recursionWalk(task.subtasks);
                }
            }
        }
        recursionWalk(tasksList);

        return linearTasksList;
    }

    /**
     * POST: json = {'taskText': 'string', 'parentId' = 'number'}
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    addTask(e) {
        e.preventDefault();
        if (this.textInputField.current.value) {
            let taskText = this.textInputField.current.value;
            this.textInputField.current.value = '';
            let sendData = {'taskText': taskText, 'parentId': null}

            const add = (answer) => {
                if (answer['ok'] === true) {
                    let taskId = answer['task_id'];
                    let newTask = new Task(taskId, taskText);

                    this.tasksTree.set(newTask.id, newTask);
                    this.tasks.push(newTask);

                    this.setState({
                        linearTasksList: this.makeLinearList(this.tasks),
                    })
                } else if (answer['error_code'] === 401) {
                    this.loginInst.forceLogOut();
                    showInfoWindow('Authorisation problem!');
                }
            }
            knock_knock('/save_task', add, sendData);
        }
    }

    /**
     * POST: json = {'taskText': 'string', 'parentId' = 'number'}
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    addSubtask(subtaskParentId, subtaskText) {
        let sendData = {'taskText': subtaskText, 'parentId': subtaskParentId}

        const add = (answer) => {
            if (answer['ok'] === true) {
                let taskId = answer['task_id'];
                let newTask = new Task(taskId, subtaskText, subtaskParentId);

                this.tasksTree.set(taskId, newTask);
                this.tasksTree.get(subtaskParentId).subtasks.push(newTask);

                this.setState({
                    linearTasksList : this.makeLinearList(this.tasks),
                })
            } else if (answer['error_code'] === 401) {
                this.loginInst.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        knock_knock('/save_task', add, sendData);
    }

    /**
     * POST: {taskId: 'number'}
     * GET:
     * if OK = true: json = {'ok': true}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     * @param task
     */
    removeTask(task) {
        let sendData = {'taskId': task.id}
        const remove = (answer) => {
            if (answer['ok'] === true) {
                if (this.tasksTree.has(task.parentId)) {
                    let childrenList = this.tasksTree.get(task.parentId).subtasks;
                    childrenList.splice(childrenList.indexOf(task), 1);
                } else {
                    this.tasks.splice(this.tasks.indexOf(task), 1);
                }
                this.setState({
                    linearTasksList: this.makeLinearList(this.tasks),
                })
            } else if (answer['error_code'] === 401) {
                this.loginInst.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        knock_knock('/delete_task', remove, sendData);
    }

    render() {
        return (
            <div className={'main_window'}>
                <div className="task_input">
                    <form onSubmit={this.addTask}>
                        <label htmlFor={'task_input_field'}/>
                            <input type={'text'}
                                   className={'task_input_field'}
                                   onSubmit={this.addTask}
                                   ref={this.textInputField}/>
                            <button type={'button'}
                                    className={'task_input_button'}
                                    onClick={this.addTask}>
                        <img src="/static/icons/add_sub.svg" alt="+"/>
                    </button>
                    </form>
                </div>
                <div className="main_tasks">
                    {this.state.linearTasksList.map((task) => <TaskReact key={task.id.toString()}
                                                                         loginInst={this.loginInst}
                                                                         taskInst={task}
                                                                         taskId={task.id}
                                                                         status={task.status}
                                                                         taskText={task.text}
                                                                         parentId={task.parentId}
                                                                         removeTaskFunc={this.removeTask}
                                                                         addSubtaskFunc={this.addSubtask}/>)}
                </div>
            </div>
        )
    }
}

class TaskReact extends React.Component {
    constructor(props) {
        super(props);
        this.taskInst = this.props.taskInst;
        this.loginInst = this.props.loginInst;
        this.taskId = this.props.taskId;
        this.shadow = shadow();
        this.state = {
            status: this.props.status,
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
            addSubtaskButtonDisabled: true,
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
        this.removeTask = this.removeTask.bind(this);
        this.showEditTaskField = this.showEditTaskField.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.showSubtaskField = this.showSubtaskField.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.addSubtaskField = React.createRef();
        this.editTaskField = React.createRef();
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
            'taskId': this.taskId,
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
        knock_knock('/finish_task', finish, sendData);
    }

    removeTask() {
        this.props.removeTaskFunc(this.taskInst);
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
                addSubtaskButtonDisabled: false,
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
                addSubtaskButtonDisabled: true,
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

    addSubtask() {
        if (this.addSubtaskField.current.value) {
            let subtaskText = this.addSubtaskField.current.value;
            this.addSubtaskField.current.value = '';

            this.showSubtaskField();

            this.props.addSubtaskFunc(this.taskId, subtaskText);

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
            this.editTaskField.current.value = this.state.taskTextValue;
        } else {
            if (this.editTaskField.current.value !== this.state.taskTextValue) {
                let sendData = {
                    'taskId': this.props.taskId,
                    'taskText': this.editTaskField.current.value
                };

                const saveEdit = (answer) => {
                    if (answer['ok'] === true) {
                        this.setState({
                            taskTextValue: this.editTaskField.current.value,
                        })
                    } else if (answer['error_code'] === 401) {
                        this.loginInst.forceLogOut();
                        showInfoWindow('Authorisation problem!');
                    }
                }
                knock_knock('/save_edit_task', saveEdit, sendData);
            }
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
                taskTextOpacity: '1',
            })
            this.hideEditDivTimer = setTimeout(() => {
                this.setState({
                    taskTextEditDivVisibility: 'hidden',
                })
            }, 700);
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
                        disabled={this.state.removeTaskButtonDisabled}
                        type={'button'}
                        onClick={this.removeTask}>
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
                           }
                           ref={this.addSubtaskField}/>
                    <button className={'add_subtask_button'}
                            type={'button'}
                            style={
                                {
                                    opacity: this.state.addSubtaskButtonOpacity,
                                    transform: this.state.addSubtaskButtonScale,
                                    transitionDelay: this.state.addSubtaskButtonTransitionDelay,
                                }
                            }
                            disabled={this.state.addSubtaskButtonDisabled}
                            onClick={this.addSubtask}>
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
                           ref={this.editTaskField}
                           onKeyDown={this.saveEdit}
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

'use strict';

class Task {
    constructor(id, text, parentId = null, status = false) {
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.subtasks = [];
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            shadow: {
                showed: true,
                opacity: '0.5',
                visibility: 'visible',
            },
            loadingWindow: {
                showed: false,
                reqCount: 0,
                startTime: null,
                stopTime: null,
            },
            confirmWindow: {
                visibility: 'hidden',
                opacity: '0',
                message: '',
            },
            confirmWindowOnClick: null,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        }
        this.authCheck = this.authCheck.bind(this);
        this.createTaskList = this.createTaskList.bind(this);
        this.logOut = this.logOut.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.showConfirmWindow = this.showConfirmWindow.bind(this);
        this.knockKnock = this.knockKnock.bind(this);
        this.login = React.createRef();
        this.userNameField = React.createRef();
        this.loadingWindow = React.createRef();
    }

    componentDidMount() {
        this.authCheck();
    }

    authCheck() {
        const responseHandler = (response) => {
            if (response.status === 200) {
                this.createTaskList();
                this.login.current.hideLoginWindow();
            } else {
                showCookiesAlertWindow();
            }
        }
        this.knockKnock('/auth_check', responseHandler);
    }

    createTaskList() {
        const responseHandler = (response) => {
            if (response.status === 200) {
                let userName = response.data['user_name'];
                let tasksFromServer = response.data['tasks'];

                this.userNameField.current.appendChild(document.createTextNode(userName));

                ReactDOM.render(
                    <TaskListReact app={this}
                                   login={this.login.current}
                                   tasksFromServer={tasksFromServer}/>, document.getElementById('task_list'));
            } else if (response.status === 401) {
                this.login.current.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.knockKnock('/load_tasks', responseHandler);
    }

    removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    logOut() {
        this.login.current.logOut();
    }

    changePassword() {
        this.login.current.changePasswordWindow();
    }

    userDelete() {
        this.login.current.userDelete();
    }

    showConfirmWindow(message, func) {
        confirmWindowOnClick = confirmWindowOnClick.bind(this);
        this.showShadowModal();

        function confirmWindowOnClick(e) {
            if (e.target.value === 'ok') {
                func();
            }
            this.setState({
                confirmWindow: {
                    ...this.state.confirmWindow,
                    opacity: '0',
                    message: '',
                },
            });
            setTimeout(() => {
                this.setState({
                    confirmWindow: {
                        ...this.state.confirmWindow,
                        visibility: 'hidden',
                    },
                });
            }, 500);
            this.hideShadowModal();
        }
        this.setState({
            confirmWindow: {
                ...this.state.confirmWindow,
                visibility: 'visible',
                opacity: '1',
                message: message,
            },
            confirmWindowOnClick: confirmWindowOnClick,
        });
    }

    showShadowModal() {
        this.hideShadowModalTimeout = clearTimeout(this.hideShadowModalTimeout);
        this.setState({
            shadow: {
                ...this.state.shadow,
                visibility: 'visible',
                opacity: '0.5',
            }
        });
    }

    hideShadowModal() {
        this.setState({
            shadow: {
                ...this.state.shadow,
                opacity: '0',
            },
        });
        this.hideShadowModalTimeout = setTimeout(() => {
            this.setState({
                shadow: {
                    ...this.state.shadow,
                    visibility: 'hidden',
                },
            });
        }, 500);
    }

    knockKnock(path, func, sendData) {
        const req = axios.default;
        this.loadingWindow.current.showWindow();
        req.post(path, sendData)
            .then((response) => {
                this.loadingWindow.current.hideWindow();
                if (response.headers['content-type'] === 'application/json') {
                    func(response);
                }
            })
            .catch((error) => {
                this.loadingWindow.current.hideWindow();
                console.log(error);
                func(error.response);
            })
    }

    render() {
        return (
            <div className={'app'} id={'app'}>
                <div className="header">
                    <a href="/ru" className={'language_switch_button'}>Русский</a>
                    <a href="/en" className={'language_switch_button'}>English</a>
                    <p className={"user_name_field"}
                       id={'user_name_field'}
                       ref={this.userNameField}/>
                    <input type="button"
                           className='user_logout_button'
                           id='user_logout_button'
                           value={localisation['buttons']['logout']}
                           disabled={this.state.userLogOutButtonDisabled}
                           onClick={this.logOut}/>
                    <input type="button"
                           className="user_delete_button"
                           id="user_delete_button"
                           value={localisation['buttons']['delete_user']}
                           disabled={this.state.userDeleteButtonDisabled}
                           onClick={this.userDelete}/>
                    <input type="button"
                           className="change_password_button"
                           id="change_password_button"
                           value={localisation['buttons']['change_password']}
                           disabled={this.state.changePasswordButtonDisabled}
                           onClick={this.changePassword}/>
                   <p className="version">Ver. 1.8</p>
                </div>
                <div className={'task_list'} id={'task_list'}/>
                <LoginReact app={this}
                            ref={this.login}/>
                <div className={"confirm_window"}
                     id={"confirm_window"}
                     style={
                         {
                             visibility: this.state.confirmWindow.visibility,
                             opacity: this.state.confirmWindow.opacity,
                         }
                     }>
                    <p className="confirm_window_message" id="confirm_window_message">
                        {this.state.confirmWindow.message}
                    </p>
                    <button type="button"
                            className="confirm_window_ok_button"
                            id="confirm_window_ok_button"
                            value="ok"
                            onClick={this.state.confirmWindowOnClick}>
                        OK
                    </button>
                    <button type="button"
                            className="confirm_window_cancel_button"
                            id="confirm_window_cancel_button"
                            value='cancel'
                            onClick={this.state.confirmWindowOnClick}>
                        {localisation['confirm_window']['cancel_button']}
                    </button>
                </div>
                <div className="info_window" id="info_window">
                    <p className="info_window_message" id="info_window_message"/>
                </div>
                <LoadingWindowReact ref={this.loadingWindow}/>
                <div className={'shadow'}
                     id={'shadow'}
                     style={
                         {
                             visibility: this.state.shadow.visibility,
                             opacity: this.state.shadow.opacity,
                         }
                     }/>
                <div className={"cookies_alert_window"} id={"cookies_alert_window"}>
                    <p className={"cookies_alert_window_text"} id={"cookies_alert_window_text"}/>
                    <button type={"button"}
                            className={"cookies_alert_confirm_button"}
                            id={"cookies_alert_confirm_button"}>
                        OK
                    </button>
                </div>
            </div>
        )
    }
}

class LoginReact extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.state = {
            authMenu: {
                opacity: '1',
                visibility: 'visible',
            },
            loginWindow: {
                opacity: 1,
                visibility: 'inherit',
            },
            loginWindowSwitchButton: {
                disabled: false,
            },
            registerWindow: {
                opacity: 0,
                visibility: 'hidden',
            },
            registerWindowSwitchButton: {
                disabled: true,
            },
            changePasswordWindow: {
                showed: false,
                cancelButtonDisabled: true,
                submitButtonDisabled: true,
            },
            changePasswordWindowShowed: false,
            changePasswordBWindowCancelButtonDisabled: true,
        }
        this.switchLogin = this.switchLogin.bind(this);
        this.hideLoginWindow = this.hideLoginWindow.bind(this);
        this.login = this.login.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.changePasswordWindow = this.changePasswordWindow.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.userRegister = this.userRegister.bind(this);
        this.loginFormUsernameField = React.createRef();
        this.loginFormPasswordField = React.createRef();
        this.registerFormUsernameField = React.createRef();
        this.registerFormPasswordField = React.createRef();
        this.registerFormPasswordConfirmField = React.createRef();
        this.loginFormInfo = React.createRef();
        this.registerFormInfo = React.createRef();
        this.changePasswordFormInfo = React.createRef();
    }

    switchLogin(e) {
        if (e.target.value === 'register') {
            this.setState({
                loginWindow: {
                    ...this.state.loginWindow,
                    opacity: 0,
                    visibility: 'hidden',
                },
                loginWindowSwitchButton: {
                    ...this.state.loginWindowSwitchButton,
                    disabled: true,
                },
                registerWindow: {
                    ...this.state.registerWindow,
                    opacity: 1,
                    visibility: 'inherit',
                },
                registerWindowSwitchButton: {
                    ...this.state.registerWindowSwitchButton,
                    disabled: false,
                },
            })
            this.loginFormUsernameField.current.value = '';
            this.loginFormPasswordField.current.value = '';
            this.app.removeChildren(this.loginFormInfo.current);
        } else {
            this.setState({
                loginWindow: {
                    ...this.state.loginWindow,
                    opacity: 1,
                    visibility: 'inherit',
                },
                loginWindowSwitchButton: {
                    ...this.state.loginWindowSwitchButton,
                    disabled: false,
                },
                registerWindow: {
                    ...this.state.registerWindow,
                    opacity: 0,
                    visibility: 'hidden',
                },
                registerWindowSwitchButton: {
                    ...this.state.registerWindowSwitchButton,
                    disabled: false,
                },
            });
            this.registerFormUsernameField.current.value = '';
            this.registerFormPasswordField.current.value = '';
            this.registerFormPasswordConfirmField.current.value = '';
            this.app.removeChildren(this.registerFormInfo.current);
        }
    }

    hideLoginWindow() {
        this.loginFormUsernameField.current.value = '';
        this.loginFormPasswordField.current.value = '';
        this.registerFormUsernameField.current.value = '';
        this.registerFormPasswordField.current.value = '';
        this.registerFormPasswordConfirmField.current.value = '';
        this.app.removeChildren(this.loginFormInfo.current);
        this.app.hideShadowModal();
        this.setState({
            authMenu: {
                ...this.state.authMenu,
                opacity: '0',
            }
        });
        this.hideLoginWindowTimeout = setTimeout(() => {
            this.setState({
                authMenu: {
                    ...this.state.authMenu,
                    visibility: 'hidden',
                }
            });
        }, 500);
        this.app.setState({
            userLogOutButtonDisabled: false,
            userDeleteButtonDisabled: false,
            changePasswordButtonDisabled: false,
        })
    }

    showLoginWindow() {
        this.hideLoginWindowTimeout = clearTimeout(this.hideLoginWindowTimeout);
        this.app.removeChildren(this.app.userNameField.current);

        this.app.showShadowModal();

        this.setState({
            authMenu: {
                ...this.state.authMenu,
                visibility: 'visible',
                opacity: '1',
            }
        });
        this.app.setState({
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        })
    }

    login(e) {
        e.preventDefault();

        this.app.removeChildren(this.loginFormInfo.current);

        const userName = this.loginFormUsernameField.current.value;
        const password = this.loginFormPasswordField.current.value;

        if (userName && password) {
            const data = {'userName': userName, 'password': password}
            const loginResponseHandler = (response) => {
                if (response.status === 200) {
                    this.app.createTaskList();
                    this.hideLoginWindow();
                } else if (response.status === 401) {
                    this.loginFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
                }
            }
            this.app.knockKnock('/user_login', loginResponseHandler, data);
        } else if (!userName) {
            this.loginFormInfo.current.appendChild(document.createTextNode('Please, enter user name!'));
        } else if (!password) {
            this.loginFormInfo.current.appendChild(document.createTextNode('Please, enter password!'));
        }
    }

    logOut() {
        const confirmFunction = () => {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';

        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));

        this.showLoginWindow();
        }
        let userLanguage = getCookie('lang');
        let message = null;

        if (userLanguage === 'ru') {
            message = 'Вы уверены, что хотите выйти?';
        } else {
            message = 'Are you sure, you want to logOut?';
        }

        this.app.showConfirmWindow(message, confirmFunction);

    }

    userDelete() {
        let userLanguage = getCookie('lang');
        let message = null;

        if (userLanguage === 'ru') {
            message = 'Выуверены, что хотите удалить пользователя?';
        } else {
            message = 'Are you sure, you want to delete user?';
        }
        const responseHandler = (response) => {
            if (response.status === 200) {
                this.forceLogOut();
            } else if (response.status === 401) {
                this.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }

        const confirmFunction = () => {
            this.app.knockKnock('/user_delete', responseHandler);
        }

        this.app.showConfirmWindow(message, confirmFunction);
    }

    changePasswordWindow() {
        if (this.state.changePasswordWindow.showed === false) {
            this.showLoginWindow();
            this.setState({
                loginWindow: {
                    ...this.state.loginWindow,
                    visibility: 'hidden',
                },
                registerWindow: {
                    ...this.state.registerWindow,
                    visibility: 'hidden',
                },
                changePasswordWindow: {
                    ...this.state.changePasswordWindow,
                    showed: true,
                    cancelButtonDisabled: false,
                    submitButtonDisabled: false,
                }
            });
        } else {
            this.hideLoginWindow();
            this.setState({
                loginWindow: {
                    ...this.state.loginWindow,
                    visibility: 'inherit',
                },
                registerWindow: {
                    ...this.state.registerWindow,
                    visibility: 'hidden',
                },
                changePasswordWindow: {
                    ...this.state.changePasswordWindow,
                    showed: false,
                    cancelButtonDisabled: true,
                    submitButtonDisabled: true,
                }
            });
        }
    }

    changePassword(e) {
        e.preventDefault();

        this.app.removeChildren(this.changePasswordFormInfo.current);

        let oldPassword = e.target['change_password_form_old_password'].value;
        let newPassword = e.target['change_password_form_new_password'].value;
        let newPasswordConfirm = e.target['change_password_form_new_password_confirm'].value;

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.changePasswordWindow();
                showInfoWindow('Password is changed!');
            } else if (response.status === 401) {
                this.forceLogOut();
                showInfoWindow('Authorisation problem!');
            } else {
                this.changePasswordFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
            }
        }

        if (oldPassword && newPassword && newPasswordConfirm) {
            if (newPassword === newPasswordConfirm) {
                const sendData = {'oldPassword': oldPassword, 'newPassword': newPassword};

                this.app.knockKnock('change_password', responseHandler, sendData);
            } else {
                this.changePasswordFormInfo.current.appendChild(document.createTextNode('Passwords are not match!'));
            }
        } else if (!oldPassword) {
            this.changePasswordFormInfo.current.appendChild(document.createTextNode('Please, enter old password!'));
        }else if (!newPassword) {
            this.changePasswordFormInfo.current.appendChild(document.createTextNode('Please, enter new password!'));
        }else if (!newPasswordConfirm) {
            this.changePasswordFormInfo.current.appendChild(document.createTextNode('Please, confirm new password!'));
        }
    }

    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */
    userRegister(e) {
        e.preventDefault();

        this.app.removeChildren(this.registerFormInfo.current);

        let userName = document.forms['register_form']['register_form_username'].value;
        let password = document.forms['register_form']['register_form_password'].value;
        let confirmPassword = document.forms['register_form']['register_form_password_confirm'].value;
        let agreementCheckbox = e.target['agreement_checkbox'];

        const handleResponse = (response) => {
            if (response.status === 200) {
                if (response.data['ok'] === true) {
                    this.registerFormInfo.current.appendChild(document.createTextNode('New user ' + userName + ' register!'));
                }
            }
        }

        if (userName && password && confirmPassword && agreementCheckbox.checked) {
            if (password === confirmPassword) {
                const sendData = {'newUserName': userName, 'password': password};

                this.app.knockKnock('/user_register', handleResponse, sendData);
            } else {
                this.registerFormInfo.current.appendChild(document.createTextNode('Passwords are not match!'));
            }
        } else if (!userName) {
            this.registerFormInfo.current.appendChild(document.createTextNode('Please, enter user name!'));
        } else if (!password) {
            this.registerFormInfo.current.appendChild(document.createTextNode('Please, enter password!'));
        } else if (!confirmPassword) {
            this.registerFormInfo.current.appendChild(document.createTextNode('Please, confirm password!'));
        } else if (!agreementCheckbox.checked) {
            this.registerFormInfo.current.appendChild(document.createTextNode('Please, accept the agreements!'));
        }
    }

    forceLogOut() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';

        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));

        this.showLoginWindow();
        console.log('Force logOut!!!!!');
    }

    render() {
        let changePasswordWindowStyle = 'change_password_window';
        if (this.state.changePasswordWindow.showed) {
            changePasswordWindowStyle += ' change_password_window_showed';
        }
        return (
            <div className={'auth_menu'} id={'auth_menu'} style={
                {
                    visibility: this.state.authMenu.visibility,
                    opacity: this.state.authMenu.opacity,
                }
            }>
                <div className={'login_window'} id={'login_window'}
                     style={
                         {
                             visibility: this.state.loginWindow.visibility,
                             opacity: this.state.loginWindow.opacity
                         }
                     }>
                    <p className="auth_menu_forms_labels">{localisation['login_window']['label']}</p>
                    <form name="login_form" onSubmit={this.login}>
                        <label htmlFor="login_form_username"
                               className={"auth_menu_labels"}>{localisation['login_window']['user_name']}</label>
                        <input type="text" name="login_form_username"
                               className={"login_form_username"}
                               id={"login_form_username"}
                               ref={this.loginFormUsernameField}
                               placeholder={localisation['login_window']['user_name_placeholder']}
                               autoComplete={'off'}/>
                        <label htmlFor="login_form_password"
                               className={"auth_menu_labels"}>{localisation['login_window']['password']}</label>
                        <input type="password" name="login_form_password"
                               className={"login_form_password"}
                               id={"login_form_password"}
                               ref={this.loginFormPasswordField}
                               placeholder={localisation['login_window']['password_placeholder']}
                        />
                        <button type={"submit"}
                                className={"login_form_button"}
                                id={"login_form_button"}>
                            {localisation['login_window']['submit_button']}
                        </button>
                    </form>
                    <p className="login_window_info"
                       id="login_window_info"
                       ref={this.loginFormInfo}
                    />
                    <button type="button"
                            className={"switch_to_register_button"}
                            id={"switch_to_register_button"}
                            value={'register'}
                            disabled={this.state.loginWindowSwitchButton.disabled}
                            onClick={this.switchLogin}>
                        {localisation['login_window']['switch_to_register_button']}
                    </button>
                </div>
                <div className={'register_window'} id={'register_window'}
                     style={
                         {
                             visibility: this.state.registerWindow.visibility,
                             opacity: this.state.registerWindow.opacity,
                         }
                     }>
                    <p className={"auth_menu_forms_labels"}>{localisation['register_window']['label']}</p>
                    <form name="register_form" onSubmit={this.userRegister}>
                        <label htmlFor="register_form_username"
                               className={"auth_menu_labels"}>{localisation['register_window']['user_name']}</label>
                        <input type="text"
                               name={"register_form_username"}
                               id={"register_form_username"}
                               className={"register_form_username"}
                               ref={this.registerFormUsernameField}
                               placeholder={ localisation['register_window']['user_name_placeholder']}
                               autoComplete={'off'}/>
                        <label htmlFor={"register_form_password"}
                               className={"auth_menu_labels"}>{localisation['register_window']['password']}</label>
                        <input type={"password"}
                               name={"register_form_password"}
                               id={"register_form_password"}
                               className={"register_form_password"}
                               ref={this.registerFormPasswordField}
                               placeholder={localisation['register_window']['password_placeholder']}/>
                        <label htmlFor={"register_form_password_confirm"}
                               className={"auth_menu_labels"}>{localisation['register_window']['password_confirm']}</label>
                        <input type={"password"}
                               name={"register_form_password_confirm"}
                               id={"register_form_password_confirm"}
                               className={"register_form_password_confirm"}
                               ref={this.registerFormPasswordConfirmField}
                               placeholder={localisation['register_window']['password_confirm_placeholder']}/>
                        <p className={"agreement"} id={"agreement"}>
                            <input type={"checkbox"} id={"agreement_checkbox"} name={'agreement_checkbox'}/>
                            <label htmlFor="agreement_checkbox">Нажимая вы соглашаетесь с
                            <a href="../static/agreements/agreement_ru.html"
                               target="_blank">соглашением</a>, воть.</label></p>
                        <button type={"submit"}
                               id={"register_form_button"}
                                className={"register_form_button"}>
                            {localisation['register_window']['create_button']}
                        </button>
                    </form>
                    <p className={"register_window_info"}
                       id={"register_window_info"}
                       ref={this.registerFormInfo}/>
                    <button type={"button"}
                            className={"login_button"}
                            id={"login_button"}
                            value={'login'}
                            disabled={this.state.registerWindowSwitchButton.disabled}
                            onClick={this.switchLogin}>
                        {localisation['register_window']['switch_to_login_button']}
                    </button>
                </div>
                <div className={changePasswordWindowStyle} id={"change_password_window"}>
                    <button type={"button"} id={"change_password_window_cancel_button"}
                            className={"change_password_window_cancel_button"}
                            disabled={this.state.changePasswordWindow.cancelButtonDisabled}
                            onClick={this.changePasswordWindow}>X</button>
                    <p className={"auth_menu_forms_labels"}>{localisation['change_password_window']['label']}</p>
                    <form name={"change_password_form"} onSubmit={this.changePassword}>
                        <label htmlFor={"change_password_form_old_password"}
                               className={"auth_menu_labels"}>{localisation['change_password_window']['old_password']}</label>
                        <input type={"password"}
                               name={"change_password_form_old_password"}
                               id={"change_password_form_old_password"}
                               className={"change_password_form_old_password"}
                               placeholder={localisation['change_password_window']['old_password_placeholder']}/>
                        <label htmlFor={"change_password_form_new_password"}
                               className={"auth_menu_labels"}>{localisation['change_password_window']['new_password']}</label>
                        <input type={"password"}
                               name={"change_password_form_new_password"}
                               id={"change_password_form_new_password"}
                               className={"change_password_form_new_password"}
                               placeholder={localisation['change_password_window']['new_password_placeholder']}/>
                        <label htmlFor={"change_password_form_new_password_confirm"}
                               className={"auth_menu_labels"}>{localisation['change_password_window']['new_password_confirm']}</label>
                        <input type={"password"}
                               name={"change_password_form_new_password_confirm"}
                               id={"change_password_form_new_password_confirm"}
                               className={"change_password_form_new_password_confirm"}
                               placeholder={localisation['change_password_window']['new_password_confirm_placeholder']}/>
                        <button type={"submit"} value={"Change password"} id={"change_password_form_button"}
                                className={"change_password_form_button"}
                                disabled={this.state.changePasswordWindow.submitButtonDisabled}>
                            {localisation['change_password_window']['change_password_button']}
                        </button>
                    </form>
                    <p className={"change_password_window_info"}
                       id={"change_password_window_info"}
                       ref={this.changePasswordFormInfo}/>
                </div>
            </div>
        )
    }
}

class TaskListReact extends React.Component {
    constructor(props) {
        super(props)
        this.app = this.props.app;
        this.login = this.props.login;
        this.tasksFromServer = this.props.tasksFromServer;
        this.tasksTree = new Map();
        this.tasks = [];

        for (let task of this.tasksFromServer) {
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

        this.state = {
            linearTasksList: this.makeLinearList(this.tasks),
        }
        this.linearTasksList = this.makeLinearList(this.tasks);
        this.addTask = this.addTask.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.textInputField = React.createRef();
    }

    // componentDidMount() {
    //     console.log('mount');
    // }
    //
    // componentWillUnmount() {
    //     console.log('unmount');
    // }

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
                if (answer.status === 200) {
                    let taskId = answer.data['task_id'];
                    let newTask = new Task(taskId, taskText);

                    this.tasksTree.set(newTask.id, newTask);
                    this.tasks.push(newTask);

                    this.setState({
                        linearTasksList: this.makeLinearList(this.tasks),
                    })
                } else if (answer.status === 401) {
                    this.login.forceLogOut();
                    showInfoWindow('Authorisation problem!');
                }
            }
            this.app.knockKnock('/save_task', add, sendData);
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
            if (answer.status === 200) {
                let taskId = answer.data['task_id'];
                let newTask = new Task(taskId, subtaskText, subtaskParentId);

                this.tasksTree.set(taskId, newTask);
                this.tasksTree.get(subtaskParentId).subtasks.push(newTask);

                this.setState({
                    linearTasksList : this.makeLinearList(this.tasks),
                })
            } else if (answer.status === 401) {
                this.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.app.knockKnock('/save_task', add, sendData);
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
            if (answer.status === 200) {
                if (this.tasksTree.has(task.parentId)) {
                    let childrenList = this.tasksTree.get(task.parentId).subtasks;
                    childrenList.splice(childrenList.indexOf(task), 1);
                } else {
                    this.tasks.splice(this.tasks.indexOf(task), 1);
                }
                this.setState({
                    linearTasksList: this.makeLinearList(this.tasks),
                })
            } else if (answer.status === 401) {
                this.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.app.knockKnock('/delete_task', remove, sendData);
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
                <div className="main_tasks"
                     id={'main_tasks'}>
                    {this.state.linearTasksList.map((task) => <TaskReact key={task.id.toString()}
                                                                         app={this.app}
                                                                         login={this.login}
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
        this.app = this.props.app;
        this.login = this.props.login;
        this.taskInst = this.props.taskInst;
        this.taskId = this.props.taskId;
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
        this.addSubtaskByEnterKey = this.addSubtaskByEnterKey.bind(this);
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
            if (answer.status === 200) {
                this.setState({
                    status: taskStatus
                });
            } else if (answer.status === 401) {
                this.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.app.knockKnock('/finish_task', finish, sendData);
    }

    removeTask() {
        this.props.removeTaskFunc(this.taskInst);
    }

    showSubtaskField() {
        if (this.state.subtaskDivShowed === false) {
            this.app.showShadowModal();
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
            this.app.hideShadowModal();
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

    addSubtaskByEnterKey(e) {
        if (e.keyCode === 13) {
            this.addSubtask();
        }
    }

    showEditTaskField() {
        if (this.state.taskTextEditDivShowed === false) {
            this.app.showShadowModal();
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
                    if (answer.status === 200) {
                        this.setState({
                            taskTextValue: this.editTaskField.current.value,
                        })
                    } else if (answer.status === 401) {
                        this.login.forceLogOut();
                        showInfoWindow('Authorisation problem!');
                    }
                }
                this.app.knockKnock('/save_edit_task', saveEdit, sendData);
            }
            this.app.hideShadowModal();
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
                           onKeyDown={this.addSubtaskByEnterKey}
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

class LoadingWindowReact extends React.Component {
    constructor() {
        super();
        this.isAlive = false;
        this.reqCount = 0;
        this.timerShow = null;
        this.timerHide = null;
        this.startTime = null;
        this.stopTime = null;
        this.state = {
            visibility: 'hidden',
        }
        this.showWindow = this.showWindow.bind(this);
        this.hideWindow = this.hideWindow.bind(this);
    }

    showWindow() {
        this.reqCount++;
        if (this.reqCount === 1) {
            this.timerHide = clearTimeout(this.timerHide);
            this.timerShow = setTimeout(() => {
                this.setState({
                    visibility: 'visible',
                })
                this.startTime = Date.now();
                this.isAlive = true;
            }, 200);
        }
    }

    hideWindow() {
        if (this.reqCount > 0) {
            this.reqCount--;
            this.stopTime = Date.now();
        }
        if (this.reqCount === 0) {
            this.timerShow = clearTimeout(this.timerShow);
            if (this.isAlive) {
                if (this.stopTime - this.startTime >= 200) {
                    this.setState({
                        visibility: 'hidden',
                    })
                    this.isAlive = false;
                } else {
                    this.timerHide = setTimeout(() => {
                        this.setState({
                            visibility: 'hidden',
                        })
                        this.isAlive = false;
                    }, 200 - (this.stopTime - this.startTime));
                }
            }
        }
    }
    render() {
        return(
            <div className={'loading_window'}
                 id={'loading_window'} style={
                     {
                         visibility: this.state.visibility,
                     }}>
                <p className={'loading_window_message'}
                   id={'loading_window_message'}>
                    ГРУЖУСЬ
                </p>
            </div>
        )
    }
}

// //TODO Maybe compile class LoadingWindow and knock_knock function together????
// class LoadingWindow {
//     constructor() {
//         this.isAlive = false;
//         this.reqCount = 0;
//         this.timerShow = undefined;
//         this.timerHide = undefined;
//         this.startTime = undefined;
//         this.stopTime = undefined;
//     }
//
//     showWindow(loadingWindow) {
//         this.reqCount++;
//         if (this.reqCount === 1) {
//             this.timerHide = clearTimeout(this.timerHide);
//             this.timerShow = setTimeout(() => {
//                 loadingWindow.style.visibility = 'visible';
//                 this.startTime = Date.now();
//                 this.isAlive = true;
//             }, 200);
//         }
//     }
//
//     hideWindow(loadingWindow) {
//         if (this.reqCount > 0) {
//             this.reqCount--;
//             this.stopTime = Date.now();
//         }
//         if (this.reqCount === 0) {
//             this.timerShow = clearTimeout(this.timerShow);
//             if (this.isAlive) {
//                 if (this.stopTime - this.startTime >= 200) {
//                     loadingWindow.style.visibility = 'hidden';
//                     this.isAlive = false;
//                 } else {
//                     this.timerHide = setTimeout(() => {
//                         loadingWindow.style.visibility = 'hidden';
//                         this.isAlive = false;
//                     }, 200 - (this.stopTime - this.startTime));
//                 }
//             }
//         }
//     }
// }

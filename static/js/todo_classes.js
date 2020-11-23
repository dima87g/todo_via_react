'use strict';

class Task {
    constructor(id, text, position, parentId = null, status = false) {
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.position = position;
        this.subtasks = [];
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.confirmWindowFunction = null;
        this.state = {
            shadowModalIsVisible: false,
            confirmWindowIsVisible: false,
            confirmWindowMessage: '',
        }
        this.authCheck = this.authCheck.bind(this);
        this.showConfirmWindow = this.showConfirmWindow.bind(this);
        this.confirmWindowClick = this.confirmWindowClick.bind(this);
        this.knockKnock = this.knockKnock.bind(this);
        this.login = React.createRef();
        this.loadingWindow = React.createRef();
    }

    componentDidMount() {
        registry.app = this;
        this.authCheck();
    }

    componentWillUnmount() {
        registry.app = null;
    }

    authCheck() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.login.current.createTaskList();
                this.login.current.hideLoginWindow();
            } else {
                showCookiesAlertWindow();
                this.setState({
                    shadowModalIsVisible: true,
                });
            }
        }
        this.knockKnock('/auth_check', responseHandler);
    }

    removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    showConfirmWindow(message, func) {
        this.showShadowModal();
        this.confirmWindowFunction = func;

        this.setState({
            confirmWindowIsVisible: true,
            confirmWindowMessage: message,
        });
    }

    confirmWindowClick(e) {
        if (e.target.value === 'ok') {
            this.hideShadowModal();
            this.confirmWindowFunction()
        } else {
            this.hideShadowModal();
        }
        this.confirmWindowFunction = null;
        this.setState({
            confirmWindowIsVisible: false,
        })
    }

    showShadowModal() {
        registry.headerMenu.setState({
            menuDisabled: true,
        });

        if (registry.taskInput) {
            registry.taskInput.setState({
                taskInputDisabled: true,
            });
        }

        this.setState({
            shadowModalIsVisible: true,
        });
    }

    hideShadowModal() {
        registry.headerMenu.setState({
            menuDisabled: false,
        });

        if (registry.taskInput) {
            registry.taskInput.setState({
                taskInputDisabled: false,
            });
        }

        this.setState({
            shadowModalIsVisible: false,
        })
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
        let shadowStyle;
        let confirmWindowStyle;

        if (this.state.shadowModalIsVisible) {
            shadowStyle = 'shadow_main shadow_visible';
        } else {
            shadowStyle = 'shadow_main shadow_hidden';
        }

        if (this.state.confirmWindowIsVisible) {
            confirmWindowStyle = 'confirm_window confirm_window_visible';
        } else {
            confirmWindowStyle = 'confirm_window confirm_window_hidden';
        }
        return (
            <div className={'app'} id={'app'}>
                <LoginReact app={this}
                            ref={this.login}/>
                <div id={"confirm_window"} className={confirmWindowStyle}>
                    <p id={"confirm_window_message"}
                       className={'confirm_window_message'}>
                        {this.state.confirmWindowMessage}
                    </p>
                    <button type={"button"}
                            className={"confirm_window_buttons"}
                            value={"ok"}
                            onClick={this.confirmWindowClick}>
                        OK
                    </button>
                    <button type={"button"}
                            className={"confirm_window_buttons"}
                            value={'cancel'}
                            onClick={this.confirmWindowClick}>
                        {localisation['confirm_window']['cancel_button']}
                    </button>
                </div>
                <div className="info_window" id="info_window">
                    <p className="info_window_message" id="info_window_message"/>
                </div>
                <LoadingWindowReact ref={this.loadingWindow}/>
                <div id={'shadow'}
                     className={shadowStyle}
                />
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
            menuShowed: false,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
            authMenuShowed: true,
            loginWindowShowed: true,
            loginWindowSwitchButtonDisabled: false,
            registerWindowShowed: false,
            registerWindowSwitchButtonDisabled: true,
            changePasswordWindowShowed: false,
            changePasswordWindowCancelButtonDisabled: true,
            changePasswordWindowSubmitButtonDisabled: true,
        }
        this.switchLogin = this.switchLogin.bind(this);
        this.hideLoginWindow = this.hideLoginWindow.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.login = this.login.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.changePasswordWindow = this.changePasswordWindow.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.userRegister = this.userRegister.bind(this);
        this.taskList = React.createRef();
        this.loginFormInfo = React.createRef();
        this.registerFormInfo = React.createRef();
        this.changePasswordFormInfo = React.createRef();
        this.userNameField = React.createRef();
    }

    switchLogin(e) {
        if (e.target.value === 'register') {
            this.setState({
                loginWindowShowed: false,
                loginWindowSwitchButtonDisabled: true,
                registerWindowShowed: true,
            });
            setTimeout(() => {
                this.setState({
                    registerWindowSwitchButtonDisabled: false,
                });
            }, 500);
            document.forms['login_form'].reset();
            this.app.removeChildren(this.loginFormInfo.current);
        } else {
            this.setState({
                loginWindowShowed: true,
                registerWindowShowed: false,
                registerWindowSwitchButtonDisabled: true,
            });
            setTimeout(() => {
                this.setState({
                    loginWindowSwitchButtonDisabled: false,
                });
            }, 500);
            document.forms['register_form'].reset();
            this.app.removeChildren(this.registerFormInfo.current);
        }
    }

    hideLoginWindow() {
        document.forms['login_form'].reset();
        document.forms['register_form'].reset();
        this.app.removeChildren(this.loginFormInfo.current);
        this.app.hideShadowModal();

        this.setState({
            authMenuShowed: false,
            loginWindowShowed: false,
            registerWindowShowed: false,
            userLogOutButtonDisabled: false,
            userDeleteButtonDisabled: false,
            changePasswordButtonDisabled: false,
        })
    }

    showLoginWindow() {
        this.app.removeChildren(this.userNameField.current);

        this.app.showShadowModal();

        this.setState({
            authMenuShowed: true,
            loginWindowShowed: true,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        })
    }

    login(e) {
        e.preventDefault();

        this.app.removeChildren(this.loginFormInfo.current);

        const userName = e.target['login_form_username'].value;
        const password = e.target['login_form_password'].value;

        if (userName && password) {
            const data = {'userName': userName, 'password': password}
            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    this.createTaskList();
                    this.hideLoginWindow();
                } else if (response.status === 401) {
                    this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['login_error_warning']));
                }
            }
            this.app.knockKnock('/user_login', responseHandler, data);
        } else if (!userName) {
            this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['no_user_name_warning']));
        } else if (!password) {
            this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['no_password_warning']));
        }
    }

    createTaskList() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let userName = response.data['user_name'];
                let tasksFromServer = response.data['tasks'];

                this.userNameField.current.appendChild(document.createTextNode('User: ' + userName));

                ReactDOM.render(
                    <TaskListReact ref={this.taskList}
                                   app={this.app}
                                   login={this}
                                   tasksFromServer={tasksFromServer}/>, document.getElementById('task_list'));
                ReactDOM.render(
                    <TaskInput taskList={this.taskList.current}/>, document.getElementById('input')
                );
            } else if (response.status === 401) {
                this.login.current.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.app.knockKnock('/load_tasks', responseHandler);
    }

    showMenu() {
        if (this.state.menuShowed) {
            this.setState({
                menuShowed: false,
                userLogOutButtonDisabled: true,
                userDeleteButtonDisabled: true,
                changePasswordButtonDisabled: true,
            });
        } else {
            this.setState({
                menuShowed: true,
                userLogOutButtonDisabled: false,
                userDeleteButtonDisabled: false,
                changePasswordButtonDisabled: false,
            });
        }
    }

    logOut() {
        const confirmFunction = () => {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';

        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
        ReactDOM.unmountComponentAtNode(document.getElementById('input'));

        this.showLoginWindow();
        }
        let userLanguage = getCookie('lang');
        let message;

        if (userLanguage === 'ru') {
            message = 'Вы уверены, что хотите выйти?';
        } else {
            message = 'Are you sure, you want to logOut?';
        }

        this.app.showConfirmWindow(message, confirmFunction);

    }

    forceLogOut() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';

        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
        ReactDOM.unmountComponentAtNode(document.getElementById('input'));

        this.showLoginWindow();
    }

    userDelete() {
        let userLanguage = getCookie('lang');
        let message;

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
        if (this.state.changePasswordWindowShowed === false) {
            this.showLoginWindow();

            this.setState({
                changePasswordWindowShowed: true,
                loginWindowShowed: false,
                registerWindowShowed: false,
                changePasswordWindowCancelButtonDisabled: false,
                changePasswordWindowSubmitButtonDisabled: false,
            })
        } else {
            this.hideLoginWindow();
            this.setState({
                changePasswordWindowShowed: false,
                changePasswordWindowCancelButtonDisabled: true,
                changePasswordWindowSubmitButtonDisabled: true,
            })
        }
    }
    /**
     * POST: json =  {"oldPassword": "string",  "newPassword": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */
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
                e.target.reset();
            } else {
                this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_match_passwords_warning']));
            }
        } else if (!oldPassword) {
            this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_old_password_warning']));
        }else if (!newPassword) {
            this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_new_password_warning']));
        }else if (!newPasswordConfirm) {
            this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_new_password_confirm_warning']));
        }
    }

    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */
    userRegister(e) {
        e.preventDefault();

        this.app.removeChildren(this.registerFormInfo.current);

        let userName = e.target['register_form_username'].value;
        let password = e.target['register_form_password'].value;
        let confirmPassword = e.target['register_form_password_confirm'].value;
        let agreementCheckbox = e.target['agreement_checkbox'];

        const handleResponse = (response) => {
            if (response.status === 200) {
                if (response.data['ok'] === true) {
                    this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['register_confirm_pref'] + ' ' + userName + ' ' + localisation['register_window']['register_confirm_suf']));
                } else if (response.data['error_code'] === 1062) {
                    this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['user_exists_warning']));
                }
            }
        }

        // if (userName && password && confirmPassword && agreementCheckbox.checked) {
        //     if (password === confirmPassword) {
        //         const sendData = {'newUserName': userName, 'password': password};
        //
        //         this.app.knockKnock('/user_register', handleResponse, sendData);
        //     }
        if (!userName) {
            this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_user_name_warning']));
        } else if (!password) {
            this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_password_warning']));
        } else if (!confirmPassword) {
            this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_confirm_password_warning']));
        } else if (password !== confirmPassword) {
            this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_match_passwords_warning']));
        } else if (!agreementCheckbox.checked) {
            this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_agreement_check_warning']));
        } else if (userName && password && confirmPassword && agreementCheckbox.checked) {
            if (password === confirmPassword) {
                const sendData = {'newUserName': userName, 'password': password};

                this.app.knockKnock('/user_register', handleResponse, sendData);
            }
        }
    }

    render() {
        let authMenuStyle;
        let loginWindowStyle;
        let registerWindowStyle;
        let changePasswordWindowStyle;
        let menuStyle;
        let menuButtonsStyle;

        if (this.state.authMenuShowed) {
            authMenuStyle = 'auth_menu auth_menu_visible';
        } else {
            authMenuStyle = 'auth_menu auth_menu_hidden';
        }

        if (this.state.loginWindowShowed) {
            loginWindowStyle = 'login_window login_window_visible';
        } else {
            loginWindowStyle = 'login_window login_window_hidden';
        }

        if (this.state.registerWindowShowed) {
            registerWindowStyle = 'register_window register_window_visible';
        } else {
            registerWindowStyle = 'register_window register_window_hidden';
        }

        if (this.state.changePasswordWindowShowed) {
            changePasswordWindowStyle = 'change_password_window change_password_window_visible';
        } else {
            changePasswordWindowStyle = 'change_password_window change_password_window_hidden'
        }

        return (
            <div className={'main'} id={'main'}>
                <div className={"header"} id={'header'}>
                    <div id={'header_login_section'} className={'header_login_section'}>
                        <p className="version">Ver. 2.0 React</p>
                        <a href={localisation['language_change']['link']} className={'language_switch_button'}>
                            <img src={'/static/icons/' + localisation['language_change']['label'] + '_flag.png'}/>
                        </a>
                        {/*<a href={"/en"} className={'language_switch_button'}>En</a>*/}
                        <p className={"user_name_field"}
                           id={'user_name_field'}
                           ref={this.userNameField}/>
                        <HeaderMenu login={this}/>
                    </div>
                    <div id={'input'} className={'input'}/>
                </div>
                <div id={'auth_menu'} className={authMenuStyle}>
                    <div id={'login_window'} className={loginWindowStyle}>
                        <p className="auth_menu_forms_labels">{localisation['login_window']['label']}</p>
                        <form name="login_form" onSubmit={this.login}>
                            <label htmlFor="login_form_username"
                                   className={"auth_menu_labels"}>{localisation['login_window']['user_name']}</label>
                            <input type="text" name="login_form_username"
                                   className={"login_form_username"}
                                   id={"login_form_username"}
                                   placeholder={localisation['login_window']['user_name_placeholder']}
                                   autoComplete={'off'}/>
                            <label htmlFor="login_form_password"
                                   className={"auth_menu_labels"}>{localisation['login_window']['password']}</label>
                            <input type="password" name="login_form_password"
                                   className={"login_form_password"}
                                   id={"login_form_password"}
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
                                disabled={this.state.loginWindowSwitchButtonDisabled}
                                onClick={this.switchLogin}>
                            {localisation['login_window']['switch_to_register_button']}
                        </button>
                    </div>
                    <div id={'register_window'} className={registerWindowStyle}>
                        <p className={"auth_menu_forms_labels"}>{localisation['register_window']['label']}</p>
                        <form name="register_form" onSubmit={this.userRegister}>
                            <label htmlFor="register_form_username"
                                   className={"auth_menu_labels"}>{localisation['register_window']['user_name']}</label>
                            <input type="text"
                                   name={"register_form_username"}
                                   id={"register_form_username"}
                                   className={"register_form_username"}
                                   placeholder={localisation['register_window']['user_name_placeholder']}
                                   autoComplete={'off'}/>
                            <label htmlFor={"register_form_password"}
                                   className={"auth_menu_labels"}>{localisation['register_window']['password']}</label>
                            <input type={"password"}
                                   name={"register_form_password"}
                                   id={"register_form_password"}
                                   className={"register_form_password"}
                                   placeholder={localisation['register_window']['password_placeholder']}/>
                            <label htmlFor={"register_form_password_confirm"}
                                   className={"auth_menu_labels"}>{localisation['register_window']['password_confirm']}</label>
                            <input type={"password"}
                                   name={"register_form_password_confirm"}
                                   id={"register_form_password_confirm"}
                                   className={"register_form_password_confirm"}
                                   placeholder={localisation['register_window']['password_confirm_placeholder']}/>
                            <p className={"agreement"} id={"agreement"}>
                                <input type={"checkbox"} id={"agreement_checkbox"} name={'agreement_checkbox'}/>
                                <label htmlFor="agreement_checkbox">&nbsp;{localisation['register_window']['agreement_label']}&nbsp;
                                    <a href="/static/agreements/agreement_ru.html"
                                       target="_blank">{localisation['register_window']['agreement_link']}</a></label></p>
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
                                className={"switch_to_login_button"}
                                id={"switch_to_login_button"}
                                value={'login'}
                                disabled={this.state.registerWindowSwitchButtonDisabled}
                                onClick={this.switchLogin}>
                            {localisation['register_window']['switch_to_login_button']}
                        </button>
                    </div>
                    <div id={"change_password_window"} className={changePasswordWindowStyle}>
                        <button type={"button"} id={"change_password_window_cancel_button"}
                                className={"change_password_window_cancel_button"}
                                disabled={this.state.changePasswordWindowCancelButtonDisabled}
                                onClick={this.changePasswordWindow}>X
                        </button>
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
                                    disabled={this.state.changePasswordWindowSubmitButtonDisabled}>
                                {localisation['change_password_window']['change_password_button']}
                            </button>
                        </form>
                        <p className={"change_password_window_info"}
                           id={"change_password_window_info"}
                           ref={this.changePasswordFormInfo}/>
                    </div>
                </div>
                {/*<div className={"header"} id={'header'}>*/}
                {/*    <div id={'header_login_section'} className={'header_login_section'}>*/}
                {/*        <p className="version">Ver. 2.0 React</p>*/}
                {/*        <a href={"/ru"} className={'language_switch_button'}>Русский</a>*/}
                {/*        <a href={"/en"} className={'language_switch_button'}>English</a>*/}
                {/*        <p className={"user_name_field"}*/}
                {/*           id={'user_name_field'}*/}
                {/*           ref={this.userNameField}/>*/}
                {/*        <HeaderMenu login={this}/>*/}
                {/*    </div>*/}
                {/*    <div id={'input'}/>*/}
                {/*</div>*/}
                <div className={'task_list'} id={'task_list'}/>
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

        this.tasksFromServer.sort(function (a, b) {
            if (a['task_position'] && b['task_position']) {
                return a['task_position'] - b['task_position'];
            }
            return 0;
        });

        for (let task of this.tasksFromServer) {
            let taskId = task['task_id'];
            let taskText = task['task_text'];
            let taskStatus = task['task_status'];
            let taskParentId = task['parent_id'];
            let taskPosition = task['task_position'];

            this.tasksTree.set(taskId, new Task(taskId, taskText, taskPosition, taskParentId, taskStatus));
        }

        for (let task of this.tasksTree.values()) {
            if (this.tasksTree.has(task.parentId)) {
                this.tasksTree.get(task.parentId).subtasks.push(task);
            } else {
                this.tasks.push(task);
            }
        }

        console.log(this.tasksTree);
        console.log(this.tasks);

        this.state = {
            // linearTasksList: this.makeLinearList(this.tasks),
            linearTasksList: this.tasks,
        }
        // this.linearTasksList = this.makeLinearList(this.tasks);
        this.addTask = this.addTask.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.removeTask = this.removeTask.bind(this);
    }

    componentDidMount() {
        registry.taskList = this;
    }

    componentWillUnmount() {
        registry.taskList = null;
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
    addTask(taskText) {
        let sendData = {'taskText': taskText, 'parentId': null}

        const responseHandler = (answer) => {
            if (answer.status === 200) {
                let taskId = answer.data['task_id'];
                let newTask = new Task(taskId, taskText);

                this.tasksTree.set(newTask.id, newTask);
                this.tasks.push(newTask);

                this.setState({
                    // linearTasksList: this.makeLinearList(this.tasks),
                    linearTasksList: this.tasks,
                })
            } else if (answer.status === 401) {
                this.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.app.knockKnock('/save_task', responseHandler, sendData);
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
                // if (this.tasksTree.has(task.parentId)) {
                //     let childrenList = this.tasksTree.get(task.parentId).subtasks;
                //     childrenList.splice(childrenList.indexOf(task), 1);
                // } else {
                //     this.tasks.splice(this.tasks.indexOf(task), 1);
                // }

                this.tasks.splice(findPosition(this.tasks, task.id), 1);
                this.tasksTree.delete(task.id);

                this.setState({
                    // linearTasksList: this.makeLinearList(this.tasks),
                    linearTasksList: this.tasks,
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
                {/*<div className="task_input">*/}
                {/*    <form onSubmit={this.addTask}>*/}
                {/*        <label htmlFor={'task_input_field'}/>*/}
                {/*            <input type={'text'}*/}
                {/*                   className={'task_input_field'}*/}
                {/*                   onSubmit={this.addTask}*/}
                {/*                   ref={this.textInputField}/>*/}
                {/*            <button type={'button'}*/}
                {/*                    className={'task_input_button'}*/}
                {/*                    onClick={this.addTask}>*/}
                {/*        <img src="/static/icons/add_sub.svg" alt="+"/>*/}
                {/*    </button>*/}
                {/*    </form>*/}
                {/*</div>*/}
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
                                                                         // removeTaskFunc={this.removeTask}
                                                                         // addSubtaskFunc={this.addSubtask}
                    />)}
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
            taskTextValue: this.props.taskText,
            taskTextShowed: true,
            subtaskDivShowed: false,
            addSubtaskDivShowed: false,
            removeTaskButtonShowed: true,
            removeTaskButtonDisabled: false,
            addSubtaskButtonShowed: false,
            addSubtaskButtonDisabled: true,
            editTaskDivShowed: false,
            saveEditButtonDisabled: true,
        }
        this.finishTask = this.finishTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.showEditTaskField = this.showEditTaskField.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.showSubtaskField = this.showSubtaskField.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.addSubtaskByEnterKey = this.addSubtaskByEnterKey.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
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
        registry.taskList.removeTask(this.taskInst);
    }

    showSubtaskField() {
        if (this.state.addSubtaskDivShowed === false) {
            this.app.showShadowModal();
            this.setState({
                taskTextShowed: false,
                addSubtaskDivShowed: true,
                addSubtaskButtonDisabled: false,
                removeTaskButtonShowed: false,
                removeTaskButtonDisabled: true,
            });
        } else {
            this.app.hideShadowModal();
            this.setState({
                taskTextShowed: true,
                addSubtaskDivShowed: false,
                addSubtaskButtonDisabled: true,
                removeTaskButtonShowed: true,
                removeTaskButtonDisabled: false,
            });
            this.addSubtaskField.current.value = '';
        }
    }

    addSubtask() {
        if (this.addSubtaskField.current.value) {
            let subtaskText = this.addSubtaskField.current.value;
            this.addSubtaskField.current.value = '';

            this.showSubtaskField();

            registry.taskList.addSubtask(this.taskId, subtaskText);

        }
    }

    addSubtaskByEnterKey(e) {
        if (e.keyCode === 13) {
            this.addSubtask();
        }
    }

    showEditTaskField() {
        if (this.state.editTaskDivShowed === false) {
            this.app.showShadowModal();
            this.setState({
                taskTextShowed: false,
                editTaskDivShowed: true,
                saveEditButtonDisabled: false,
                removeTaskButtonShowed: false,
                removeTaskButtonDisabled: true,
            });
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
                taskTextShowed: true,
                editTaskDivShowed: false,
                saveEditButtonDisabled: true,
                removeTaskButtonShowed: true,
                removeTaskButtonDisabled: false,
            });
        }
    }

    saveEdit(e) {
        if (e.keyCode === 13) {
            this.showEditTaskField();
        }
    }

    moveUp() {
        //TODO need to make one function for moving up/down!
        let taskList;

        if (!this.taskInst.parentId) {
            taskList = registry.taskList.state.linearTasksList;
        } else {
            taskList = registry.taskList.tasksTree.get(this.taskInst.parentId);
        }

        let currentTaskIndex = findPosition(taskList, this.taskInst.id);

        if (currentTaskIndex > 0) {
            let taskToSwapIndex = currentTaskIndex - 1;
            let currentTaskId = this.taskInst.id;
            let currentTaskPosition = this.taskInst.position;

            if (!currentTaskPosition) {
                currentTaskPosition = currentTaskId;
            }

            let taskToSwap = taskList[taskToSwapIndex];
            let taskToSwapId = taskToSwap.id;
            let taskToSwapPosition = taskToSwap.position;

            if (!taskToSwapPosition) {
                taskToSwapPosition = taskToSwapId;
            }

            let sendData =
                {
                    'currentTaskId': currentTaskId,
                    'currentTaskPosition': currentTaskPosition,
                    'taskToSwapId': taskToSwapId,
                    'taskToSwapPosition': taskToSwapPosition
                }

            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {

                    console.log('Moving up!');

                    this.taskInst.position = taskToSwapPosition;
                    taskToSwap.position = currentTaskPosition;

                    registry.taskList.setState({
                        linearTasksList : taskList.swap(currentTaskIndex, taskToSwapIndex),
                    });
                }
            }
            registry.app.knockKnock('/change_position', responseHandler, sendData);
        } else {
            console.log('I am the first already!');
        }
    }

    moveDown() {

        let taskList = registry.taskList.state.linearTasksList;
        let currentTaskIndex = findPosition(taskList, this.taskInst.id);

        if (currentTaskIndex < taskList.length - 1 && currentTaskIndex !== -1) {
            let taskToSwapIndex = currentTaskIndex + 1;
            let currentTaskId = this.taskInst.id;
            let currentTaskPosition = this.taskInst.position;

            if (!currentTaskPosition) {
                currentTaskPosition = currentTaskId;
            }

            let taskToSwap = taskList[taskToSwapIndex];
            let taskToSwapId = taskToSwap.id;
            let taskToSwapPosition = taskToSwap.position;

            if (!taskToSwapPosition) {
                taskToSwapPosition = taskToSwapId;
            }

            let sendData =
                {
                    'currentTaskId': currentTaskId,
                    'currentTaskPosition': currentTaskPosition,
                    'taskToSwapId': taskToSwapId,
                    'taskToSwapPosition': taskToSwapPosition
                }

            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    console.log('Moving down!');

                    this.taskInst.position = taskToSwapPosition;
                    taskToSwap.position = currentTaskPosition;

                    registry.taskList.setState({
                        linearTasksList: taskList.swap(currentTaskIndex, taskToSwapIndex),
                    });
                }
            }
            registry.app.knockKnock('/change_position', responseHandler, sendData);
        } else {
            console.log('I am the last already!');
        }
    }

    render() {
        let addSubtaskDivStyle;
        let showSubtaskDivButtonStyle;
        let addSubtaskTextFieldStyle;
        let addSubtaskButtonStyle;
        let taskTextStyle;
        let removeTaskButtonStyle;
        let editTaskDivStyle;
        let editTaskTextFieldStyle;
        let saveEditButtonStyle;

        if (this.state.addSubtaskDivShowed) {
            addSubtaskDivStyle = 'subtask_div';
            showSubtaskDivButtonStyle = 'show_subtask_div_button';
            addSubtaskTextFieldStyle = 'add_subtask_text_field';
            addSubtaskButtonStyle = 'add_subtask_button';
        } else {
            addSubtaskDivStyle = 'subtask_div subtask_div_hidden';
            showSubtaskDivButtonStyle = 'show_subtask_div_button show_subtask_div_button_hidden'
            addSubtaskTextFieldStyle = 'add_subtask_text_field add_subtask_text_field_hidden';
            addSubtaskButtonStyle = 'add_subtask_button add_subtask_button_hidden';
        }

        if (this.state.editTaskDivShowed) {
            editTaskDivStyle = 'edit_task_div';
            editTaskTextFieldStyle = 'edit_task_text_field';
            saveEditButtonStyle = 'save_edit_button';
        } else {
            editTaskDivStyle = 'edit_task_div edit_task_div_hidden';
            editTaskTextFieldStyle = 'edit_task_text_field edit_task_text_field_hidden';
            saveEditButtonStyle = 'save_edit_button save_edit_button_hidden';
        }

        if (this.state.taskTextShowed) {
            taskTextStyle = 'task_text';
        } else {
            taskTextStyle = 'task_text task_text_hidden';
        }

        if (this.state.removeTaskButtonShowed) {
            removeTaskButtonStyle = 'remove_task_button';
        } else  {
            removeTaskButtonStyle = 'remove_task_button remove_task_button_hidden';
        }

        return (
            <div className={'task'}>
                <button className={'task_moving_buttons'}
                        type={'button'}
                        onClick={this.moveUp}>
                    {/*&#129089;&#129089;&#129089;*/}
                    <i className="fas fa-angle-double-up"></i>
                    <i className="fas fa-angle-double-up"></i>
                    <i className="fas fa-angle-double-up"></i>
                    <i className="fas fa-angle-double-up"></i>
                    <i className="fas fa-angle-double-up"></i>
                    <i className="fas fa-angle-double-up"></i>
                </button>
                <div className={this.state.status === false ? 'task_div_content' : 'task_div_content finished_task'}>
                    <button className={'task_finish_button'}
                            type={'button'}
                            onClick={this.finishTask}>
                        <img src="/static/icons/check.svg" alt="V"/>
                    </button>
                    <button className={showSubtaskDivButtonStyle}
                            onClick={this.showSubtaskField}
                            disabled={true}>
                        +
                    </button>
                    <p className={taskTextStyle}
                       onClick={this.showEditTaskField}>{this.state.taskTextValue}</p>
                    <button className={removeTaskButtonStyle}
                            type={'button'}
                            onClick={this.removeTask}
                            disabled={this.state.removeTaskButtonDisabled}>
                        <img src="/static/icons/delete.svg" alt=""/>
                    </button>
                    <div className={addSubtaskDivStyle}>
                        <input className={addSubtaskTextFieldStyle}
                               type="text"
                               onKeyDown={this.addSubtaskByEnterKey}
                               ref={this.addSubtaskField}/>
                        <button className={addSubtaskButtonStyle}
                                type={'button'}
                                disabled={this.state.addSubtaskButtonDisabled}
                                onClick={this.addSubtask}>
                            <img src="/static/icons/add_sub.svg" alt="+"/>
                        </button>
                    </div>
                    <div className={editTaskDivStyle}>
                        <textarea className={editTaskTextFieldStyle}
                               type={'text'}
                               ref={this.editTaskField}
                               onKeyDown={this.saveEdit}
                        />
                        <button className={saveEditButtonStyle}
                                type={'button'}
                                onClick={this.showEditTaskField}
                                disabled={this.state.saveEditButtonDisabled}>
                            <img src='/static/icons/edit.svg' alt='+'/>
                        </button>
                    </div>
                </div>
                <button className={'task_moving_buttons'}
                        type={'button'}
                        onClick={this.moveDown}>
                    {/*&#129091;&#129091;&#129091;*/}
                    <i className="fas fa-angle-double-down"></i>
                    <i className="fas fa-angle-double-down"></i>
                    <i className="fas fa-angle-double-down"></i>
                    <i className="fas fa-angle-double-down"></i>
                    <i className="fas fa-angle-double-down"></i>
                    <i className="fas fa-angle-double-down"></i>
                </button>
            </div>
        )
    }
}

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props)
        this.login = this.props.login;
        this.state = {
            menuDisabled: true,
            menuShowed: false,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        }
        this.showHeaderMenu = this.showHeaderMenu.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    componentDidMount() {
        registry.headerMenu = this;
    }

    componentWillUnmount() {
        registry.headerMenu = null;
    }

    showHeaderMenu() {
        if (this.state.menuShowed) {
            this.setState({
                menuShowed: false,
                userLogOutButtonDisabled: true,
                userDeleteButtonDisabled: true,
                changePasswordButtonDisabled: true,
            });
        } else {
            this.setState({
                menuShowed: true,
                userLogOutButtonDisabled: false,
                userDeleteButtonDisabled: false,
                changePasswordButtonDisabled: false,
            });
        }
    }

    logOut() {
        this.setState({
            menuShowed: false,
        });
        this.login.logOut();
    }

    userDelete() {
        this.setState({
            menuShowed: false,
        });
        this.login.userDelete();
    }

    changePassword() {
        this.setState({
            menuShowed: false,
        });
        this.login.changePasswordWindow();
    }

    render() {
        let headerMenuListStyle;
        let headerMenuListButtonsStyle;
        let burgerButtonStyle;
        let menuButtonFunction;

        if (this.state.menuDisabled === false) {
            menuButtonFunction = this.showHeaderMenu;
        } else {
            menuButtonFunction = null;
        }

        if (this.state.menuShowed === false) {
            headerMenuListStyle = 'header_menu_list';
            headerMenuListButtonsStyle = 'header_menu_list_buttons';
            burgerButtonStyle = 'burger_button';
        } else {
            headerMenuListStyle = 'header_menu_list header_menu_list_visible';
            headerMenuListButtonsStyle = 'header_menu_list_buttons' +
                ' header_menu_list_buttons_visible';
            burgerButtonStyle = 'burger_button burger_button_clicked'
        }

        return(
            <div id={'header_menu'} className={'header_menu'}>
                <div id={'header_menu_list'} className={headerMenuListStyle}>
                    <input type="button"
                           className={headerMenuListButtonsStyle}
                           id='user_logout_button'
                           value={localisation['buttons']['logout']}
                           disabled={this.state.userLogOutButtonDisabled}
                           onClick={this.logOut}/>
                    <input type="button"
                           className={headerMenuListButtonsStyle}
                           id="change_password_button"
                           value={localisation['buttons']['change_password']}
                           disabled={this.state.changePasswordButtonDisabled}
                           onClick={this.changePassword}/>
                    <input type="button"
                           className={headerMenuListButtonsStyle}
                           id="user_delete_button"
                           value={localisation['buttons']['delete_user']}
                           disabled={this.state.userDeleteButtonDisabled}
                           onClick={this.userDelete}/>
                </div>
               <div id={'burger_button'}
                    className={burgerButtonStyle}
                    onClick={menuButtonFunction}>
                   <div id={'burger_button_stick'} className={'burger_button_stick'}/>
                   <div id={'burger_button_stick'} className={'burger_button_stick'}/>
                   <div id={'burger_button_stick'} className={'burger_button_stick'}/>
               </div>
            </div>
        )
    }
}

class TaskInput extends React.Component{
    constructor(props) {
        super(props);
        this.taskList = this.props.taskList;
        this.state = {
            taskInputDisabled: false,
        };

        this.addTask = this.addTask.bind(this);
    }

    componentDidMount() {
        registry.taskInput = this;
    }

    componentWillUnmount() {
        registry.taskInput = null;
    }

    addTask(e) {
        e.preventDefault();

        let taskText = e.target['task_input_field'].value;

        if (taskText) {
            this.taskList.addTask(taskText);
        }
        e.target.reset();
    }

    render() {
        let taskInputSubmitFunction;
        let taskInputFieldDisabled;
        let taskInputButtonDisabled;

        if (this.state.taskInputDisabled === true) {
            taskInputSubmitFunction = null;
            taskInputFieldDisabled = true;
            taskInputButtonDisabled = true;
        } else {
            taskInputSubmitFunction = this.addTask;
            taskInputFieldDisabled = false;
            taskInputButtonDisabled = false;
        }
        return(
            <div className="task_input">
                <form onSubmit={taskInputSubmitFunction}>
                    <label htmlFor={'task_input_field'}/>
                        <input type={'text'}
                               name={'task_input_field'}
                               className={'task_input_field'}
                               autoComplete={'off'}
                               disabled={taskInputFieldDisabled}
                        />
                        <button type={'submit'}
                                className={'task_input_button'}
                                disabled={taskInputButtonDisabled}
                        >
                            <img src="/static/icons/add_sub.svg" alt="+"/>
                        </button>
                </form>
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
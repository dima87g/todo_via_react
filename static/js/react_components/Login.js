import {registry} from "../main";
import {getCookie, showInfoWindow, isInternetExplorer} from "../todo_functions";
import {TaskList} from "./TaskList";
import React from "react";
import ReactDOM from "react-dom";
import {Header} from "./Header";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: null,
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
            listSelectMenu: [],
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
        this.listChange = this.listChange.bind(this);
        this.loginFormInfo = React.createRef();
        this.registerFormInfo = React.createRef();
        this.changePasswordFormInfo = React.createRef();
    }

    componentDidMount() {
        registry.login = this;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('UPDATE');
    }

    componentWillUnmount() {
        registry.login = null;
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
            registry.app.removeChildren(this.loginFormInfo.current);
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
            registry.app.removeChildren(this.registerFormInfo.current);
        }
    }

    hideLoginWindow() {
        document.forms['login_form'].reset();
        document.forms['register_form'].reset();
        registry.app.removeChildren(this.loginFormInfo.current);
        registry.app.hideShadowModal();

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
        registry.app.showShadowModal();

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

        registry.app.removeChildren(this.loginFormInfo.current);

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
            registry.app.knockKnock('/user_login', responseHandler, data);
        } else if (!userName) {
            this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['no_user_name_warning']));
        } else if (!password) {
            this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['no_password_warning']));
        }
    }

    createTaskList() {
        let sendData = {'listId': null}
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let userName = response.data['user_name'];
                let tasksFromServer = response.data['tasks'];
                let mainListId = response.data['list_id'];
                let listsDict = response.data['lists_dict'];

                this.setState({
                    userName: userName,
                });

                ReactDOM.render(
                    <TaskList
                        listId={mainListId}
                        listsDict={listsDict}
                        tasksFromServer={tasksFromServer}/>, document.getElementById('task_list')
                );

                this.setState({
                    listSelectMenu: Object.entries(listsDict),
                });

            } else if (response.status === 401) {
                this.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        registry.app.knockKnock('/load_tasks', responseHandler, sendData);
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

        this.setState({
            userName: null,
            listSelectMenu: [],
        });

        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
        // ReactDOM.unmountComponentAtNode(document.getElementById('input'));

        this.showLoginWindow();
        }
        let userLanguage = getCookie('lang');
        let message;

        if (userLanguage === 'ru') {
            message = 'Вы уверены, что хотите выйти?';
        } else {
            message = 'Are you sure, you want to logOut?';
        }

        registry.app.showConfirmWindow(message, confirmFunction);

    }

    forceLogOut() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';

        this.setState({
            userName: null,
            listSelectMenu: [],
        });

        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
        // ReactDOM.unmountComponentAtNode(document.getElementById('input'));

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
            registry.app.knockKnock('/user_delete', responseHandler);
        }

        registry.app.showConfirmWindow(message, confirmFunction);
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

        registry.app.removeChildren(this.changePasswordFormInfo.current);

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

                registry.app.knockKnock('change_password', responseHandler, sendData);
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

        registry.app.removeChildren(this.registerFormInfo.current);

        let userName = e.target['register_form_username'].value;
        let password = e.target['register_form_password'].value;
        let confirmPassword = e.target['register_form_password_confirm'].value;
        let agreementCheckbox = e.target['agreement_checkbox'];

        const responseHandler = (response) => {
            if (response.status === 200) {
                if (response.data['ok'] === true) {
                    this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['register_confirm_pref'] + ' ' + userName + ' ' + localisation['register_window']['register_confirm_suf']));
                } else if (response.data['error_code'] === 1062) {
                    this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['user_exists_warning']));
                }
            }
        }

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

                registry.app.knockKnock('/user_register', responseHandler, sendData);
            }
        }
    }

    listChange(e) {
        console.log('Changing list!');
        let selectedListId = e.target.value;
        let currentListId = registry.taskList.listId;

        if (selectedListId !== currentListId && selectedListId !== '0') {
            let sendData = {'listId': selectedListId};

            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    let tasksFromServer = response.data['tasks'];
                    let mainListId = response.data['list_id'];
                    let listsDict = response.data['lists_dict'];

                    ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));

                    ReactDOM.render(
                        <TaskList
                            listId={mainListId}
                            listsDict={listsDict}
                            tasksFromServer={tasksFromServer}/>, document.getElementById('task_list')
                    );

                    this.setState({
                        listSelectMenu: Object.entries(listsDict),
                    });

                }
            }
            registry.app.knockKnock('/load_tasks', responseHandler, sendData);
        } else if (selectedListId === '0') {
            this.createNewList();
        }
    }

    createNewList(e) {
        console.log('New list!');
        const sendData = null;

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                console.log('New list creating successfully!');
                this.setState({
                    listSelectMenu: this.state.listSelectMenu,
                })
                this.forceUpdate();
            }
        }
        registry.app.knockKnock('/create_list', responseHandler, sendData);
    }

    render() {
        let authMenuStyle;
        let loginWindowStyle;
        let registerWindowStyle;
        let changePasswordWindowStyle;

        if (this.state.authMenuShowed) {
            authMenuStyle = 'auth_menu auth_menu_visible';
        } else {
            authMenuStyle = 'auth_menu auth_menu_hidden';
        }

        if (this.state.loginWindowShowed) {
            if (isInternetExplorer()) {
                loginWindowStyle = 'login_window_ie login_window_visible';
            } else {
                loginWindowStyle = 'login_window login_window_visible';
            }
        } else {
            if (isInternetExplorer()) {
                loginWindowStyle = 'login_window_ie login_window_hidden';
            } else {
                loginWindowStyle = 'login_window login_window_hidden';
            }
        }

        if (this.state.registerWindowShowed) {
            if (isInternetExplorer()) {
                registerWindowStyle = 'register_window_ie' +
                    ' register_window_visible';
            } else {
                registerWindowStyle = 'register_window register_window_visible';
            }
        } else {
            if (isInternetExplorer()) {
                registerWindowStyle = 'register_window_ie' +
                    ' register_window_hidden';
            } else {
                registerWindowStyle = 'register_window register_window_hidden';
            }
        }

        if (this.state.changePasswordWindowShowed) {
            if (isInternetExplorer()) {
                changePasswordWindowStyle = 'change_password_window_ie' +
                    ' change_password_window_visible';
            } else {
                changePasswordWindowStyle = 'change_password_window' +
                    ' change_password_window_visible';
            }
        } else {
            if (isInternetExplorer()) {
                changePasswordWindowStyle = 'change_password_window_ie' +
                    ' change_password_window_hidden';
            } else {
                changePasswordWindowStyle = 'change_password_window' +
                    ' change_password_window_hidden';
            }
        }
        return (
            <div className={'main'} id={'main'}>
                <Header userName={this.state.userName}
                        listSelectMenu={this.state.listSelectMenu}
                />
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
                <div className={'task_list'} id={'task_list'}/>
            </div>
        )
    }
}
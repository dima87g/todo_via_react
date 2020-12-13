import {registry} from "../main";
import {getCookie, showInfoWindow} from "../todo_functions";
import {TaskList} from "./TaskList";
import {TaskInput} from "./TaskInput";
import {HeaderMenu} from "./HeaderMenu";

export class Login extends React.Component {
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
        this.userNameField = React.createRef();
    }

    componentDidMount() {
        registry.login = this;
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
        let sendData = {'listId': null}
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let userName = response.data['user_name'];
                let tasksFromServer = response.data['tasks'];
                let mainListId = response.data['list_id'];
                let listsDict = response.data['lists_dict'];

                this.userNameField.current.appendChild(document.createTextNode('User: ' + userName));

                // this.setState({
                //     listSelectMenu: Object.entries(listsDict),
                // });

                ReactDOM.render(
                    <TaskList app={this.app}
                              login={this}
                              listId={mainListId}
                              listsDict={listsDict}
                              tasksFromServer={tasksFromServer}/>, document.getElementById('task_list')
                );
                ReactDOM.render(
                    <TaskInput/>, document.getElementById('input')
                );

                this.setState({
                    listSelectMenu: Object.entries(listsDict),
                });

            } else if (response.status === 401) {
                this.login.current.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        this.app.knockKnock('/load_tasks', responseHandler, sendData);
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

    listChange(e) {
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
                        <TaskList app={this.app}
                                  login={this}
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
        }
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
                        {/*<p className="version">Ver. 2.0 React</p>*/}
                        <p className={"user_name_field"}
                           id={'user_name_field'}
                           ref={this.userNameField}
                        />
                        <a href={localisation['language_change']['link']} className={'language_switch_button'}>
                            <img
                                src={'/static/icons/' + localisation['language_change']['label'] + '_flag.png'}
                                alt={localisation['language_change']['label']}
                            />
                        </a>
                        {/*<a href={"/en"} className={'language_switch_button'}>En</a>*/}
                        {/*<p className={"user_name_field"}*/}
                        {/*   id={'user_name_field'}*/}
                        {/*   ref={this.userNameField}*/}
                        {/*/>*/}
                        <select
                            // TODO Need to make defaultValue in select tag instead selected in option tag
                            className={'list_select_menu'}
                            onChange={this.listChange}
                        >
                            {this.state.listSelectMenu.map((value, index) => {
                                let currentSelectedList;
                                // TODO object keys are always of string type !!!
                                //  Need to make the listsDict structure from the server
                                //  so that id is a numeric type without parseInt function!!!
                                // TODO when logout there still old list of user lists in menu, need to delete them
                                //  at the same time with logout
                                if (registry.taskList) {
                                    currentSelectedList = registry.taskList.listId === parseInt(value[0]);
                                }
                                return <option key={index} selected={currentSelectedList} value={value[0]}>{value[1]}</option>
                            })}
                            <option value={0}>...new list...</option>
                        </select>
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
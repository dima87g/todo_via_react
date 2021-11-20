import React from "react";
import {connect} from "react-redux";
import CreateNewListWindow from "./windows/CreateNewListWindow";
import ChangePasswordWindow from "./windows/ChangePasswordWindow";
import {
    hideCookiesAlertWindow,
    showConfirmWindow,
    showInfoWindow,
    showShadowModal,
} from "../redux/actions/actions";
import {
    userLogIn,
    showAuthMenu,
    hideAuthMenu,
    createList,
    userLogOut,
} from "../redux/actions/loginActions";
import {isInternetExplorer, removeChildren} from "../todo_functions";
import {moveFinishedToBottom, moveTaskToTopByUpButton} from "../redux/actions/settingsActions";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.state = {
            loginWindowShowed: true,
            loginWindowSwitchButtonDisabled: false,
            registerWindowShowed: false,
            registerWindowSwitchButtonDisabled: true,
            changePasswordWindowShowed: false,
            createNewListWindowShowed: false,
            settingsMenuWindowShowed: false,
        }
        this.authCheck = this.authCheck.bind(this);
        this.switchLogin = this.switchLogin.bind(this);
        this.hideLoginWindow = this.hideLoginWindow.bind(this);
        this.login = this.login.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.changePasswordWindow = this.changePasswordWindow.bind(this);
        this.userRegister = this.userRegister.bind(this);
        this.createNewListWindow = this.createNewListWindow.bind(this);
        //TODO maybe it will be better to use HTML forms selectors, instead of refs????
        this.loginFormInfo = React.createRef();
        this.registerFormInfo = React.createRef();
    }

    componentDidMount() {
        this.authCheck();
    }
    
    authCheck() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let userName = response.data['user_name'];
                this.props.dispatch(hideCookiesAlertWindow());
                this.props.dispatch(userLogIn(userName));
                this.getSettings();
                this.createTaskList();
                this.hideLoginWindow();
            }
        }
        this.app.knockKnock('/auth_check', responseHandler);
    }

    /**
     * POST
     *
     * RESPONSE: json = {
     *     ok: boolean,
     *     settings: list = [
     *         {
     *             'setting_id': number,
     *             'string_value': string,
     *             'int_value': number,
     *             'bool_value': boolean
     *         }
     *     ]
     * }
     */
    getSettings() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let settingsList = response.data['settings'];
                for (let setting of settingsList) {
                    let settingName = setting['setting_name'];
                    let stringValue = setting['string_value'];
                    let intValue = setting['int_value'];
                    let boolValue = setting['bool_value'];
                    switch (settingName) {
                        case 'Move to top by UP button':
                            this.props.dispatch(moveTaskToTopByUpButton(boolValue));
                            break;
                        case 'Move finished to bottom':
                            this.props.dispatch(moveFinishedToBottom(boolValue));
                            break;
                    }
                }
            }
        }
        this.app.knockKnock('/load_settings', responseHandler, null);
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
            removeChildren(this.loginFormInfo.current);
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
            removeChildren(this.registerFormInfo.current);
        }
    }

    hideLoginWindow() {
        document.forms['login_form'].reset();
        document.forms['register_form'].reset();
        removeChildren(this.loginFormInfo.current);

        this.props.dispatch(hideAuthMenu());
        this.setState({
            loginWindowShowed: false,
            registerWindowShowed: false,
        })
    }

    showLoginWindow() {
        this.props.dispatch(showShadowModal(true));
        this.props.dispatch(showAuthMenu());
        this.setState({
            loginWindowShowed: true,
            registerWindowShowed: false,
            registerWindowSwitchButtonDisabled: true,
            changePasswordWindowShowed: false,
            createNewListWindowShowed: false,
        })
    }

    login(e) {
        e.preventDefault();

        removeChildren(this.loginFormInfo.current);

        const userName = e.target['login_form_username'].value;
        const password = e.target['login_form_password'].value;

        if (userName && password) {
            const data = {'userName': userName, 'password': password}
            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    this.props.dispatch(hideCookiesAlertWindow());
                    this.props.dispatch(userLogIn(userName));
                    this.getSettings();
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

    logOut() {
        const confirmFunction = () => {
            document.cookie = 'id=; expires=-1';
            document.cookie = 'sign=; expires=-1';

            this.props.dispatch(userLogOut());

            this.showLoginWindow();
        }
        let message = localisation['confirm_window']['log_out_confirm_message'];

        this.props.dispatch(showConfirmWindow(true, message, confirmFunction));
    }

    forceLogOut() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'sign=; expires=-1';

        this.props.dispatch(userLogOut());

        this.showLoginWindow();
    }

    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */
    userRegister(e) {
        e.preventDefault();

        removeChildren(this.registerFormInfo.current);

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
                const sendData = {'userName': userName, 'password': password};

                this.app.knockKnock('/user_register', responseHandler, sendData);
            }
        }
    }

    userDelete() {
        let message = localisation['confirm_window']['delete_user_confirm_message'];

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.forceLogOut();
            }
        }

        const confirmFunction = () => {
            this.app.knockKnock('/user_delete', responseHandler);
        }
        this.props.dispatch(showConfirmWindow(true, message, confirmFunction));
    }

    changePasswordWindow() {
        if (this.state.changePasswordWindowShowed === false) {
            this.showLoginWindow();

            this.setState({
                changePasswordWindowShowed: true,
                loginWindowShowed: false,
                registerWindowShowed: false,
                createNewListWindowShowed: false,
                settingsMenuWindowShowed: false,
            })
        } else {
            document.forms["change_password_form"].reset();
            this.hideLoginWindow();
            this.setState({
                changePasswordWindowShowed: false,
            })
        }
    }

    /**
     * POST: json = {
     *     listId: number
     * }
     *
     * RESPONSE: json = {
     *     ok: boolean,
     *     user_name: string,
     *     list_id: number,
     *     lists_dict: Object,
     *     tasks: Array
     * }
     * @param listId {number || null}
     */
    loadList(listId = null) {
        const sendData = {
            'listId': listId
        }
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let tasksFromServer = response.data['tasks'];
                let currentListId = response.data['list_id'];
                let listsDict = response.data['lists_dict'];
                let listSelectMenu = Object.entries(listsDict);

                this.props.dispatch(createList(currentListId, listSelectMenu, tasksFromServer));
            }
        }
        this.app.knockKnock('/load_tasks', responseHandler, sendData);
    }

    createTaskList() {
        this.loadList();
    }

    listChange(e) {
        let selectedListId = e.target.value;

        if (selectedListId !== this.props.LIST_ID) {
            this.loadList(selectedListId);
        }
    }

    listRefresh() {
        let listId = this.props.LIST_ID;
        this.loadList(listId);
    }

    createNewListWindow() {
        if (this.state.createNewListWindowShowed === false) {
            this.props.dispatch(showShadowModal(true));
            this.props.dispatch(showAuthMenu());
            this.setState({
                createNewListWindowShowed: true,
                loginWindowShowed: false,
                registerWindowShowed: false,
                changePasswordWindowShowed: false,
            });
        } else {
            this.props.dispatch(showShadowModal(false));
            this.props.dispatch(hideAuthMenu());
            this.setState({
                createNewListWindowShowed: false,
            });
        }
    }

    deleteList(listToDeleteId, listToDeleteName) {
        if (listToDeleteName === 'main') {
            this.props.dispatch(showInfoWindow(true, localisation['delete_list']['cannot_delete_main_info']));
        } else {
            let sendData = {'listId': listToDeleteId, 'listName': listToDeleteName}
            let message = localisation['confirm_window']['delete_list_confirm_message'] + ' \'' + listToDeleteName + '\' ?'

            let responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    let tasksFromServer = response.data['tasks'];
                    let currentListId = response.data['list_id'];
                    let listsDict = response.data['lists_dict'];
                    let listSelectMenu = Object.entries(listsDict);

                    this.props.dispatch(createList(currentListId, listSelectMenu, tasksFromServer));
                } else if (response.status === 200 && response.data['del_result'] === 0) {
                    this.app.networkError = true;
                    this.props.dispatch(showInfoWindow(true, localisation['error_messages']['list_is_not_exists']));
                }
            }
            const confirmFunction = () => {
                this.app.knockKnock('/delete_list', responseHandler, sendData);
            }
            this.props.dispatch(showConfirmWindow(true, message, confirmFunction));
        }
    }

    render() {
        let authMenuStyle;
        let loginWindowStyle;
        let registerWindowStyle;

        if (this.props.AUTH_MENU_IS_VISIBLE) {
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

        return (
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
                    <p className={"info_field"}
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
                    <p className={"info_field"}
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
                <ChangePasswordWindow
                    app={this.app}
                    changePasswordWindowShowed={this.state.changePasswordWindowShowed}
                    changePasswordWindowFunction={this.changePasswordWindow}/>
                <CreateNewListWindow 
                    app={this.app}
                    createNewListWindowShowed={this.state.createNewListWindowShowed}
                    createNewListWindowFunction={this.createNewListWindow}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        USER_NAME: state.login.USER_NAME,
        LIST_ID: state.login.LIST_ID,
        AUTH_MENU_IS_VISIBLE: state.login.AUTH_MENU_IS_VISIBLE,
    }
}

export default connect(mapStateToProps, null, null, {forwardRef: true})(Login);
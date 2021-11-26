import React from "react";
import {connect} from "react-redux";
import {
    isInternetExplorer,
    removeChildren
} from "../../todo_functions";
import {hideCookiesAlertWindow} from "../../redux/actions/actions";
import {userLogIn} from "../../redux/actions/loginActions";

class LoginWindow extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.login = this.props.login;
        this.state = {
            login: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.focusField = React.createRef();
        this.infoField = React.createRef();
    }

    componentDidMount() {
        if (window.innerWidth > 480) {
            this.focusField.current.focus();
        }
    }

    clearForms() {
        this.setState({
            login: '',
            password: '',
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSwitch(e) {
        this.clearForms();

        removeChildren(this.infoField.current);

        this.props.loginWindowFunction(e);
    }

    /**
     * POST: json =  {
     *          userName: string,
     *          password: string,
     * }
     * GET: answer = json = {
     *                  ok: boolean,
     *                  error_code: number or null,
     *                  error_message: string or null
     *                  }
     */
    handleSubmit(e) {
        e.preventDefault();

        this.clearForms();

        removeChildren(this.infoField.current);

        const userName = e.target['login_form_username'].value;
        const password = e.target['login_form_password'].value;

        if (userName && password) {
            const data = {'userName': userName, 'password': password}
            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    this.props.dispatch(hideCookiesAlertWindow());
                    this.props.dispatch(userLogIn(userName));
                    this.login.getSettings();
                    this.login.createTaskList();
                    this.login.hideLoginWindow();
                } else if (response.status === 401) {
                    this.infoField.current.appendChild(document.createTextNode(localisation['login_window']['login_error_warning']));
                }
            }
            this.app.knockKnock('/user_login', responseHandler, data);
        } else if (!userName) {
            this.infoField.current.appendChild(document.createTextNode(localisation['login_window']['no_user_name_warning']));
        } else if (!password) {
            this.infoField.current.appendChild(document.createTextNode(localisation['login_window']['no_password_warning']));
        }
    }

    render() {
        let loginWindowStyle;

        if (isInternetExplorer()) {
            loginWindowStyle = 'login_window_ie';
        } else {
            loginWindowStyle = 'login_window';
        }

        return(
            <div className={'auth_menu_window_container'}>
                <div id={'login_window'} className={loginWindowStyle}>
                    <p className="auth_menu_forms_labels">{localisation['login_window']['label']}</p>
                    <form name="login_form" onSubmit={this.handleSubmit}>
                        <label htmlFor="login_form_username"
                               className={"auth_menu_labels"}>{localisation['login_window']['user_name']}</label>
                        <input type={"text"}
                               name={"login"}
                               className={"auth_menu_input_field"}
                               id={"login_form_username"}
                               placeholder={localisation['login_window']['user_name_placeholder']}
                               autoComplete={'off'}
                               value={this.state.login}
                               onChange={this.handleChange}
                               ref={this.focusField}/>
                        <label htmlFor="login_form_password"
                               className={"auth_menu_labels"}>{localisation['login_window']['password']}</label>
                        <input type={"password"}
                               name={"password"}
                               className={"auth_menu_input_field"}
                               id={"login_form_password"}
                               placeholder={localisation['login_window']['password_placeholder']}
                               value={this.state.password}
                               onChange={this.handleChange}/>
                        <button type={"submit"}
                                className={"login_form_button"}
                                id={"login_form_button"}>
                            {localisation['login_window']['submit_button']}
                        </button>
                    </form>
                    <p className={"info_field"}
                       ref={this.infoField}/>
                    <button type="button"
                            className={"switch_to_register_button"}
                            id={"switch_to_register_button"}
                            value={'register'}
                            onClick={this.handleSwitch}>
                        {localisation['login_window']['switch_to_register_button']}
                    </button>
                </div>
            </div>
        )
    }
}

export default connect()(LoginWindow);
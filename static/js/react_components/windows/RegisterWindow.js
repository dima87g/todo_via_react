import React from "react";
import {connect} from "react-redux";
import {isInternetExplorer, removeChildren} from "../../todo_functions";

class RegisterWindow extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.state = {
            login: '',
            password: '',
            passwordConfirm: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.focusField = React.createRef();
        this.agreementCheckbox = React.createRef();
        this.infoField = React.createRef();
    }

    componentDidMount() {
        if (window.innerWidth > 480) {
            this.focusField.current.focus();
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSwitch(e) {
        this.setState({
            login: '',
            password: '',
            passwordConfirm: '',
        });

        removeChildren(this.infoField.current);

        this.props.registerWindowFunction(e);
    }

    /**
     * POST: json =  {
     *          newUserName: string,
     *          password: string,
     *          confirmPassword: string
     * }
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */
   handleSubmit(e) {
        e.preventDefault();

        removeChildren(this.infoField.current);

        let userName = this.state.login;
        let password = this.state.password;
        let confirmPassword = this.state.passwordConfirm;
        let agreementCheckboxChecked = this.agreementCheckbox.current.checked;

        const responseHandler = (response) => {
            if (response.status === 200) {
                if (response.data['ok'] === true) {
                    this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['register_confirm_pref'] + ' ' + userName + ' ' + localisation['register_window']['register_confirm_suf']));
                } else if (response.data['error_code'] === 1062) {
                    this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['user_exists_warning']));
                }
            }
        }

        if (!userName) {
            this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['no_user_name_warning']));
        } else if (!password) {
            this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['no_password_warning']));
        } else if (!confirmPassword) {
            this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['no_confirm_password_warning']));
        } else if (password !== confirmPassword) {
            this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['no_match_passwords_warning']));
        } else if (!agreementCheckboxChecked) {
            this.infoField.current.appendChild(document.createTextNode(localisation['register_window']['no_agreement_check_warning']));
        } else if (userName && password && confirmPassword && agreementCheckboxChecked) {
            if (password === confirmPassword) {
                const sendData = {'userName': userName, 'password': password};

                this.app.knockKnock('/user_register', responseHandler, sendData);
            }
        }
    }

    render() {
        let registerWindowStyle;

        if (isInternetExplorer()) {
            registerWindowStyle = 'register_window_ie';
        } else {
            registerWindowStyle = 'register_window';
        }

        return(
            <div className={'auth_menu_window_container'}>
                <div id={'register_window'} className={registerWindowStyle}>
                    <p className={"auth_menu_forms_labels"}>{localisation['register_window']['label']}</p>
                    <form name="register_form" onSubmit={this.handleSubmit}>
                        <label htmlFor="register_form_username"
                               className={"auth_menu_labels"}>{localisation['register_window']['user_name']}</label>
                        <input type="text"
                               name={"login"}
                               id={"register_form_username"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation['register_window']['user_name_placeholder']}
                               autoComplete={'off'}
                               value={this.state.login}
                               onChange={this.handleChange}
                               ref={this.focusField}/>
                        <label htmlFor={"register_form_password"}
                               className={"auth_menu_labels"}>{localisation['register_window']['password']}</label>
                        <input type={"password"}
                               name={"password"}
                               id={"register_form_password"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation['register_window']['password_placeholder']}
                               value={this.state.password}
                               onChange={this.handleChange}/>
                        <label htmlFor={"register_form_password_confirm"}
                               className={"auth_menu_labels"}>{localisation['register_window']['password_confirm']}</label>
                        <input type={"password"}
                               name={"passwordConfirm"}
                               id={"register_form_password_confirm"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation['register_window']['password_confirm_placeholder']}
                               value={this.state.passwordConfirm}
                               onChange={this.handleChange}/>
                        <p className={"agreement"} id={"agreement"}>
                            <input type={"checkbox"}
                                   id={"agreement_checkbox"}
                                   name={'agreement_checkbox'}
                                   ref={this.agreementCheckbox}/>
                            <label
                                htmlFor="agreement_checkbox">&nbsp;{localisation['register_window']['agreement_label']}&nbsp;
                                <a href="/static/agreements/agreement_ru.html"
                                   target="_blank">{localisation['register_window']['agreement_link']}</a></label></p>
                        <button type={"submit"}
                                id={"register_form_button"}
                                className={"register_form_button"}>
                            {localisation['register_window']['create_button']}
                        </button>
                    </form>
                    <p className={"info_field"}
                       ref={this.infoField}/>
                    <button type={"button"}
                            className={"switch_to_login_button"}
                            id={"switch_to_login_button"}
                            value={'login'}
                            onClick={this.handleSwitch}>
                        {localisation['register_window']['switch_to_login_button']}
                    </button>
                </div>
            </div>
        )
    }
}

export default connect()(RegisterWindow);
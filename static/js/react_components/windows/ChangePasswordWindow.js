import React from "react";
import {connect} from "react-redux";
import {
    isInternetExplorer,
    removeChildren
} from "../../todo_functions";
import {showInfoWindow} from "../../redux/actions/actions";

class ChangePasswordWindow extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.state = {
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.focusField = React.createRef();
        this.infoField = React.createRef();
    }

    componentDidMount() {
        if (window.innerWidth > 480) {
            this.focusField.current.focus();
        }
    }

    handleCancel() {
        this.setState({
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        });

        removeChildren(this.infoField.current);

        this.props.changePasswordWindowFunction();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    /**
     * POST: json =  {"oldPassword": "string",  "newPassword": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */
    handleSubmit(e) {
        e.preventDefault();

        removeChildren(this.infoField.current);

        let oldPassword = this.state.oldPassword;
        let newPassword = this.state.newPassword;
        let newPasswordConfirm = this.state.newPasswordConfirm;

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.props.dispatch(showInfoWindow(true, localisation['change_password_window']['success']));

                this.setState({
                    oldPassword: '',
                    newPassword: '',
                    newPasswordConfirm: '',
                });

                this.props.changePasswordWindowFunction();

            } else if (response.status === 200 && response.data['ok'] === false) {
                this.infoField.current.appendChild(document.createTextNode(localisation['change_password_window']['incorrect_password']));
            }
        }

        if (oldPassword && newPassword && newPasswordConfirm) {
            if (newPassword === newPasswordConfirm) {
                const sendData = {'oldPassword': oldPassword, 'newPassword': newPassword};

                this.app.knockKnock('change_password', responseHandler, sendData);
            } else {
                this.infoField.current.appendChild(document.createTextNode(localisation['change_password_window']['no_match_passwords_warning']));
            }
        } else if (!oldPassword) {
            this.infoField.current.appendChild(document.createTextNode(localisation['change_password_window']['no_old_password_warning']));
        }else if (!newPassword) {
            this.infoField.current.appendChild(document.createTextNode(localisation['change_password_window']['no_new_password_warning']));
        }else if (!newPasswordConfirm) {
            this.infoField.current.appendChild(document.createTextNode(localisation['change_password_window']['no_new_password_confirm_warning']));
        }
    }

    render() {
        let changePasswordWindowStyle;

        if (isInternetExplorer()) {
            changePasswordWindowStyle = 'change_password_window_ie';
        } else {
            changePasswordWindowStyle = 'change_password_window';
        }

        return(
            <div className={'auth_menu_window_container'}>
                <div id={"change_password_window"} className={changePasswordWindowStyle}>
                    <button type={"button"}
                            id={"change_password_window_cancel_button"}
                            className={"exit_button"}
                            onClick={this.handleCancel}>
                        <img src="/static/icons/close_button.svg" alt="X"/>
                    </button>
                    <p className={"auth_menu_forms_labels"}>{localisation['change_password_window']['label']}</p>
                    <form name={"change_password_form"} onSubmit={this.handleSubmit}>
                        <label htmlFor={"oldPassword"}
                               className={"auth_menu_labels"}>{localisation['change_password_window']['old_password']}</label>
                        <input type={"password"}
                               name={"oldPassword"}
                               id={"change_password_form_old_password"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation['change_password_window']['old_password_placeholder']}
                               value={this.state.oldPassword}
                               onChange={this.handleChange}
                               ref={this.focusField}/>
                        <label htmlFor={"newPassword"}
                               className={"auth_menu_labels"}>{localisation['change_password_window']['new_password']}</label>
                        <input type={"password"}
                               name={"newPassword"}
                               id={"change_password_form_new_password"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation['change_password_window']['new_password_placeholder']}
                               value={this.state.newPassword}
                               onChange={this.handleChange}/>
                        <label htmlFor={"newPasswordConfirm"}
                               className={"auth_menu_labels"}>{localisation['change_password_window']['new_password_confirm']}</label>
                        <input type={"password"}
                               name={"newPasswordConfirm"}
                               id={"change_password_form_new_password_confirm"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation['change_password_window']['new_password_confirm_placeholder']}
                               value={this.state.newPasswordConfirm}
                               onChange={this.handleChange}/>
                        <button type={"submit"}
                                value={"Change password"}
                                id={"change_password_form_submit_button"}
                                className={"change_password_form_submit_button"}>
                            {localisation['change_password_window']['change_password_button']}
                        </button>
                    </form>
                    <p className={"info_field"}
                       ref={this.infoField}/>
                </div>
            </div>
        )
    }
}

export default connect()(ChangePasswordWindow)
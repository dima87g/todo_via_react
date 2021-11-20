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
        this.inputField = React.createRef();
        this.changePasswordFormInfo = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!prevProps.changePasswordWindowShowed && this.props.changePasswordWindowShowed) {
            this.inputField.current.focus();
        }
    }

    handleCancel() {
        this.setState({
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        });

        removeChildren(this.changePasswordFormInfo.current);

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

        removeChildren(this.changePasswordFormInfo.current);

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
                this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['incorrect_password']));
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

    render() {
        let changePasswordWindowCancelButtonDisabled;
        let changePasswordWindowSubmitButtonDisabled;
        let changePasswordWindowStyle;

        if (this.props.changePasswordWindowShowed) {
            changePasswordWindowCancelButtonDisabled = false;
            changePasswordWindowSubmitButtonDisabled = false;

            if (isInternetExplorer()) {
                changePasswordWindowStyle = 'change_password_window_ie' +
                    ' change_password_window_visible';
            } else {
                changePasswordWindowStyle = 'change_password_window' +
                    ' change_password_window_visible';
            }
        } else {
            changePasswordWindowCancelButtonDisabled = true;
            changePasswordWindowSubmitButtonDisabled = true;

            if (isInternetExplorer()) {
                changePasswordWindowStyle = 'change_password_window_ie' +
                    ' change_password_window_hidden';
            } else {
                changePasswordWindowStyle = 'change_password_window' +
                    ' change_password_window_hidden';
            }
        }
        return(
            <div id={"change_password_window"} className={changePasswordWindowStyle}>
                <button type={"button"}
                        id={"change_password_window_cancel_button"}
                        className={"change_password_window_cancel_button"}
                        disabled={changePasswordWindowCancelButtonDisabled}
                        onClick={this.handleCancel}>X
                </button>
                <p className={"auth_menu_forms_labels"}>{localisation['change_password_window']['label']}</p>
                <form name={"change_password_form"} onSubmit={this.handleSubmit}>
                    <label htmlFor={"oldPassword"}
                           className={"auth_menu_labels"}>{localisation['change_password_window']['old_password']}</label>
                    <input type={"password"}
                           name={"oldPassword"}
                           id={"change_password_form_old_password"}
                           className={"change_password_form_old_password"}
                           placeholder={localisation['change_password_window']['old_password_placeholder']}
                           value={this.state.oldPassword}
                           onChange={this.handleChange}
                           ref={this.inputField}/>
                    <label htmlFor={"newPassword"}
                           className={"auth_menu_labels"}>{localisation['change_password_window']['new_password']}</label>
                    <input type={"password"}
                           name={"newPassword"}
                           id={"change_password_form_new_password"}
                           className={"change_password_form_new_password"}
                           placeholder={localisation['change_password_window']['new_password_placeholder']}
                           value={this.state.newPassword}
                           onChange={this.handleChange}/>
                    <label htmlFor={"newPasswordConfirm"}
                           className={"auth_menu_labels"}>{localisation['change_password_window']['new_password_confirm']}</label>
                    <input type={"password"}
                           name={"newPasswordConfirm"}
                           id={"change_password_form_new_password_confirm"}
                           className={"change_password_form_new_password_confirm"}
                           placeholder={localisation['change_password_window']['new_password_confirm_placeholder']}
                           value={this.state.newPasswordConfirm}
                           onChange={this.handleChange}/>
                    <button type={"submit"}
                            value={"Change password"}
                            id={"change_password_form_submit_button"}
                            className={"change_password_form_submit_button"}
                            disabled={changePasswordWindowSubmitButtonDisabled}>
                        {localisation['change_password_window']['change_password_button']}
                    </button>
                </form>
                <p className={"info_field"}
                   ref={this.changePasswordFormInfo}/>
            </div>
        )
    }
}

export default connect()(ChangePasswordWindow)
import React from "react";
import {connect} from "react-redux";
import {hideHeaderMenu, hideSettingsMenu} from "../../redux/actions";


class SettingsMenuWindow extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.props.login;
        this.closeSettingsMenu = this.closeSettingsMenu.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
    }

    closeSettingsMenu() {
        this.props.dispatch(hideSettingsMenu());
    }

    changePassword() {
        this.props.dispatch(hideSettingsMenu());
        this.login.current.changePasswordWindow();
    }

    logOut() {
        this.props.dispatch(hideSettingsMenu());
        this.login.current.logOut();
    }

    userDelete() {
        this.props.dispatch(hideHeaderMenu());
        this.login.current.userDelete();
    }

    render() {
        let settingsMenuWindowStyle;

        if (this.props.SETTINGS_MENU_IS_VISIBLE) {
            settingsMenuWindowStyle = 'settings_window';
        } else {
            settingsMenuWindowStyle = 'settings_window settings_window_hidden';
        }
        return (
            <div className={settingsMenuWindowStyle}>
                <div className={'settings_window_header'}>
                    <button className={'exit_button'} type={'button'} onClick={this.closeSettingsMenu}>X</button>
                    <p className={'settings_window_title'}>{localisation['settings_window']['title']}</p>
                </div>
                <div className={'settings_window_buttons_div'}>
                    <label className={'settings_window_checkbox_label'}>
                        <input type={'checkbox'} className={'settings_window_checkbox'}/>
                        {localisation['settings_window']['to_bottom_checkbox']}
                    </label>
                    <input
                        type={'button'}
                        className={'settings_window_buttons'}
                        value={localisation['buttons']['change_password']}
                        onClick={this.changePassword}
                    />
                    <input
                        type={'button'}
                        className={'settings_window_buttons'}
                        value={localisation['buttons']['logout']}
                        onClick={this.logOut}
                    />
                    <input
                        type={'button'}
                        className={'settings_window_buttons'}
                        onClick={this.userDelete}
                        value={localisation['buttons']['delete_user']}
                    />
                </div>
                <div className={'settings_window_footer'}>
                    <p className={'copyright'}>
                        ToDoList ver. 2.0.5 &copy; Dmitriy Ostreykovskiy 2020-2021
                    </p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SETTINGS_MENU_IS_VISIBLE: state.app.SETTINGS_MENU_IS_VISIBLE,
    }
}

export default connect(mapStateToProps)(SettingsMenuWindow);
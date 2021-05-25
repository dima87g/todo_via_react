import React from "react";
import {connect} from "react-redux";
import {hideSettingsMenu} from "../../redux/actions";
import {
    moveFinishedToBottom,
    moveTaskToTopByUpButton
} from "../../redux/settingsActions"


class SettingsMenuWindow extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.login = this.props.login;
        this.closeSettingsMenu = this.closeSettingsMenu.bind(this);
        this.moveToTopCheckbox = this.moveToTopCheckbox.bind(this);
        this.moveFinishedToBottomCheckbox = this.moveFinishedToBottomCheckbox.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
    }

    closeSettingsMenu() {
        this.props.dispatch(hideSettingsMenu());
    }

    /**
     * POST: json = {
     *     settingName: 'string',
     *     stringVal: null,
     *     intVal: null,
     *     boolVal: 'boolean'
     * }
     *
     * RESPONSE: json = {
     *     ok: 'boolean'
     * }
     * @param e {Event} checkbox click event
     */
    moveToTopCheckbox(e) {
        let boxIsChecked = e.target.checked;
        const sendData = {
            'settingName': 'Move to top by up button',
            'stringVal': null,
            'intVal': null,
            'boolVal': boxIsChecked
        }
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.props.dispatch(moveTaskToTopByUpButton(boxIsChecked));
            }
        }
        this.app.knockKnock('/change_setting', responseHandler, sendData);
    }

    /**
     * POST: json = {
     *     settingName: 'string',
     *     stringVal: null,
     *     intVal: null,
     *     boolVal: 'boolean'
     * }
     *
     * RESPONSE: json = {
     *     ok: 'boolean'
     * }
     * @param e {Event} checkbox click event
     */
    moveFinishedToBottomCheckbox(e) {
        let boxIsChecked = e.target.checked;
        const sendData = {
            'settingName': 'Move finished to bottom',
            'stringVal': null,
            'intVal': null,
            'boolVal': boxIsChecked
        }
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.props.dispatch(moveFinishedToBottom(boxIsChecked));
            }
        }
        this.app.knockKnock('/change_setting', responseHandler, sendData);
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
        this.props.dispatch(hideSettingsMenu());
        this.login.current.userDelete();
    }

    render() {
        let settingsMenuWindowStyle;
        let moveTaskToTopCheckboxChecked;
        let moveFinishedToBottomCheckboxChecked;

        if (this.props.SETTINGS_MENU_IS_VISIBLE) {
            settingsMenuWindowStyle = 'settings_window';
        } else {
            settingsMenuWindowStyle = 'settings_window settings_window_hidden';
        }
        moveTaskToTopCheckboxChecked = !!this.props.MOVE_TASK_TO_TOP_BY_UP_BUTTON;
        moveFinishedToBottomCheckboxChecked = !!this.props.MOVE_FINISHED_TASKS_TO_BOTTOM;
        return (
            <div className={settingsMenuWindowStyle}>
                <div className={'settings_window_header'}>
                    <button className={'exit_button'} type={'button'} onClick={this.closeSettingsMenu}>X</button>
                    <p className={'settings_window_title'}>{localisation['settings_window']['title']}</p>
                </div>
                <div className={'settings_window_buttons_div'}>
                    <label className={'settings_window_checkbox_label'}>
                        <input type={'checkbox'}
                               className={'settings_window_checkbox'}
                               checked={moveFinishedToBottomCheckboxChecked}
                               onChange={this.moveFinishedToBottomCheckbox}
                        />
                        {localisation['settings_window']['to_bottom_checkbox']}
                    </label>
                    <label className={'settings_window_checkbox_label'}>
                        <input type={'checkbox'}
                               className={'settings_window_checkbox'}
                               checked={moveTaskToTopCheckboxChecked}
                               onChange={this.moveToTopCheckbox}/>
                        {localisation['settings_window']['task_to_top_by_up_button']}
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
                        ToDoList ver. 2.0.5 &copy; Dmitriy Ostreykovsky 2020-2021
                    </p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SETTINGS_MENU_IS_VISIBLE: state.app.SETTINGS_MENU_IS_VISIBLE,
        MOVE_TASK_TO_TOP_BY_UP_BUTTON: state.settings.MOVE_TASK_TO_TOP_BY_UP_BUTTON,
        MOVE_FINISHED_TASKS_TO_BOTTOM: state.settings.MOVE_FINISHED_TASKS_TO_BOTTOM,
    }
}

export default connect(mapStateToProps)(SettingsMenuWindow);

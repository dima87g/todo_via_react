import React from "react";
import {connect} from "react-redux";
import {isInternetExplorer} from "../../todo_functions";


class SettingsMenuWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let settingsMenuWindowStyle;

        if (this.props.SETTINGS_MENU_IS_VISIBLE) {

        }
        return (
            <div className={'settings_window'}>
                <div className={'settings_window_header'}>
                    <button className={'exit_button'} type={'button'}>X</button>
                    <p className={'settings_window_title'}>Settings</p>
                </div>
                <div className={'settings_window_buttons_div'}>
                    <label className={'settings_window_checkbox_label'}>
                        <input type={'checkbox'} className={'settings_window_checkbox'} onClick={checkbox}/>
                        Move checked tasks to bottom
                    </label>
                    <button type={'button'} className={'settings_window_buttons'}>button1</button>
                    <button type={'button'} className={'settings_window_buttons'}>button2</button>
                    <button type={'button'} className={'settings_window_buttons'}>button3</button>
                </div>
                <div className={'settings_window_footer'}>
                    <p className={'copyright'}>copyright</p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SETTINGS_MENU_IS_VISIBLE: state.login.SETTINGS_MENU_IS_VISIBLE,
    }
}

export default connect(mapStateToProps)(SettingsMenuWindow);
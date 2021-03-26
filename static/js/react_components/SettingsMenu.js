import React from "react";
import {connect} from "react-redux";
import {isInternetExplorer} from "../todo_functions";


class SettingsMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let settingsMenuWindowStyle;

        if (this.props.SETTINGS_MENU_IS_VISIBLE) {
            if (isInternetExplorer()) {
                settingsMenuWindowStyle = 'settings_menu_window_ie settings_menu_window_visible';
            } else {
                settingsMenuWindowStyle = 'settings_menu_window settings_menu_window_visible';
            }
        } else {
            if (isInternetExplorer()) {
                settingsMenuWindowStyle = 'settings_menu_window_ie settings_menu_window_hidden';
            } else {
                settingsMenuWindowStyle = 'settings_menu_window settings_menu_window_hidden'
            }
        }
        return (
            <div className={settingsMenuWindowStyle}>
                <button type={'button'} className={'settings_menu_window_close_button'}>
                    X
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SETTINGS_MENU_IS_VISIBLE: state.login.SETTINGS_MENU_IS_VISIBLE,
    }
}

export default connect(mapStateToProps)(SettingsMenu);
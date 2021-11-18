import React from "react";
import {connect} from "react-redux";
import {hideCookiesAlertWindow} from "../../redux/actions/actions";

class CookiesWindow extends React.Component {
    constructor(props) {
        super(props);
        this.closeCookiesWindow = this.closeCookiesWindow.bind(this);
    }

    closeCookiesWindow() {
        this.props.dispatch(hideCookiesAlertWindow());
    }

    render() {
        let cookiesAlertWindowStyle;

        if (this.props.COOKIES_WINDOW_IS_VISIBLE === true) {
            cookiesAlertWindowStyle = 'cookies_alert_window';
        } else {
            cookiesAlertWindowStyle = 'cookies_alert_window cookies_alert_window_hidden';
        }

        return (
            <div id={'cookies_alert_window'} className={cookiesAlertWindowStyle}>
                <p id={'cookies_alert_window_text'} className={'cookies_alert_window_text'}>
                    {localisation['cookie_window']['cookie_message']}
                </p>
                <button
                    id={'cookies_alert_confirm_button'}
                    className={'cookies_alert_confirm_button'}
                    type={'button'}
                    onClick={this.closeCookiesWindow}>
                    OK
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        COOKIES_WINDOW_IS_VISIBLE: state.app.COOKIES_WINDOW_IS_VISIBLE,
    }
}

export default connect(mapStateToProps)(CookiesWindow);
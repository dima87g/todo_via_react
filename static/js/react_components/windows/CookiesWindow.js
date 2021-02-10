import React from "react";
import {connect} from "react-redux";
import {showCookiesAlertWindow} from "../../redux/actions";
import {store} from "../../redux/store";

class CookiesWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    closeCookiesWindow() {
        store.dispatch(showCookiesAlertWindow('hiding'));
        setTimeout(() => {
            store.dispatch(showCookiesAlertWindow(false));
        }, 500);
    }

    render() {
        let cookiesAlertWindowStyle;

        if (this.props.COOKIES_WINDOW_IS_VISIBLE === true) {
            cookiesAlertWindowStyle = 'cookies_alert_window cookies_alert_window_showed';
        } else if (this.props.COOKIES_WINDOW_IS_VISIBLE === 'hiding') {
            cookiesAlertWindowStyle = 'cookies_alert_window cookies_alert_window_showed cookies_alert_window_opacity';
        } else {
            cookiesAlertWindowStyle = 'cookies_alert_window';
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
        COOKIES_WINDOW_IS_VISIBLE: state.COOKIES_WINDOW_IS_VISIBLE,
    }
}

export default connect(mapStateToProps)(CookiesWindow);
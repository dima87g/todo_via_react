import {registry} from "../main";
import {showCookiesAlertWindow, showInfoWindow} from "../todo_functions";
import axios from "axios";
import {Login} from "./Login";
import {LoadingWindow} from "./LoadingWindow";
import React from "react";
import {connect} from "react-redux";
import {showConfirmWindow, showShadowModal, showInfoWindows} from "../redux/actions";
import {store} from "../redux/store";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.confirmWindowFunction = null;
        this.authCheck = this.authCheck.bind(this);
        this.showConfirmWindow = this.showConfirmWindow.bind(this);
        this.confirmWindowClick = this.confirmWindowClick.bind(this);
        this.knockKnock = this.knockKnock.bind(this);
        this.login = React.createRef();
        this.loadingWindow = React.createRef();
    }

    componentDidMount() {
        this.authCheck();
    }

    authCheck() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                registry.login.createTaskList();
                registry.login.hideLoginWindow();
            } else {
                showCookiesAlertWindow();
                store.dispatch(showShadowModal(true));
            }
        }
        this.knockKnock('/auth_check', responseHandler);
    }

    showInfoWindow(message) {
        store.dispatch(showInfoWindows(true, message));

        let timer = setTimeout(() => {
            store.dispatch(showInfoWindows(false, ''));
            timer = clearTimeout(timer);
        }, 3000);
    }

    showConfirmWindow(message, func) {
        this.showShadowModal();
        this.confirmWindowFunction = func;
        store.dispatch(showConfirmWindow(true, message));
    }

    confirmWindowClick(e) {
        if (e.target.value === 'ok') {
            this.hideShadowModal();
            this.confirmWindowFunction()
        } else {
            this.hideShadowModal();
        }
        this.confirmWindowFunction = null;
        store.dispatch(showConfirmWindow(false, ''));
    }

    showShadowModal() {
        store.dispatch(showShadowModal(true));
    }

    hideShadowModal() {
        store.dispatch(showShadowModal(false));
    }

    knockKnock(path, func, sendData) {
        const req = axios.default;
        this.loadingWindow.current.showWindow();
        req.post(path, sendData)
            .then((response) => {
                this.loadingWindow.current.hideWindow();
                if (response.headers['content-type'] === 'application/json') {
                    func(response);
                }
            })
            .catch((error) => {
                this.loadingWindow.current.hideWindow();
                console.log(error);
                console.log(error.response);
                if (error.response.status === 403) {
                    this.showShadowModal();
                    showInfoWindow(error.response.data['error_message']);
                }
                else if (error.response.status) {
                    func(error.response);
                }
                // func(error.response);
            })
    }

    render() {
        let shadowStyle;
        let confirmWindowStyle;
        let infoWindowStyle;

        if (this.props.SHADOW_MODAL_IS_VISIBLE) {
            shadowStyle = 'shadow_main shadow_visible';
        } else {
            shadowStyle = 'shadow_main shadow_hidden';
        }

        if (this.props.CONFIRM_WINDOW_IS_VISIBLE) {
            confirmWindowStyle = 'confirm_window confirm_window_visible';
        } else {
            confirmWindowStyle = 'confirm_window confirm_window_hidden';
        }

        if (this.props.INFO_WINDOW_IS_VISIBLE) {
            infoWindowStyle = 'info_window';
        } else {
            infoWindowStyle = 'info_window info_window_visible';
        }

        return (
            <div className={'app'} id={'app'}>
                <Login ref={this.login} app={this}/>
                <div id={"confirm_window"} className={confirmWindowStyle}>
                    <p id={"confirm_window_message"}
                       className={'confirm_window_message'}>
                        {this.props.CONFIRM_WINDOW_MESSAGE}
                    </p>
                    <button type={"button"}
                            className={"confirm_window_buttons"}
                            value={"ok"}
                            onClick={this.confirmWindowClick}>
                        OK
                    </button>
                    <button type={"button"}
                            className={"confirm_window_buttons"}
                            value={'cancel'}
                            onClick={this.confirmWindowClick}>
                        {localisation['confirm_window']['cancel_button']}
                    </button>
                </div>
                <div id={'info_window'} className={infoWindowStyle}>
                    <p className="info_window_message" id="info_window_message">
                        {this.props.INFO_WINDOW_MESSAGE}
                    </p>
                </div>
                <LoadingWindow ref={this.loadingWindow}/>
                <div id={'shadow'}
                     className={shadowStyle}
                />
                <div className={"cookies_alert_window"} id={"cookies_alert_window"}>
                    <p className={"cookies_alert_window_text"} id={"cookies_alert_window_text"}/>
                    <button type={"button"}
                            className={"cookies_alert_confirm_button"}
                            id={"cookies_alert_confirm_button"}>
                        OK
                    </button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.SHADOW_MODAL_IS_VISIBLE,
        CONFIRM_WINDOW_IS_VISIBLE: state.CONFIRM_WINDOW_IS_VISIBLE,
        CONFIRM_WINDOW_MESSAGE: state.CONFIRM_WINDOW_MESSAGE,
        INFO_WINDOW_IS_VISIBLE: state.INFO_WINDOW_IS_VISIBLE,
        INFO_WINDOW_MESSAGE: state.INFO_WINDOW_MESSAGE,
    }
}

export default connect(mapStateToProps)(App);
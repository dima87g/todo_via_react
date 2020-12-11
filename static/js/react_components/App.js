import {registry} from "../main";
import {showCookiesAlertWindow} from "../todo_functions";
import axios from "axios";
import {Login} from "./Login";
import {LoadingWindow} from "./LoadingWindow";

export class App extends React.Component {
    constructor() {
        super();
        this.confirmWindowFunction = null;
        this.state = {
            shadowModalIsVisible: false,
            confirmWindowIsVisible: false,
            confirmWindowMessage: '',
        }
        this.authCheck = this.authCheck.bind(this);
        this.showConfirmWindow = this.showConfirmWindow.bind(this);
        this.confirmWindowClick = this.confirmWindowClick.bind(this);
        this.knockKnock = this.knockKnock.bind(this);
        this.login = React.createRef();
        this.loadingWindow = React.createRef();
    }

    componentDidMount() {
        registry.app = this;
        this.authCheck();
    }

    componentWillUnmount() {
        registry.app = null;
    }

    authCheck() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.login.current.createTaskList();
                this.login.current.hideLoginWindow();
            } else {
                showCookiesAlertWindow();
                this.setState({
                    shadowModalIsVisible: true,
                });
            }
        }
        this.knockKnock('/auth_check', responseHandler);
    }

    removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    showConfirmWindow(message, func) {
        this.showShadowModal();
        this.confirmWindowFunction = func;

        this.setState({
            confirmWindowIsVisible: true,
            confirmWindowMessage: message,
        });
    }

    confirmWindowClick(e) {
        if (e.target.value === 'ok') {
            this.hideShadowModal();
            this.confirmWindowFunction()
        } else {
            this.hideShadowModal();
        }
        this.confirmWindowFunction = null;
        this.setState({
            confirmWindowIsVisible: false,
        })
    }

    showShadowModal() {
        registry.headerMenu.setState({
            menuDisabled: true,
        });

        if (registry.taskInput) {
            registry.taskInput.setState({
                taskInputDisabled: true,
            });
        }

        this.setState({
            shadowModalIsVisible: true,
        });
    }

    hideShadowModal() {
        registry.headerMenu.setState({
            menuDisabled: false,
        });

        if (registry.taskInput) {
            registry.taskInput.setState({
                taskInputDisabled: false,
            });
        }

        this.setState({
            shadowModalIsVisible: false,
        })
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
                func(error.response);
            })
    }

    render() {
        let shadowStyle;
        let confirmWindowStyle;

        if (this.state.shadowModalIsVisible) {
            shadowStyle = 'shadow_main shadow_visible';
        } else {
            shadowStyle = 'shadow_main shadow_hidden';
        }

        if (this.state.confirmWindowIsVisible) {
            confirmWindowStyle = 'confirm_window confirm_window_visible';
        } else {
            confirmWindowStyle = 'confirm_window confirm_window_hidden';
        }
        return (
            <div className={'app'} id={'app'}>
                <Login app={this}
                            ref={this.login}/>
                <div id={"confirm_window"} className={confirmWindowStyle}>
                    <p id={"confirm_window_message"}
                       className={'confirm_window_message'}>
                        {this.state.confirmWindowMessage}
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
                <div className="info_window" id="info_window">
                    <p className="info_window_message" id="info_window_message"/>
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
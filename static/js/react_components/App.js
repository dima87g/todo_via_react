import React from "react";
import axios from "axios";
import {store} from "../redux/store";
import {showShadowModal, showInfoWindow, showCookiesAlertWindow} from "../redux/actions";
import {Login} from "./Login";
import LoadingWindow from "./windows/LoadingWindow";
import CookiesWindow from "./windows/CookiesWindow";
import ConfirmWindow from "./windows/ConfirmWindow";
import InfoWindow from "./windows/InfoWindow";
import ShadowModal from "./windows/ShadowModal";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.authCheck = this.authCheck.bind(this);
        this.knockKnock = this.knockKnock.bind(this);
        this.login = React.createRef();
        this.loadingWindow = React.createRef();
        console.log(this.loadingWindow);
    }

    componentDidMount() {
        this.authCheck();
    }

    authCheck() {
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                this.login.current.createTaskList();
                this.login.current.hideLoginWindow();
            } else {
                store.dispatch(showCookiesAlertWindow(true));
                store.dispatch(showShadowModal(true));
            }
        }
        this.knockKnock('/auth_check', responseHandler);
    }

    knockKnock(path, func, sendData) {
        // console.log(this.loadingWindow);
        // console.log(this.loadingWindow.current);
        //TODO make refactor on knockKnock, maybe it may need to some changes
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
                    store.dispatch(showShadowModal(true));
                    store.dispatch(showInfoWindow(true, error.response.data['error_message']));
                }
                else if (error.response.status) {
                    func(error.response);
                }
                // func(error.response);
            })
    }

    render() {
        return (
            <div className={'app'} id={'app'}>
                <Login ref={this.login} app={this}/>
                <ConfirmWindow/>
                <InfoWindow/>
                <LoadingWindow ref={this.loadingWindow}/>
                <ShadowModal/>
                <CookiesWindow/>
            </div>
        )
    }
}

export default App;
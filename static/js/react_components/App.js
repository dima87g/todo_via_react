import React from "react";
import axios from "axios";
import {store} from "../redux/store";
import {connect} from "react-redux";
import {showShadowModal, showInfoWindow, hideHeaderMenu} from "../redux/actions";
import Header from "./Header";
import ConfirmWindow from "./windows/ConfirmWindow";
import InfoWindow from "./windows/InfoWindow";
import LoadingWindow from "./windows/LoadingWindow";
import ShadowModal from "./windows/ShadowModal";
import CookiesWindow from "./windows/CookiesWindow";
import Login from "./Login";
import TaskList from "./TaskList";
import SettingsMenuWindow from "./windows/SettingsMenuWindow";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.networkError = false;
        this.knockKnock = this.knockKnock.bind(this);
        this.appRef = React.createRef();
        this.loadingWindow = React.createRef();
        this.login = React.createRef();
        this.taskList = React.createRef();
    }

    componentDidMount() {
        this.appRef.current.addEventListener('scroll', () => {
            if (this.props.HEADER_MENU_IS_SHOWING) {
                this.props.dispatch(hideHeaderMenu());
            }
        })
    }

    knockKnock(path, func, sendData) {
        const req = axios.create();
        if (this.networkError === true) {
            this.networkError = false;
            this.login.current.listRefresh();
            this.props.dispatch(showInfoWindow(true, localisation['error_messages']['network_error']));
        } else {
            this.loadingWindow.current.showWindow();
            req.post(path, sendData, {timeout: 10000})
            .then((response) => {
                this.loadingWindow.current.hideWindow();
                if (response.headers['content-type'] === 'application/json') {
                    func(response);
                    this.networkError = false;
                }
            })
            .catch((error) => {
                this.loadingWindow.current.hideWindow();
                console.log(error);
                if (error.request) {
                    if (error.code === 'ECONNABORTED') {
                        this.props.dispatch(showInfoWindow(true, localisation['error_messages']['timeout_error']))
                        this.networkError = true;
                    }
                } else if (error.response) {
                    console.log(error.response);
                    if (error.response.status === 401 && error.config.url === '/user_login') {
                        func(error.response);
                    } else if (error.response.status === 401 && error.config.url !== '/auth_check') {
                        console.log(error.config.url);
                        this.login.current.forceLogOut();
                        this.props.dispatch(showInfoWindow(true, localisation['error_messages']['authorisation_error']));
                    } else if (error.response.status === 403) {
                        store.dispatch(showShadowModal(true));
                        store.dispatch(showInfoWindow(true, error.response.data['error_message']));
                    }
                    else if (error.response.status) {
                        func(error.response);
                    }
                }
                console.log(error.config);
            })
        }
    }

    render() {
        return (
            <div className={'app'} id={'app'} ref={this.appRef}>
                <Header login={this.login} taskList={this.taskList}/>
                <ConfirmWindow/>
                <InfoWindow/>
                <LoadingWindow ref={this.loadingWindow}/>
                <CookiesWindow/>
                <Login app={this} ref={this.login}/>
                <TaskList app={this} appRef={this.appRef} login={this.login} ref={this.taskList}/>
                <SettingsMenuWindow app={this} login={this.login} taskList={this.taskList}/>
                <ShadowModal/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        HEADER_MENU_IS_SHOWING: state.app.HEADER_MENU_IS_SHOWING,
    }
}

export default connect(mapStateToProps)(App);

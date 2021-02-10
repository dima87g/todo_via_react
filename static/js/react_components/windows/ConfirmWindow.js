import React from "react";
import {connect} from "react-redux";
import {showConfirmWindow} from "../../redux/actions";
import {store} from "../../redux/store";

class ConfirmWindow extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (e.target.value === 'ok') {
            this.props.CONFIRM_WINDOW_FUNCTION();
        }
        store.dispatch(showConfirmWindow(false, '', null));
    }

    render() {
        let confirmWindowStyle;
        let confirmWindowButtonsDisabled;

        if (this.props.CONFIRM_WINDOW_IS_VISIBLE) {
            confirmWindowStyle = 'confirm_window confirm_window_visible';
            confirmWindowButtonsDisabled = false;
        } else {
            confirmWindowStyle = 'confirm_window confirm_window_hidden';
            confirmWindowButtonsDisabled = true;
        }

        return (
            <div id={"confirm_window"} className={confirmWindowStyle}>
                <p id={"confirm_window_message"} className={'confirm_window_message'}>
                    {this.props.CONFIRM_WINDOW_MESSAGE}
                </p>
                <button type={"button"}
                        className={"confirm_window_buttons"}
                        value={"ok"}
                        onClick={this.onClick}
                        disabled={confirmWindowButtonsDisabled}>
                    OK
                </button>
                <button type={"button"}
                        className={"confirm_window_buttons"}
                        value={'cancel'}
                        onClick={this.onClick}
                        disabled={confirmWindowButtonsDisabled}>
                    {localisation['confirm_window']['cancel_button']}
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        CONFIRM_WINDOW_IS_VISIBLE: state.CONFIRM_WINDOW_IS_VISIBLE,
        CONFIRM_WINDOW_MESSAGE: state.CONFIRM_WINDOW_MESSAGE,
        CONFIRM_WINDOW_FUNCTION: state.CONFIRM_WINDOW_FUNCTION,
    }
}

export default connect(mapStateToProps)(ConfirmWindow);
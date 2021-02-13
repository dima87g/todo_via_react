import React from "react";
import {connect} from "react-redux";
import {showInfoWindow} from "../../redux/actions";

class InfoWindow extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.INFO_WINDOW_IS_VISIBLE) {
            setTimeout(() => {
                this.props.dispatch(showInfoWindow(false, ''));
            }, 3000);
        }
    }

    render() {
        let infoWindowStyle;

        if (this.props.INFO_WINDOW_IS_VISIBLE) {
            infoWindowStyle = 'info_window info_window_visible';
        } else {
            infoWindowStyle = 'info_window';
        }

        return (
            <div id={'info_window'} className={infoWindowStyle}>
                <p className="info_window_message" id="info_window_message">{this.props.INFO_WINDOW_MESSAGE}</p>
            </div>
        )
    }
}

function mapToStateProps(state) {
    return {
        INFO_WINDOW_IS_VISIBLE: state.INFO_WINDOW_IS_VISIBLE,
        INFO_WINDOW_MESSAGE: state.INFO_WINDOW_MESSAGE,
    }
}

export default connect(mapToStateProps)(InfoWindow);
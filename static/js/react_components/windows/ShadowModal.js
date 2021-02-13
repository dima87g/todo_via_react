import React from "react";
import {connect} from "react-redux";
import {showShadowModal} from "../../redux/actions";

class ShadowModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.CONFIRM_WINDOW_IS_VISIBLE) {
            this.props.dispatch(showShadowModal(true));
        } else if (!this.props.CONFIRM_WINDOW_IS_VISIBLE) {
            this.props.dispatch(showShadowModal(false));
        }
    }

    render() {
        let shadowStyle;

        if (this.props.SHADOW_MODAL_IS_VISIBLE) {
            shadowStyle = 'shadow_main shadow_visible';
        } else {
            shadowStyle = 'shadow_main shadow_hidden';
        }

        return (
            <div id={'shadow'} className={shadowStyle}/>
        )
    }
}

function mapToStateProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.SHADOW_MODAL_IS_VISIBLE,
        CONFIRM_WINDOW_IS_VISIBLE: state.CONFIRM_WINDOW_IS_VISIBLE,
    }
}

export default connect(mapToStateProps)(ShadowModal);
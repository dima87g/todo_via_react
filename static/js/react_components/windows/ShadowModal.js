import React from "react";
import {connect} from "react-redux";
import {showShadowModal} from "../../redux/actions/actions";

class ShadowModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            if (this.props.CONFIRM_WINDOW_IS_VISIBLE || this.props.AUTH_MENU_IS_VISIBLE ||
                this.props.TASK_EDIT_FIELD_IS_SHOWING || this.props.SETTINGS_MENU_IS_VISIBLE) {
                if (this.props.SHADOW_MODAL_IS_VISIBLE === false) {
                    this.props.dispatch(showShadowModal(true));
                }
            } else if (this.props.SHADOW_MODAL_IS_VISIBLE) {
                this.props.dispatch(showShadowModal(false));
            }
        }
    }

    render() {
        let shadowStyle;

        if (this.props.SHADOW_MODAL_IS_VISIBLE) {
            shadowStyle = 'shadow_main shadow_visible';
            document.body.classList.add('body_under_modal');
        } else {
            shadowStyle = 'shadow_main shadow_hidden';
            document.body.classList.remove('body_under_modal');
        }

        return (
            <div id={'shadow'} className={shadowStyle}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.app.SHADOW_MODAL_IS_VISIBLE,
        CONFIRM_WINDOW_IS_VISIBLE: state.app.CONFIRM_WINDOW_IS_VISIBLE,
        AUTH_MENU_IS_VISIBLE: state.login.AUTH_MENU_IS_VISIBLE,
        SETTINGS_MENU_IS_VISIBLE: state.app.SETTINGS_MENU_IS_VISIBLE,
        TASK_EDIT_FIELD_IS_SHOWING: state.app.TASK_EDIT_FIELD_IS_SHOWING,
    }
}

export default connect(mapStateToProps)(ShadowModal);
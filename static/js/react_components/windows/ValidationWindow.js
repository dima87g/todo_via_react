import React from "react";

export class ValidationWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let validationErrorWindowStyle;

        if (this.props.valid) {
            validationErrorWindowStyle = 'validation_error_window validation_error_window_hidden';
        } else {
            validationErrorWindowStyle = 'validation_error_window';
        }
        return (
            <div className={validationErrorWindowStyle}>
                <div className={'validation_error_window_arrow'}></div>
                <div className={'validation_error_info_field'}>
                    <p className={'validation_error_window_info_text'}>
                        {this.props.validationErrorText}
                    </p>
                </div>
            </div>
        )
    }
}
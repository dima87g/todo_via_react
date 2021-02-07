import React from "react";

class CookiesWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cookiesAlertWindowStyle;

        return (
            <div
                id={'cookies_alert_window'}
                className={cookiesAlertWindowStyle}
            >

            </div>
        )
    }
}
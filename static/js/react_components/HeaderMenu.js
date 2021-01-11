import {registry} from "../main";
import React from "react";

export class HeaderMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menuShowed: false,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        }
        this.showHeaderMenu = this.showHeaderMenu.bind(this);
        this.logOut = this.logOut.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    componentDidMount() {
        registry.headerMenu = this;
    }

    componentWillUnmount() {
        registry.headerMenu = null;
    }

    showHeaderMenu() {
        if (this.state.menuShowed) {
            this.setState({
                menuShowed: false,
                userLogOutButtonDisabled: true,
                userDeleteButtonDisabled: true,
                changePasswordButtonDisabled: true,
            });
        } else {
            this.setState({
                menuShowed: true,
                userLogOutButtonDisabled: false,
                userDeleteButtonDisabled: false,
                changePasswordButtonDisabled: false,
            });
        }
    }

    logOut() {
        this.setState({
            menuShowed: false,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        });
        registry.login.logOut();
    }

    userDelete() {
        this.setState({
            menuShowed: false,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        });
        registry.login.userDelete();
    }

    changePassword() {
        this.setState({
            menuShowed: false,
            userLogOutButtonDisabled: true,
            userDeleteButtonDisabled: true,
            changePasswordButtonDisabled: true,
        });
        registry.login.changePasswordWindow();
    }

    render() {
        let headerMenuListStyle;
        let headerMenuListButtonsStyle;
        let burgerButtonStyle;
        let menuButtonFunction;

        if (this.props.shadowModalIsVisible === false) {
            menuButtonFunction = this.showHeaderMenu;
        } else {
            menuButtonFunction = null;
        }

        if (this.state.menuShowed === false) {
            headerMenuListStyle = 'header_menu_list';
            headerMenuListButtonsStyle = 'header_menu_list_buttons';
            burgerButtonStyle = 'burger_button';
        } else {
            headerMenuListStyle = 'header_menu_list header_menu_list_visible';
            headerMenuListButtonsStyle = 'header_menu_list_buttons' +
                ' header_menu_list_buttons_visible';
            burgerButtonStyle = 'burger_button burger_button_clicked'
        }

        return(
            <div id={'header_menu'} className={'header_menu'}>
                <div id={'header_menu_list'} className={headerMenuListStyle}>
                    <input type="button"
                           className={headerMenuListButtonsStyle}
                           id='user_logout_button'
                           value={localisation['buttons']['logout']}
                           disabled={this.state.userLogOutButtonDisabled}
                           onClick={this.logOut}/>
                    <input type="button"
                           className={headerMenuListButtonsStyle}
                           id="change_password_button"
                           value={localisation['buttons']['change_password']}
                           disabled={this.state.changePasswordButtonDisabled}
                           onClick={this.changePassword}/>
                    <input type="button"
                           className={headerMenuListButtonsStyle}
                           id="user_delete_button"
                           value={localisation['buttons']['delete_user']}
                           disabled={this.state.userDeleteButtonDisabled}
                           onClick={this.userDelete}/>
                </div>
                <div id={'burger_button'}
                    className={burgerButtonStyle}
                    onClick={menuButtonFunction}>
                   <div id={'burger_button_stick'} className={'burger_button_stick'}/>
                   <div id={'burger_button_stick'} className={'burger_button_stick'}/>
                   <div id={'burger_button_stick'} className={'burger_button_stick'}/>
               </div>
            </div>
        )
    }
}
import {registry} from "../main";
import React from "react";
import {connect} from "react-redux";

class HeaderMenu extends React.Component {
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
        document.addEventListener(
            'scroll',
            (e) => {
                if (this.state.menuShowed === true) {
                    this.showHeaderMenu();
                }
            }
        );

        document.addEventListener(
            'click',
            (e) => {
                let menu = document.getElementById('header_menu');
                let target = e.target;
                if (this.state.menuShowed === true && e.target instanceof Node && !menu.contains(e.target)) {
                    this.showHeaderMenu();
                }
            }
        );
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

        if (this.props.SHADOW_MODAL_IS_VISIBLE === false) {
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
                           id={"user_logout_button"}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['logout']}
                           disabled={this.state.userLogOutButtonDisabled}
                           onClick={this.logOut}/>
                    <input type="button"
                           id={"change_password_button"}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['change_password']}
                           disabled={this.state.changePasswordButtonDisabled}
                           onClick={this.changePassword}/>
                    <input type="button"
                           id={"user_delete_button"}
                           className={headerMenuListButtonsStyle}
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

function mapToStateProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.SHADOW_MODAL_IS_VISIBLE,
    }
}

export default connect(mapToStateProps)(HeaderMenu);
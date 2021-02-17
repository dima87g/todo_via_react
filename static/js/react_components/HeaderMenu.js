import React from "react";
import {connect} from "react-redux";
import {hideHeaderMenu, showHeaderMenu} from "../redux/actions";

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props)
        this.login = this.props.login;
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
                if (this.props.HEADER_MENU_IS_SHOWING === true) {
                    this.showHeaderMenu();
                }
            }
        );

        document.addEventListener(
            'click',
            (e) => {
                let menu = document.getElementById('header_menu');
                let target = e.target;
                if (this.props.HEADER_MENU_IS_SHOWING === true && target instanceof Node && !menu.contains(target)) {
                    this.showHeaderMenu();
                }
            }
        );
    }

    showHeaderMenu() {
        if (this.props.HEADER_MENU_IS_SHOWING) {
            // this.setState({
            //     menuShowed: false,
            //     userLogOutButtonDisabled: true,
            //     userDeleteButtonDisabled: true,
            //     changePasswordButtonDisabled: true,
            // });
            this.props.dispatch(hideHeaderMenu());
        } else {
            // this.setState({
            //     menuShowed: true,
            //     userLogOutButtonDisabled: false,
            //     userDeleteButtonDisabled: false,
            //     changePasswordButtonDisabled: false,
            // });
            this.props.dispatch(showHeaderMenu());
        }
    }

    logOut() {
        // this.setState({
        //     menuShowed: false,
        //     userLogOutButtonDisabled: true,
        //     userDeleteButtonDisabled: true,
        //     changePasswordButtonDisabled: true,
        // });
        this.props.dispatch(hideHeaderMenu());
        this.login.current.logOut();
    }

    userDelete() {
        // this.setState({
        //     menuShowed: false,
        //     userLogOutButtonDisabled: true,
        //     userDeleteButtonDisabled: true,
        //     changePasswordButtonDisabled: true,
        // });
        this.props.dispatch(hideHeaderMenu());
        this.login.current.userDelete();
    }

    changePassword() {
        // this.setState({
        //     menuShowed: false,
        //     userLogOutButtonDisabled: true,
        //     userDeleteButtonDisabled: true,
        //     changePasswordButtonDisabled: true,
        // });
        this.props.dispatch(hideHeaderMenu());
        this.login.current.changePasswordWindow();
    }

    render() {
        let headerMenuListStyle;
        let headerMenuListButtonsStyle;
        let headerMenuListButtonsDisabled;
        let burgerButtonStyle;
        let menuButtonFunction;

        if (this.props.SHADOW_MODAL_IS_VISIBLE === false) {
            menuButtonFunction = this.showHeaderMenu;
        } else {
            menuButtonFunction = null;
        }

        if (this.props.HEADER_MENU_IS_SHOWING === false) {
            headerMenuListButtonsDisabled = true;
            headerMenuListStyle = 'header_menu_list';
            headerMenuListButtonsStyle = 'header_menu_list_buttons';
            burgerButtonStyle = 'burger_button';
        } else {
            headerMenuListButtonsDisabled = false;
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
                           disabled={headerMenuListButtonsDisabled}
                           onClick={this.logOut}/>
                    <input type="button"
                           id={"change_password_button"}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['change_password']}
                           disabled={headerMenuListButtonsDisabled}
                           onClick={this.changePassword}/>
                    <input type="button"
                           id={"user_delete_button"}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['delete_user']}
                           disabled={headerMenuListButtonsDisabled}
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

function mapStateToProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.app.SHADOW_MODAL_IS_VISIBLE,
        HEADER_MENU_IS_SHOWING: state.app.HEADER_MENU_IS_SHOWING,
    }
}

export default connect(mapStateToProps)(HeaderMenu);
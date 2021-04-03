import React from "react";
import {connect} from "react-redux";
import {hideHeaderMenu, showHeaderMenu, showSettingsMenu} from "../redux/actions";

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props)
        this.login = this.props.login;
        this.listSelectMenu = this.props.listSelectMenu;
        this.showHeaderMenu = this.showHeaderMenu.bind(this);
        this.openSettingsMenu = this.openSettingsMenu.bind(this);
        this.createNewList = this.createNewList.bind(this);
        this.deleteList = this.deleteList.bind(this);
    }

    componentDidMount() {
        document.addEventListener(
            'click',
            (e) => {
                let menu = document.getElementById('header_menu_div');
                let target = e.target;
                if (this.props.HEADER_MENU_IS_SHOWING === true && target instanceof Node && !menu.contains(target)) {
                    this.showHeaderMenu();
                }
            }
        );
    }

    showHeaderMenu() {
        if (this.props.HEADER_MENU_IS_SHOWING) {
            this.props.dispatch(hideHeaderMenu());
        } else {
            this.props.dispatch(showHeaderMenu());
        }
    }

    openSettingsMenu() {
        this.props.dispatch(hideHeaderMenu());
        this.props.dispatch(showSettingsMenu());
    }

    createNewList() {
        this.props.dispatch(hideHeaderMenu());
        this.login.current.createNewListWindow();
    }

    deleteList() {
        this.props.dispatch(hideHeaderMenu());
        let listToDeleteId = this.listSelectMenu.current.value;
        let listToDeleteName =  this.listSelectMenu.current.options[this.listSelectMenu.current.selectedIndex].innerText

        this.login.current.deleteList(listToDeleteId, listToDeleteName);
    }

    render() {
        let headerMenuStyle;
        let headerMenuButtonsStyle;
        let headerMenuButtonsDisabled;
        let burgerButtonStyle;
        let menuButtonFunction;

        if (this.props.SHADOW_MODAL_IS_VISIBLE === false) {
            menuButtonFunction = this.showHeaderMenu;
        } else {
            menuButtonFunction = null;
        }

        if (this.props.HEADER_MENU_IS_SHOWING === false) {
            headerMenuButtonsDisabled = true;
            headerMenuStyle = 'header_menu';
            headerMenuButtonsStyle = 'header_menu_buttons';
            burgerButtonStyle = 'burger_button';
        } else {
            headerMenuButtonsDisabled = false;
            headerMenuStyle = 'header_menu header_menu_visible';
            headerMenuButtonsStyle = 'header_menu_buttons' +
                ' header_menu_buttons_visible';
            burgerButtonStyle = 'burger_button burger_button_clicked'
        }

        return(
            <div id={'header_menu_div'}>
                <div id={'header_menu'} className={headerMenuStyle}>
                    <button type={'button'}
                           id={'delete_list_button'}
                           className={headerMenuButtonsStyle}
                           disabled={headerMenuButtonsDisabled}
                           onClick={this.deleteList}
                   >
                       <img src='/static/icons/delete_list.svg' alt={localisation['buttons']['delete_list']}/>
                   </button>
                    <button type={'button'}
                           id={'create_list_button'}
                           className={headerMenuButtonsStyle}
                           disabled={headerMenuButtonsDisabled}
                           onClick={this.createNewList}
                   >
                       <img src='/static/icons/create_list.svg' alt={localisation['buttons']['create_list']}/>
                   </button>
                   <button type={'button'}
                           id={'settings_window_button'}
                           className={headerMenuButtonsStyle}
                           disabled={headerMenuButtonsDisabled}
                           onClick={this.openSettingsMenu}
                   >
                       <img src='/static/icons/settings_icon.svg' alt={localisation['buttons']['settings']}/>
                   </button>
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
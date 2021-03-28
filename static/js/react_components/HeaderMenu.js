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
                           id={'settings_window_button'}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['settings']}
                           disabled={headerMenuListButtonsDisabled}
                           onClick={this.openSettingsMenu}/>
                    <input type="button"
                           id={"create_new_list_button"}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['create_list']}
                           disabled={headerMenuListButtonsDisabled}
                           onClick={this.createNewList}
                    />
                    <input type="button"
                           id={"delete_list_button"}
                           className={headerMenuListButtonsStyle}
                           value={localisation['buttons']['delete_list']}
                           disabled={headerMenuListButtonsDisabled}
                           onClick={this.deleteList}
                    />
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
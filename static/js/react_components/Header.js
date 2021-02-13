import React from "react";
import {connect} from "react-redux";
import {registry} from "../main";
import HeaderMenu from "./HeaderMenu";
import TaskInput from "./TaskInput";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.deleteList = this.deleteList.bind(this);
        this.userNameField = React.createRef();
        this.listSelectMenu = React.createRef();
    }

    listChange(e) {
        registry.login.listChange(e);
    }

    deleteList() {
        let listToDeleteId = this.listSelectMenu.current.value;
        let listToDeleteName =  this.listSelectMenu.current.options[this.listSelectMenu.current.selectedIndex].innerText

        registry.login.deleteList(listToDeleteId, listToDeleteName);
    }

    render() {
        let listSelectMenuDisabled;
        let deleteListButtonDisabled;

        listSelectMenuDisabled = !!this.props.SHADOW_MODAL_IS_VISIBLE;
        deleteListButtonDisabled = !!this.props.SHADOW_MODAL_IS_VISIBLE;

        return(
            <div id={"header"} className={"header"}>
                <div id={"header_login_section"} className={"header_login_section"}>
                    <p id={"user_name_field"}
                       className={"user_name_field"}
                       ref={this.userNameField}>
                        {"User: " + this.props.USER_NAME}
                    </p>
                    <a href={localisation['language_change']['link']} className={'language_switch_button'}>
                        <img
                            src={'/static/icons/' + localisation['language_change']['label'] + '_flag.png'}
                            alt={localisation['language_change']['label']}
                        />
                    </a>
                    <div className={'list_select_menu_div'}>
                        <select
                            className={'list_select_menu'}
                            value={this.props.LIST_ID ? this.props.LIST_ID.toString() : '0'}
                            onChange={this.listChange}
                            disabled={listSelectMenuDisabled}
                            ref={this.listSelectMenu}
                        >
                            {this.props.LIST_SELECT_MENU.map((value, index) => {
                                // TODO object keys are always of string type !!!
                                //  Need to make the listsDict structure from the server
                                //  so that id is a numeric type without parseInt function!!!
                                return <option key={index} value={value[0]}>{value[1]}</option>
                            })}
                            <option value={0}>{localisation['list_select_menu']['add_list']}</option>
                        </select>
                        <button
                            className={'delete_list_button'}
                            type={'button'}
                            onClick={this.deleteList}
                            disabled={deleteListButtonDisabled}
                        >
                            {localisation['buttons']['delete_list']}
                        </button>
                    </div>
                    <HeaderMenu/>
                </div>
                <TaskInput/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.SHADOW_MODAL_IS_VISIBLE,
        USER_NAME: state.USER_NAME,
        LIST_ID: state.LIST_ID,
        LIST_SELECT_MENU: state.LIST_SELECT_MENU,
    }
}

export default connect(mapStateToProps)(Header);
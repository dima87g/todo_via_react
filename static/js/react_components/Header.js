import {registry} from "../main";
import React from "react";
import {HeaderMenu} from "./HeaderMenu";
import {TaskInput} from "./TaskInput";
import {removeChildren} from "../todo_functions";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedListName: this.props.selectedListName,
        }
        this.userNameField = React.createRef();
        this.count = 0;
    }

    listChange(e) {
        registry.login.listChange(e);
    }

    render() {
        return(
            <div id={"header"} className={"header"}>
                <div id={"header_login_section"} className={"header_login_section"}>
                    <p id={"user_name_field"}
                       className={"user_name_field"}
                       ref={this.userNameField}>
                        {"User: " + this.props.userName}
                    </p>
                    <a href={localisation['language_change']['link']} className={'language_switch_button'}>
                        <img
                            src={'/static/icons/' + localisation['language_change']['label'] + '_flag.png'}
                            alt={localisation['language_change']['label']}
                        />
                    </a>
                    <select
                        className={'list_select_menu'}
                        value={registry.taskList ? registry.taskList.listId.toString() : '0'}
                        onChange={this.listChange}
                    >
                        {this.props.listSelectMenu.map((value, index) => {
                            let currentSelectedList;
                            // TODO object keys are always of string type !!!
                            //  Need to make the listsDict structure from the server
                            //  so that id is a numeric type without parseInt function!!!
                            return <option key={index} value={value[0]}>{value[1]}</option>
                        })}
                        <option value={0}>...new list...</option>
                    </select>
                    <HeaderMenu shadowModalIsVisible={this.props.shadowModalIsVisible}/>
                </div>
                <TaskInput shadowModalIsVisible={this.props.shadowModalIsVisible}/>
            </div>
        )
    }
}
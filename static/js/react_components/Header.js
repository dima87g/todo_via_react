import {registry} from "../main";
import React from "react";
import {HeaderMenu} from "./HeaderMenu";
import {TaskInput} from "./TaskInput";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.userNameField = React.createRef();
        this.count = 0;
    }

    componentDidMount() {
        console.log('I am Mounted!');
        this.count++;
        console.log(this.count);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('I am updating!');
        this.count++;
        console.log(this.count);
        console.log(prevProps);
        console.log(this.props);
        if (this.props.userName && !this.userNameField.current.firstChild) {
            this.userNameField.current.appendChild(document.createTextNode('User: '+ this.props.userName));
        } else {
            registry.app.removeChildren(this.userNameField);
        }
    }

    listChange(e) {
        registry.login.listChange(e);
    }

    render() {
        return(
            <div id={"header"} className={"header"}>
                <div id={"header_login_section"} className={"header_login_section"}>
                    <p
                        id={"user_name_field"}
                        className={"user_name_field"}
                        ref={this.userNameField}
                    />
                    <a href={localisation['language_change']['link']} className={'language_switch_button'}>
                        <img
                            src={'/static/icons/' + localisation['language_change']['label'] + '_flag.png'}
                            alt={localisation['language_change']['label']}
                        />
                    </a>
                    <select
                        // TODO Need to make defaultValue in select tag instead selected in option tag
                        className={'list_select_menu'}
                        onChange={this.listChange}
                    >
                        {this.props.listSelectMenu.map((value, index) => {
                            let currentSelectedList;
                            // TODO object keys are always of string type !!!
                            //  Need to make the listsDict structure from the server
                            //  so that id is a numeric type without parseInt function!!!
                            if (registry.taskList) {
                                currentSelectedList = registry.taskList.listId === parseInt(value[0]);
                            }
                            return <option key={index} selected={currentSelectedList} value={value[0]}>{value[1]}</option>
                        })}
                        <option value={0}>...new list...</option>
                    </select>
                    <HeaderMenu/>
                </div>
                <TaskInput/>
            </div>
        )
    }
}
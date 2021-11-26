import React from "react";
import { connect } from "react-redux";
import {
    createList
} from "../../redux/actions/loginActions";
import {
    isInternetExplorer,
    removeChildren
} from "../../todo_functions";

class CreateNewListWindow extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.state = {
            newListName: ''
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.focusField = React.createRef();
        this.infoField = React.createRef();
    }

    componentDidMount() {
        this.focusField.current.focus();
    }

    handleCancel() {
        this.setState({
            newListName: '',
        });

        removeChildren(this.infoField.current);

        this.props.createNewListWindowFunction();
    }

    handleChange(e) {
        this.setState({
            newListName: e.target.value,
        });
    }

    /**
     * POST: json = {newListName: string}
     * RESPONSE:
     * if OK = true: json = {
     *      ok: true,
     *      new_list_id: number,
     *      list_dict: object
     * }
     * if OK = false: json = {
     *      ok: 'boolean',
     *      error_code: number or null,
     *      error_message: string or null
     * }
     */
    //TODO made info message if field is empty
    handleSubmit(e) {
        e.preventDefault();

        removeChildren(this.infoField.current);

        if (this.state.newListName) {
            const sendData = {'newListName': this.state.newListName};

            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    let newListId = response.data['new_list_id'].toString();
                    let listsDict = response.data['lists_dict'];
                    let listSelectMenu = Object.entries(listsDict);

                    this.setState({
                        newListName: '',
                    });

                    this.props.createNewListWindowFunction();

                    this.props.dispatch(createList(newListId, listSelectMenu, []));
                } else if (response.data['error_code'] === 1062) {
                    this.infoField.current.appendChild(document.createTextNode(localisation['create_new_list_window']['list_exists_warning']));
                }
            }
            this.app.knockKnock('/create_list', responseHandler, sendData);
        } else {
            this.infoField.current.appendChild(document.createTextNode(localisation['create_new_list_window']['no_list_name_warning']));
        }
    }

    render() {
        let createNewListWindowStyle;

        if (isInternetExplorer()) {
            createNewListWindowStyle = 'create_new_list_window_ie';
        } else {
            createNewListWindowStyle = 'create_new_list_window';
        }

        return (
            <div className={'auth_menu_window_container'}>
                <div id={"create_new_list_window"} className={createNewListWindowStyle}>
                    <button
                        type={"button"}
                        id={"create_new_list_window_cancel_button"}
                        className={"create_new_list_window_cancel_button"}
                        onClick={this.handleCancel}>
                        X
                    </button>
                    <p className={"auth_menu_forms_labels"}>{localisation["create_new_list_window"]["label"]}</p>
                    <form name={"create_new_list_form"} onSubmit={this.handleSubmit}>
                        <label htmlFor={"create_new_list_form_list_name"}
                               className={"auth_menu_labels"}>{localisation["create_new_list_window"]["new_list_name"]}</label>
                        <input type={"text"}
                               name={"create_new_list_form_list_name"}
                               id={"create_new_list_form_list_name"}
                               className={"auth_menu_input_field"}
                               placeholder={localisation["create_new_list_window"]["new_list_name_placeholder"]}
                               autoComplete={'off'}
                               maxLength={255}
                               value={this.state.newListName}
                               onChange={this.handleChange}
                               ref={this.focusField}/>
                        <button type={"submit"}
                                value={"create_new_list"}
                                id={"create_new_list_form_submit_button"}
                                className={"create_new_list_form_submit_button"}>
                            {localisation["create_new_list_window"]["new_list_button"]}
                        </button>
                    </form>
                    <p className={"info_field"}
                       ref={this.infoField}/>
                </div>
            </div>
        )
    }
}

export default connect()(CreateNewListWindow)
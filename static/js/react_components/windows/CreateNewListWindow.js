import React from "react";
import { connect } from "react-redux";
import {
    createList
} from "../../redux/actions/loginActions";
import {
    isInternetExplorer
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
        this.inputField = React.createRef();
        this.infoField = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.createNewListWindowShowed && this.props.createNewListWindowShowed) {
            this.inputField.current.focus();
        }
    }

    handleCancel() {
        this.setState({
            newListName: '',
        });
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
                }
            }
            this.app.knockKnock('/create_list', responseHandler, sendData);
        } else {
            this.infoField.current.appendChild(document.createTextNode(localisation['create_new_list_window']['no_list_name_warning']));
        }
    }

    render() {
        let createNewListWindowStyle;
        let createNewListWindowCancelButtonDisabled;
        let createNewListWindowSubmitButtonDisabled;

        if (this.props.createNewListWindowShowed) {
            createNewListWindowCancelButtonDisabled = false;
            createNewListWindowSubmitButtonDisabled = false;

            if (isInternetExplorer()) {
                createNewListWindowStyle = 'create_new_list_window_ie create_new_list_window_visible';
            } else {
                createNewListWindowStyle = 'create_new_list_window create_new_list_window_visible';
            }
        } else {
            createNewListWindowCancelButtonDisabled = true;
            createNewListWindowSubmitButtonDisabled = true;

            if (isInternetExplorer()) {
                createNewListWindowStyle = 'create_new_list_window_ie create_new_list_window_hidden';
            } else {
                createNewListWindowStyle = 'create_new_list_window create_new_list_window_hidden';
            }
        }
        return (
            <div id={"create_new_list_window"} className={createNewListWindowStyle}>
                <button
                    type={"button"}
                    id={"create_new_list_window_cancel_button"}
                    className={"create_new_list_window_cancel_button"}
                    disabled={createNewListWindowCancelButtonDisabled}
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
                            className={"create_new_list_form_list_name"}
                            placeholder={localisation["create_new_list_window"]["new_list_name_placeholder"]}
                            autoComplete={'off'}
                            maxLength={255}
                            value={this.state.newListName}
                            onChange={this.handleChange}
                            ref={this.inputField}/>
                    <button type={"submit"}
                            value={"create_new_list"}
                            id={"create_new_list_form_submit_button"}
                            className={"create_new_list_form_submit_button"}
                            disabled={createNewListWindowSubmitButtonDisabled}>
                        {localisation["create_new_list_window"]["new_list_button"]}
                    </button>
                </form>
                <p className={"create_new_list_window_info"}
                   id={"create_new_list_window_info"}
                   ref={this.infoField}/>
            </div>
        )
    }
}

export default connect()(CreateNewListWindow)
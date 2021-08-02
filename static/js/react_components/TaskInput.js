import React from "react";
import {connect} from "react-redux";

export class TaskInput extends React.Component{
    constructor(props) {
        super(props);
        this.taskList = this.props.taskList;
        this.state = {
            taskText: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.addTask = this.addTask.bind(this);
    }

    handleChange(e) {
        this.setState({
            taskText: e.target.value,
        });
    }

    addTask(e) {
        e.preventDefault();

        if (this.state.taskText) {
            this.taskList.current.addTask(this.state.taskText);
            this.setState({
                taskText: '',
            })
        }
    }

    render() {
        let taskInputSubmitFunction;
        let taskInputFieldDisabled;
        let taskInputButtonDisabled;

        if (this.props.SHADOW_MODAL_IS_VISIBLE === true) {
            taskInputSubmitFunction = null;
            taskInputFieldDisabled = true;
            taskInputButtonDisabled = true;
        } else {
            taskInputSubmitFunction = this.addTask;
            taskInputFieldDisabled = false;
            taskInputButtonDisabled = false;
        }
        return(
            <div className="task_input">
                <form className={'task_input_form'} onSubmit={taskInputSubmitFunction}>
                    <label htmlFor={'task_input_field'}/>
                        <input
                            type={'text'}
                            name={'task_input_field'}
                            className={'task_input_field'}
                            autoComplete={'off'}
                            maxLength={255}
                            value={this.state.taskText}
                            disabled={taskInputFieldDisabled}
                            onChange={this.handleChange}
                        />
                        <button type={'submit'}
                                className={'task_input_button'}
                                disabled={taskInputButtonDisabled}
                        >
                            <img src="/static/icons/add_sub.svg" alt="+"/>
                        </button>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        SHADOW_MODAL_IS_VISIBLE: state.app.SHADOW_MODAL_IS_VISIBLE,
    }
}

export default connect(mapStateToProps)(TaskInput);
import React from "react";
import {connect} from "react-redux";

export class TaskInput extends React.Component{
    constructor(props) {
        super(props);
        this.taskList = this.props.taskList;
        this.addTask = this.addTask.bind(this);
    }

    addTask(e) {
        e.preventDefault();

        let taskText = e.target['task_input_field'].value;

        if (taskText) {
            this.taskList.current.addTask(taskText);
        }
        e.target.reset();
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
                            disabled={taskInputFieldDisabled}
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
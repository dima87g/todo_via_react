import React from "react";
import {connect} from "react-redux";
import {hideTaskEditField, showShadowModal, showTaskEditField} from "../redux/actions/actions";
import {isInternetExplorer} from "../todo_functions";



class TaskReact extends React.Component {
    constructor(props) {
        super(props);
        this.app = this.props.app;
        this.login = this.props.login;
        this.taskList = this.props.taskList;
        this.taskInst = this.props.taskInst;
        this.id = this.props.taskId;
        this.state = {
            taskTextValue: this.props.taskText,
            taskTextShowed: true,
            subtaskDivShowed: false,
            addSubtaskDivShowed: false,
            removeTaskButtonShowed: true,
            removeTaskButtonDisabled: false,
            addSubtaskButtonShowed: false,
            addSubtaskButtonDisabled: true,
            editTaskDivShowed: false,
        }
        this.finishTask = this.finishTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.showEditTaskField = this.showEditTaskField.bind(this);
        this.taskEditKeydown = this.taskEditKeydown.bind(this);
        this.showSubtaskField = this.showSubtaskField.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.addSubtaskByEnterKey = this.addSubtaskByEnterKey.bind(this);
        this.swapTasks  = this.swapTasks .bind(this);
        this.moveToTop = this.moveToTop.bind(this);
        this.taskDiv = React.createRef();
        this.addSubtaskField = React.createRef();
        this.editTaskField = React.createRef();
        this.sideClick = this.sideClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.taskInst !== this.props.taskInst) {
            this.taskInst = this.props.taskInst;
            this.id = this.props.taskId;
            this.setState({
                taskTextValue: this.props.taskText,
            });
        }
        if (this.props.TASK_EDIT_FIELD_IS_SHOWING) {
            this.editTaskField.current.focus();
        }
    }

    sideClick(e) {
        if (e.target.id === 'shadow') {
            this.showEditTaskField();
        }
    }

    finishTask() {
        this.taskList.finishTask(this);
    }

    removeTask() {
        if (this.props.status === true) {
            this.taskList.removeTask(this);
        }
    }

    forceRemoveTask() {
        this.taskList.removeTask(this);
    }

    showSubtaskField() {
        if (this.state.addSubtaskDivShowed === false) {
            this.props.dispatch(showShadowModal(true));
            this.setState({
                taskTextShowed: false,
                addSubtaskDivShowed: true,
                addSubtaskButtonDisabled: false,
                removeTaskButtonShowed: false,
                removeTaskButtonDisabled: true,
            });
        } else {
            this.props.dispatch(showShadowModal(false));
            this.setState({
                taskTextShowed: true,
                addSubtaskDivShowed: false,
                addSubtaskButtonDisabled: true,
                removeTaskButtonShowed: true,
                removeTaskButtonDisabled: false,
            });
            this.addSubtaskField.current.value = '';
        }
    }

    addSubtask() {
        if (this.addSubtaskField.current.value) {
            let subtaskText = this.addSubtaskField.current.value;
            this.addSubtaskField.current.value = '';

            this.showSubtaskField();

            this.taskList.addSubtask(this.id, subtaskText);

        }
    }

    addSubtaskByEnterKey(e) {
        if (e.keyCode === 13) {
            this.addSubtask();
        }
    }

    showEditTaskField() {
        if (this.props.TASK_EDIT_FIELD_IS_SHOWING === false) {
            this.props.dispatch(showTaskEditField());
            document.addEventListener('click', this.sideClick);
            this.setState({
                taskTextShowed: false,
                editTaskDivShowed: true,
                removeTaskButtonShowed: false,
                removeTaskButtonDisabled: true,
            });
            this.editTaskField.current.value = this.state.taskTextValue;
        } else {
            document.removeEventListener('click', this.sideClick);
            if (this.editTaskField.current.value === '') {
                this.setState({
                    taskTextValue: '',
                });
                this.forceRemoveTask();
            } else if (this.editTaskField.current.value !== this.state.taskTextValue) {
                let sendData = {
                    'taskId': this.props.taskId,
                    'taskText': this.editTaskField.current.value,
                };

                const responseHandler = (response) => {
                    if (response.status === 200 && response.data['ok'] === true) {
                        this.setState({
                            taskTextValue: this.editTaskField.current.value,
                        })
                        this.taskInst.text = this.editTaskField.current.value;
                    }
                }
                this.app.knockKnock('/save_edit_task', responseHandler, sendData);
            }
            this.props.dispatch(hideTaskEditField());
            this.setState({
                taskTextShowed: true,
                editTaskDivShowed: false,
                removeTaskButtonShowed: true,
                removeTaskButtonDisabled: false,
            });
        }
    }

    taskEditKeydown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.showEditTaskField();
        } else {
            this.editTaskField.current.style.height = '14px';
            this.editTaskField.current.style.height = this.editTaskField.current.scrollHeight + 'px';
        }
    }

    swapTasks (e) {
        let taskMoveDirection = e.currentTarget.value;

        this.taskList.swapTasks (this, taskMoveDirection);
    }

    moveToTop() {
        this.taskList.moveToTop(this);
    }

    render() {
        let taskMoveButtonDisabled;
        let taskUpMoveButtonFunction;
        let taskStyle;
        // let addSubtaskDivStyle;
        // let showSubtaskDivButtonStyle;
        // let addSubtaskTextFieldStyle;
        // let addSubtaskButtonStyle;
        let taskTextStyle;
        let removeTaskButtonStyle;
        let editTaskDivStyle;
        let editTaskTextFieldStyle;
        let saveEditButtonStyle;
        let saveEditButtonDisabled;

        if (this.props.TASK_IS_MOVING === true || this.props.TASK_IS_REMOVING === true) {
            taskMoveButtonDisabled = true;
            if (this.props.TASK_IS_MOVING === true) {
                if (this.props.MOVING_TASK_ID === this.id) {
                    taskStyle = 'task active_moving_task';
                } else {
                    taskStyle = 'task';
                }
                if (this.props.TASK_MOVING_DOWN_ID === this.id) {
                    let taskMovingUp = this.taskDiv.current.nextElementSibling;
                    let taskMovingDownHeight = this.taskDiv.current.offsetHeight;
                    let taskMovingUpHeight = taskMovingUp.offsetHeight;
                    this.taskDiv.current.style.transitionDuration = '0.3s';
                    taskMovingUp.style.transitionDuration = '0.3s';
                    if (isInternetExplorer()) {
                        this.taskDiv.current.style.transform = 'translateY(' + taskMovingUpHeight + 'px) translateY(10px)';
                        taskMovingUp.style.transform = 'translateY(-' + taskMovingDownHeight + 'px) translateY(-10px)';
                    } else {
                        this.taskDiv.current.style.transform = 'translateY(calc(' + taskMovingUpHeight + 'px + 10px))';
                        taskMovingUp.style.transform = 'translateY(calc(-' + taskMovingDownHeight + 'px - 10px))';
                    }
                }
            } else if (this.taskDiv.current && this.taskDiv.current.nextElementSibling) {
                let taskMovingUp = this.taskDiv.current.nextElementSibling;
                this.taskDiv.current.style.transitionDuration = '';
                this.taskDiv.current.style.transform = '';
                taskMovingUp.style.transitionDuration = '';
                taskMovingUp.style.transform = '';
            }
        } else if (this.taskDiv.current) {
            taskStyle = 'task';
            this.taskDiv.current.style.transitionDuration = '';
            this.taskDiv.current.style.transform = '';
        } else {
            taskStyle = 'task';
        }

        // if (this.state.addSubtaskDivShowed) {
        //     addSubtaskDivStyle = 'subtask_div';
        //     showSubtaskDivButtonStyle = 'show_subtask_div_button';
        //     addSubtaskTextFieldStyle = 'add_subtask_text_field';
        //     addSubtaskButtonStyle = 'add_subtask_button';
        // } else {
        //     addSubtaskDivStyle = 'subtask_div subtask_div_hidden';
        //     showSubtaskDivButtonStyle = 'show_subtask_div_button show_subtask_div_button_hidden'
        //     addSubtaskTextFieldStyle = 'add_subtask_text_field add_subtask_text_field_hidden';
        //     addSubtaskButtonStyle = 'add_subtask_button add_subtask_button_hidden';
        // }

        if (this.state.editTaskDivShowed) {
            editTaskDivStyle = 'edit_task_div';
            editTaskTextFieldStyle = 'edit_task_text_field';
            saveEditButtonStyle = 'save_edit_button';
            saveEditButtonDisabled = false;
            this.editTaskField.current.style.height = this.editTaskField.current.scrollHeight + 'px';
        } else {
            editTaskDivStyle = 'edit_task_div edit_task_div_hidden';
            editTaskTextFieldStyle = 'edit_task_text_field edit_task_text_field_hidden';
            saveEditButtonStyle = 'save_edit_button save_edit_button_hidden';
            saveEditButtonDisabled = true;
        }

        if (this.state.taskTextShowed) {
            taskTextStyle = 'task_text';
        } else {
            taskTextStyle = 'task_text task_text_hidden';
        }

        if (this.state.removeTaskButtonShowed) {
            removeTaskButtonStyle = 'remove_task_button';
        } else  {
            removeTaskButtonStyle = 'remove_task_button remove_task_button_hidden';
        }

        if (this.props.MOVE_TASK_TO_TOP_BY_UP_BUTTON) {
            taskUpMoveButtonFunction = this.moveToTop;
        } else {
            taskUpMoveButtonFunction = this.swapTasks ;
        }

        if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM && this.taskInst.status) {
            taskMoveButtonDisabled = true;
        }

        return (
            <div className={taskStyle}
                 ref={this.taskDiv}
            >
                <button className={'task_moving_buttons'}
                        type={'button'}
                        value={'UP'}
                        disabled={taskMoveButtonDisabled}
                        onClick={taskUpMoveButtonFunction}
                >
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                </button>
                <div className={this.props.status === false ? 'task_div_content' : 'task_div_content finished_task'}>
                    <button className={'task_finish_button'}
                            type={'button'}
                            onClick={this.finishTask}>
                        <img src="/static/icons/check.svg" alt="V"/>
                    </button>
                    {/*<button className={showSubtaskDivButtonStyle}*/}
                    {/*        onClick={this.showSubtaskField}*/}
                    {/*        disabled={true}>*/}
                    {/*    +*/}
                    {/*</button>*/}
                    <p className={taskTextStyle}
                       onClick={this.showEditTaskField}>{this.state.taskTextValue}</p>
                    <button className={removeTaskButtonStyle}
                            type={'button'}
                            onClick={this.removeTask}
                            disabled={this.state.removeTaskButtonDisabled}>
                        <img src="/static/icons/delete.svg" alt=""/>
                    </button>
                    {/*<div className={addSubtaskDivStyle}>*/}
                    {/*    <input className={addSubtaskTextFieldStyle}*/}
                    {/*           type={"text"}*/}
                    {/*           maxLength={255}*/}
                    {/*           onKeyDown={this.addSubtaskByEnterKey}*/}
                    {/*           ref={this.addSubtaskField}/>*/}
                    {/*    <button className={addSubtaskButtonStyle}*/}
                    {/*            type={'button'}*/}
                    {/*            disabled={this.state.addSubtaskButtonDisabled}*/}
                    {/*            onClick={this.addSubtask}>*/}
                    {/*        <img src="/static/icons/add_sub.svg" alt="+"/>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    <div className={editTaskDivStyle}>
                        <textarea
                            className={editTaskTextFieldStyle}
                            maxLength={255}
                            rows={1}
                            ref={this.editTaskField}
                            onKeyDown={this.taskEditKeydown}
                        />
                        <button className={saveEditButtonStyle}
                                type={'button'}
                                onClick={this.showEditTaskField}
                                disabled={saveEditButtonDisabled}>
                            <img src='/static/icons/edit.svg' alt='+'/>
                        </button>
                    </div>
                </div>
                <button className={'task_moving_buttons'}
                        type={'button'}
                        value={'DOWN'}
                        disabled={taskMoveButtonDisabled}
                        onClick={this.swapTasks}>
                    <i className="fas fa-angle-double-down"/>
                    <i className="fas fa-angle-double-down"/>
                    <i className="fas fa-angle-double-down"/>
                    <i className="fas fa-angle-double-down"/>
                    <i className="fas fa-angle-double-down"/>
                    <i className="fas fa-angle-double-down"/>
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        TASK_IS_MOVING: state.app.TASK_IS_MOVING,
        TASK_MOVING_UP_ID: state.app.TASK_MOVING_UP_ID,
        TASK_MOVING_DOWN_ID: state.app.TASK_MOVING_DOWN_ID,
        MOVING_TASK_ID: state.app.MOVING_TASK_ID,
        TASK_EDIT_FIELD_IS_SHOWING: state.app.TASK_EDIT_FIELD_IS_SHOWING,
        MOVE_TASK_TO_TOP_BY_UP_BUTTON: state.settings.MOVE_TASK_TO_TOP_BY_UP_BUTTON,
        MOVE_FINISHED_TASKS_TO_BOTTOM: state.settings.MOVE_FINISHED_TASKS_TO_BOTTOM,
    }
}

export default connect(mapStateToProps)(TaskReact);

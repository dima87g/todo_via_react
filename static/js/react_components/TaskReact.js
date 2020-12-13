import {showInfoWindow} from "../todo_functions";
import {registry} from "../main";

export class TaskReact extends React.Component {
    constructor(props) {
        super(props);
        this.taskInst = this.props.taskInst;
        this.taskId = this.props.taskId;
        this.state = {
            status: this.props.status,
            taskTextValue: this.props.taskText,
            taskTextShowed: true,
            subtaskDivShowed: false,
            addSubtaskDivShowed: false,
            removeTaskButtonShowed: true,
            removeTaskButtonDisabled: false,
            addSubtaskButtonShowed: false,
            addSubtaskButtonDisabled: true,
            editTaskDivShowed: false,
            saveEditButtonDisabled: true,
        }
        this.finishTask = this.finishTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.showEditTaskField = this.showEditTaskField.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.showSubtaskField = this.showSubtaskField.bind(this);
        this.addSubtask = this.addSubtask.bind(this);
        this.addSubtaskByEnterKey = this.addSubtaskByEnterKey.bind(this);
        this.moveTask = this.moveTask.bind(this);
        this.taskDiv = React.createRef();
        this.addSubtaskField = React.createRef();
        this.editTaskField = React.createRef();
    }

    componentDidMount() {
        // console.log(this.taskId + ' is mounted!');
    }

    componentDidUpdate() {
        // console.log('My height is ' + this.taskDiv.current.clientHeight + ' !');
        // console.log(this.taskId + ' is updated!');
        // if (this.props.movingTasks.activeMovingTaskId === this.taskId) {
        //     console.log('I am active moving task!');
        // }
        // if (this.props.movingTasks.taskMovingUpId === this.taskId) {
        //     console.log('I am moving up!');
        // }
        // if (this.props.movingTasks.taskMovingDownId === this.taskId) {
        //     console.log('I am moving down!');
        // }
    }

    // componentWillUnmount() {
    //     console.log(this.taskId + ' will unmounted!');
    // }

    /**
     * POST: json = {'task_id': 'number', 'status': 'boolean'}
     * GET:
     * if OK = true: json = {'ok': true}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    finishTask() {
        let taskStatus = this.state.status === false;
        let sendData = {
            'taskId': this.taskId,
            'status': taskStatus
        };
        const finish = (answer) => {
            if (answer.status === 200) {
                this.setState({
                    status: taskStatus
                });
            } else if (answer.status === 401) {
                registry.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        registry.app.knockKnock('/finish_task', finish, sendData);
    }

    removeTask() {
        registry.taskList.removeTask(this.taskInst);
    }

    showSubtaskField() {
        if (this.state.addSubtaskDivShowed === false) {
            registry.app.showShadowModal();
            this.setState({
                taskTextShowed: false,
                addSubtaskDivShowed: true,
                addSubtaskButtonDisabled: false,
                removeTaskButtonShowed: false,
                removeTaskButtonDisabled: true,
            });
        } else {
            registry.app.hideShadowModal();
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

            registry.taskList.addSubtask(this.taskId, subtaskText);

        }
    }

    addSubtaskByEnterKey(e) {
        if (e.keyCode === 13) {
            this.addSubtask();
        }
    }

    showEditTaskField() {
        if (this.state.editTaskDivShowed === false) {
            registry.app.showShadowModal();
            this.setState({
                taskTextShowed: false,
                editTaskDivShowed: true,
                saveEditButtonDisabled: false,
                removeTaskButtonShowed: false,
                removeTaskButtonDisabled: true,
            });
            this.editTaskField.current.value = this.state.taskTextValue;
        } else {
            if (this.editTaskField.current.value !== this.state.taskTextValue) {
                let sendData = {
                    'taskId': this.props.taskId,
                    'taskText': this.editTaskField.current.value
                };

                const responseHandler = (response) => {
                    if (response.status === 200 && response.data['ok'] === true) {
                        this.setState({
                            taskTextValue: this.editTaskField.current.value,
                        })
                    } else if (response.status === 401) {
                        registry.login.forceLogOut();
                        showInfoWindow('Authorisation problem!');
                    }
                }
                registry.app.knockKnock('/save_edit_task', responseHandler, sendData);
            }
            registry.app.hideShadowModal();
            this.setState({
                taskTextShowed: true,
                editTaskDivShowed: false,
                saveEditButtonDisabled: true,
                removeTaskButtonShowed: true,
                removeTaskButtonDisabled: false,
            });
        }
    }

    saveEdit(e) {
        if (e.keyCode === 13) {
            this.showEditTaskField();
        }
    }

    moveTask(e) {
        let taskMoveDirection = e.currentTarget.value;

        registry.taskList.moveTask(this, taskMoveDirection);

    }

    render() {
        let taskMoveButtonDisabled;
        let taskStyle;
        let addSubtaskDivStyle;
        let showSubtaskDivButtonStyle;
        let addSubtaskTextFieldStyle;
        let addSubtaskButtonStyle;
        let taskTextStyle;
        let removeTaskButtonStyle;
        let editTaskDivStyle;
        let editTaskTextFieldStyle;
        let saveEditButtonStyle;

        taskMoveButtonDisabled = this.props.movingTasks.moving === true;

        if (this.props.movingTasks.activeMovingTaskId === this.taskId) {
            taskStyle = 'task active_moving_task';
        } else {
            taskStyle = 'task';
        }

        if (this.props.movingTasks.taskMovingUpId === this.taskId) {
            // taskStyle = 'task task_moving_up';
        } else if (this.props.movingTasks.taskMovingDownId === this.taskId) {
            let taskMovingUp = this.taskDiv.current.nextElementSibling;
            let taskMovingDownHeight = this.taskDiv.current.clientHeight;
            let taskMovingUpHeight = taskMovingUp.clientHeight;
            // taskStyle = 'task task_moving_down';
            this.taskDiv.current.style.transitionDuration = '0.3s';
            this.taskDiv.current.style.transform = 'translateY(calc(' + taskMovingUpHeight + 'px + 10px))';
            taskMovingUp.style.transitionDuration = '0.3s';
            taskMovingUp.style.transform = 'translateY(calc(-' + taskMovingDownHeight + 'px - 10px))';
        } else {
            // taskStyle = 'task';
            if (this.taskDiv.current && this.taskDiv.current.nextElementSibling) {
                let taskMovingUp = this.taskDiv.current.nextElementSibling;
                this.taskDiv.current.style.transitionDuration = '0s';
                this.taskDiv.current.style.transform = '';
                taskMovingUp.style.transitionDuration = '0s';
                taskMovingUp.style.transform = '';
            } else if (this.taskDiv.current) {
                this.taskDiv.current.style.transitionDuration = '0s';
                this.taskDiv.current.style.transform = '';
            }
        }

        if (this.state.addSubtaskDivShowed) {
            addSubtaskDivStyle = 'subtask_div';
            showSubtaskDivButtonStyle = 'show_subtask_div_button';
            addSubtaskTextFieldStyle = 'add_subtask_text_field';
            addSubtaskButtonStyle = 'add_subtask_button';
        } else {
            addSubtaskDivStyle = 'subtask_div subtask_div_hidden';
            showSubtaskDivButtonStyle = 'show_subtask_div_button show_subtask_div_button_hidden'
            addSubtaskTextFieldStyle = 'add_subtask_text_field add_subtask_text_field_hidden';
            addSubtaskButtonStyle = 'add_subtask_button add_subtask_button_hidden';
        }

        if (this.state.editTaskDivShowed) {
            editTaskDivStyle = 'edit_task_div';
            editTaskTextFieldStyle = 'edit_task_text_field';
            saveEditButtonStyle = 'save_edit_button';
        } else {
            editTaskDivStyle = 'edit_task_div edit_task_div_hidden';
            editTaskTextFieldStyle = 'edit_task_text_field edit_task_text_field_hidden';
            saveEditButtonStyle = 'save_edit_button save_edit_button_hidden';
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

        return (
            <div className={taskStyle}
                 ref={this.taskDiv}
            >
                <button className={'task_moving_buttons'}
                        type={'button'}
                        value={'UP'}
                        disabled={taskMoveButtonDisabled}
                        onClick={this.moveTask}>
                    {/*&#129089;&#129089;&#129089;*/}
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                    <i className="fas fa-angle-double-up"/>
                </button>
                <div className={this.state.status === false ? 'task_div_content' : 'task_div_content finished_task'}>
                    <button className={'task_finish_button'}
                            type={'button'}
                            onClick={this.finishTask}>
                        <img src="/static/icons/check.svg" alt="V"/>
                    </button>
                    <button className={showSubtaskDivButtonStyle}
                            onClick={this.showSubtaskField}
                            disabled={true}>
                        +
                    </button>
                    <p className={taskTextStyle}
                       onClick={this.showEditTaskField}>{this.state.taskTextValue}</p>
                    <button className={removeTaskButtonStyle}
                            type={'button'}
                            onClick={this.removeTask}
                            disabled={this.state.removeTaskButtonDisabled}>
                        <img src="/static/icons/delete.svg" alt=""/>
                    </button>
                    <div className={addSubtaskDivStyle}>
                        <input className={addSubtaskTextFieldStyle}
                               type="text"
                               onKeyDown={this.addSubtaskByEnterKey}
                               ref={this.addSubtaskField}/>
                        <button className={addSubtaskButtonStyle}
                                type={'button'}
                                disabled={this.state.addSubtaskButtonDisabled}
                                onClick={this.addSubtask}>
                            <img src="/static/icons/add_sub.svg" alt="+"/>
                        </button>
                    </div>
                    <div className={editTaskDivStyle}>
                        <textarea className={editTaskTextFieldStyle}
                               ref={this.editTaskField}
                               onKeyDown={this.saveEdit}
                        />
                        <button className={saveEditButtonStyle}
                                type={'button'}
                                onClick={this.showEditTaskField}
                                disabled={this.state.saveEditButtonDisabled}>
                            <img src='/static/icons/edit.svg' alt='+'/>
                        </button>
                    </div>
                </div>
                <button className={'task_moving_buttons'}
                        type={'button'}
                        value={'DOWN'}
                        disabled={taskMoveButtonDisabled}
                        onClick={this.moveTask}>
                    {/*&#129091;&#129091;&#129091;*/}
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
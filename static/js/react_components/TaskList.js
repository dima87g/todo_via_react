import React from "react";
import {connect} from "react-redux";
import {moveTask, removeTask, showInfoWindow} from "../redux/actions";
import {findPosition, swap} from "../todo_functions";
import {Task} from "../todo_classes";
import TaskReact from "./TaskReact";



class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.app = this.props.app;
        this.login = this.props.login;
        this.tasksFromServer = [];
        this.tasksTree = new Map();
        this.rootTasksList = [];

        this.state = {
            linearTasksList: this.rootTasksList,
        }
        this.addTask = this.addTask.bind(this);
        // this.addSubtask = this.addSubtask.bind(this);
        this.removeTask = this.removeTask.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.TASKS_FROM_SERVER !== nextProps.TASKS_FROM_SERVER && nextProps.TASKS_FROM_SERVER) {
            this.tasksFromServer = nextProps.TASKS_FROM_SERVER;
            this.tasksTree = new Map();
            this.rootTasksList = [];

            this.tasksFromServer.sort(function (a, b) {
            if (a['task_position'] && b['task_position']) {
                return a['task_position'] - b['task_position'];
            } else if (!a['task_position'] && !b['task_position']) {
                return a['task_id'] - b['task_id'];
            } else if (!a['task_position']) {
                return a['task_id'] - b['task_position'];
            } else if (!b['task_position']) {
                return a['task_position'] - b['task_id'];
            }
            return 0;
            });

            for (let task of this.tasksFromServer) {
                let taskId = task['task_id'];
                let taskText = task['task_text'];
                let taskStatus = task['task_status'];
                let taskParentId = task['parent_id'];
                let taskPosition = task['task_position'];

                this.tasksTree.set(taskId, new Task(taskId, taskText, taskPosition, taskParentId, taskStatus));
            }

            for (let task of this.tasksTree.values()) {
                if (this.tasksTree.has(task.parentId)) {
                    this.tasksTree.get(task.parentId).subtasks.push(task);
                } else {
                    this.rootTasksList.push(task);
                }
            }
            this.setState({
                linearTasksList: this.rootTasksList,
            });
        }
        return true;
    }

    // makeLinearList(tasksList) {
    //     let linearTasksList = [];
    //
    //     function recursionWalk(tasksList) {
    //         for (let task of tasksList) {
    //             linearTasksList.push(task);
    //             if (task.subtasks.length > 0) {
    //                 recursionWalk(task.subtasks);
    //             }
    //         }
    //     }
    //     recursionWalk(tasksList);
    //
    //     return linearTasksList;
    // }

    /**
     *
     * @param task
     * @param taskMoveDirection
     */
    moveTask(task, taskMoveDirection) {
        let taskList;
        let currentTask = task.taskInst;
        let currentTaskIndex;
        let currentTaskId = currentTask.id
        let currentTaskPosition = currentTask.position ? currentTask.position : currentTaskId;
        let taskToSwap;
        let taskToSwapIndex;
        let taskToSwapId;
        let taskToSwapPosition;
        let taskMovingUpId;
        let taskMovingDownId;

        if (currentTask.parentId) {
            taskList = this.tasksTree.get(currentTask.parentId).subtasks;
        } else {
            taskList = this.rootTasksList;
        }

        currentTaskIndex = findPosition(taskList, currentTask);

        if (taskMoveDirection === 'UP') {
            if (currentTaskIndex > 0 && currentTaskIndex !== -1) {
                taskToSwapIndex = currentTaskIndex - 1;
                taskToSwap = taskList[taskToSwapIndex]
                taskToSwapId = taskToSwap.id;
                taskToSwapPosition = taskToSwap.position ? taskToSwap.position : taskToSwapId;
                taskMovingUpId = currentTaskId;
                taskMovingDownId = taskToSwapId;
            }
        } else if (taskMoveDirection === 'DOWN') {
            if (currentTaskIndex < taskList.length - 1 && currentTaskIndex !== -1) {
                taskToSwapIndex = currentTaskIndex + 1;
                taskToSwap = taskList[taskToSwapIndex];
                taskToSwapId = taskToSwap.id;
                taskToSwapPosition = taskToSwap.position ? taskToSwap.position: taskToSwapId;
                taskMovingUpId = taskToSwapId;
                taskMovingDownId = currentTaskId;
            }
        } else {
            return;
        }
        let sendData = {
            'currentTaskId': currentTaskId,
            'currentTaskPosition': currentTaskPosition,
            'taskToSwapId': taskToSwapId,
            'taskToSwapPosition': taskToSwapPosition,
        }

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                currentTask.position = taskToSwapPosition;
                taskToSwap.position = currentTaskPosition;

                this.props.dispatch(moveTask(true, taskMovingUpId, taskMovingDownId, currentTaskId));
                setTimeout(()=>{
                    this.setState({
                        linearTasksList: swap(taskList, currentTaskIndex, taskToSwapIndex),
                    });
                    this.props.dispatch(moveTask(false, null, null, null));
                }, 300);
            }
        }
        this.app.knockKnock('/change_position', responseHandler, sendData);
    }

    /**
     * POST: json = {'taskText': 'string', 'parentId' = 'number'}
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    addTask(taskText) {
        let sendData = {
            'listId': this.props.LIST_ID,
            'taskText': taskText,
            'parentId': null
        };

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let taskId = response.data['task_id'];
                let taskPosition = taskId;
                let newTask = new Task(taskId, taskText, taskPosition);

                this.tasksTree.set(newTask.id, newTask);
                this.rootTasksList.push(newTask);

                this.setState({
                    // linearTasksList: this.makeLinearList(this.rootTasksList),
                    linearTasksList: this.rootTasksList,
                })
            } else if (response.status === 401) {
                this.login.current.forceLogOut();
                this.props.dispatch(showInfoWindow(true, 'Authorisation problem!'));
            } else if (response.status === 204) {
                this.props.dispatch(showInfoWindow(true, localisation['error_messages']['list_is_not_exists']))
            } else {
                this.props.dispatch(showInfoWindow(true, 'Some problem!'));
            }
        }
        this.app.knockKnock('/save_task', responseHandler, sendData);
    }

    /**
     * POST: json = {'taskText': 'string', 'parentId' = 'number'}
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    // addSubtask(subtaskParentId, subtaskText) {
    //     let sendData = {'taskText': subtaskText, 'parentId': subtaskParentId}
    //
    //     const add = (answer) => {
    //         if (answer.status === 200) {
    //             let taskId = answer.data['task_id'];
    //             let newTask = new Task(taskId, subtaskText, subtaskParentId);
    //
    //             this.tasksTree.set(taskId, newTask);
    //             this.tasksTree.get(subtaskParentId).subtasks.push(newTask);
    //
    //             this.setState({
    //                 linearTasksList : this.makeLinearList(this.rootTasksList),
    //             })
    //         } else if (answer.status === 401) {
    //             this.login.current.forceLogOut();
    //             this.props.dispatch(showInfoWindow(true, 'Authorisation problem!'));
    //         }
    //     }
    //     this.app.knockKnock('/save_task', add, sendData);
    // }

    /**
     * POST: {taskId: 'number'}
     * GET:
     * if OK = true: json = {'ok': true}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     * @param task
     */
    removeTask(task) {
        let sendData = {'taskId': task.id}
        const responseHandler = (answer) => {
            if (answer.status === 200 && answer.data['ok'] === true) {
                // if (this.tasksTree.has(task.taskInst.parentId)) {
                //     let childrenList = this.tasksTree.get(task.taskInst.parentId).subtasks;
                //     childrenList.splice(childrenList.indexOf(task.taskInst), 1);
                // } else {
                //     this.rootTasksList.splice(this.rootTasksList.indexOf(task.taskInst), 1);
                // }

                let removingTaskId = task.id;
                let removingTaskPosition = task.taskInst.position;
                let removingTaskHeight = task.taskDiv.current.offsetHeight;
                
                this.props.dispatch(removeTask(true, removingTaskId, removingTaskPosition, removingTaskHeight));

                setTimeout(() => {
                    this.rootTasksList.splice(findPosition(this.rootTasksList, task.taskInst), 1);
                    this.tasksTree.delete(task.id);

                    this.setState({
                        // linearTasksList: this.makeLinearList(this.rootTasksList),
                        linearTasksList: this.rootTasksList,
                    });
                    this.props.dispatch(removeTask(false, null, null, null));
                }, 500);
            } else if (answer.status === 401) {
                this.login.current.forceLogOut();
                this.props.dispatch(showInfoWindow(true, 'Authorisation problem!'));
            }
        }
        this.app.knockKnock('/delete_task', responseHandler, sendData);
    }

    render() {
        return (
            <div className={'task_list'} id={'task_list'}>
                {this.state.linearTasksList.map((task) =>
                    <TaskReact key={task.id.toString()}
                               app={this.app}
                               login={this.login}
                               taskList={this}
                               taskInst={task}
                               taskId={task.id}
                               status={task.status}
                               taskText={task.text}
                               parentId={task.parentId}
                    />)}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        LIST_ID: state.login.LIST_ID,
        TASKS_FROM_SERVER: state.login.TASKS_FROM_SERVER,
    }
}

export default connect(mapStateToProps, null, null, {forwardRef: true})(TaskList);
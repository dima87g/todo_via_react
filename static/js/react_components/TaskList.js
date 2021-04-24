import React from "react";
import {connect} from "react-redux";
import {moveTask, removeTask, showInfoWindow} from "../redux/actions";
import {findIndex, moveToStart, swap} from "../todo_functions";
import {Task} from "../todo_classes";
import TaskReact from "./TaskReact";



class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.app = this.props.app;
        this.appRef = this.props.appRef;
        this.login = this.props.login;
        this.tasksFromServer = [];
        this.tasksTree = new Map();
        this.rootTasksList = [];

        this.state = {
            linearTaskList: this.rootTasksList,
        }
        this.finishTask = this.finishTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.taskListRef = React.createRef();
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
                linearTaskList: this.rootTasksList,
            });
        }
        return true;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.linearTaskList !== this.state.linearTaskList) {
            // return this.taskListRef.current.scrollHeight - this.appRef.current.scrollTop;
            return this.appRef.current.scrollTop;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            // console.log(this.taskListRef.current.scrollHeight - snapshot);
            // this.appRef.current.scrollTop = this.taskListRef.current.scrollHeight - snapshot;
            this.appRef.current.scrollTop = snapshot;
        }
    }

    /**
     * POST: json = {'task_id': 'number', 'status': 'boolean'}
     * GET:
     * if OK = true: json = {'ok': true}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    finishTask(task) {
        let taskStatus = task.taskInst.status === false;
        const sendData = {
            'taskId': task.id,
            'status': taskStatus
        }
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                task.taskInst.status = taskStatus
                let taskList = [...this.state.linearTaskList];
                this.setState({
                    linearTaskList: taskList
                });
            }
        }
        this.app.knockKnock('/finish_task', responseHandler, sendData);
    }

    /**
     * POST: json = {
     *     listId: 'number',
     *     currentTaskId: 'number',
     *     currentTaskOldPosition: 'number',
     *     currentTaskNewPosition: 'number'
     * }
     * RESPONSE:
     * if OK === true: json = {
     *     'ok': 'boolean'
     * }
     * if OK === false: json = {
     *     'ok': 'boolean'
     * }
     * @param task {TaskReact} Task instance of React.Component
     * @param taskMoveDirection {string}
     */
    moveTask(task, taskMoveDirection) {
        let taskList;
        let currentTask = task.taskInst;
        let currentTaskId = currentTask.id;
        let currentTaskOldPosition = currentTask.position;
        let currentTaskIndex;
        let currentTaskNewPosition;
        let taskToSwap;
        let taskToSwapIndex;
        let taskToSwapId;
        let taskMovingUpId;
        let taskMovingDownId;

        if (currentTask.parentId) {
            taskList = this.tasksTree.get(currentTask.parentId).subtasks;
        } else {
            taskList = [...this.state.linearTaskList];
        }

        currentTaskIndex = findIndex(taskList, currentTask);

        if (taskMoveDirection === 'UP' && currentTaskIndex > 0) {
            taskToSwapIndex = currentTaskIndex - 1;
            taskToSwap = taskList[taskToSwapIndex]
            taskToSwapId = taskToSwap.id;
            currentTaskNewPosition = taskToSwap.position;
            taskMovingUpId = currentTaskId;
            taskMovingDownId = taskToSwapId;
        } else if (taskMoveDirection === 'DOWN' && currentTaskIndex < taskList.length - 1) {
            taskToSwapIndex = currentTaskIndex + 1;
            taskToSwap = taskList[taskToSwapIndex];
            taskToSwapId = taskToSwap.id;
            currentTaskNewPosition = taskToSwap.position;
            taskMovingUpId = taskToSwapId;
            taskMovingDownId = currentTaskId;
        } else {
            return;
        }
        let sendData = {
            'listId': this.props.LIST_ID,
            'currentTaskId': currentTaskId,
            'currentTaskOldPosition': currentTaskOldPosition,
            'currentTaskNewPosition': currentTaskNewPosition
        }

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                currentTask.position = currentTaskNewPosition;
                taskToSwap.position = currentTaskOldPosition;

                this.props.dispatch(moveTask(true, taskMovingUpId, taskMovingDownId, currentTaskId));
                setTimeout(()=>{
                    this.setState({
                        linearTaskList: swap(taskList, currentTaskIndex, taskToSwapIndex),
                    });
                    this.props.dispatch(moveTask(false, null, null, null));
                }, 300);
            }
        }
        this.app.knockKnock('/change_position', responseHandler, sendData);
    }

    /**
     * POST: json = {
     *          listId: 'number',
     *          currentTaskId: 'number,
     *          currentTaskOldPosition: 'number',
     *          currentTaskNewPosition: 'number'
     * }
     * RESPONSE:
     * if OK === true: json = {
     *     'ok': 'boolean'
     * }
     * if OK === false: json = {
     *     'ok': 'boolean'
     * }
     * @param task {TaskReact} Task instance of React.Component
     */
    moveToTop(task) {
        let taskList = [...this.state.linearTaskList];
        let currentTask = task.taskInst;
        let currentTaskId = currentTask.id;
        let currentTaskIndex = findIndex(taskList, currentTask);

        if (taskList.length > 1 && currentTaskIndex > 0) {
            let taskToSwap = taskList[0];
            let currentTaskOldPosition = currentTask.position;
            let currentTaskNewPosition = taskToSwap.position;

            let sendData = {
                'listId': this.props.LIST_ID,
                'currentTaskId': currentTaskId,
                'currentTaskOldPosition': currentTaskOldPosition,
                'currentTaskNewPosition': currentTaskNewPosition
            }
            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {

                    for (let task of taskList) {
                        if (task.position >= currentTaskNewPosition) {
                            task.position += 1;
                        }
                    }
                    currentTask.position = currentTaskNewPosition;

                    this.setState({
                        linearTaskList: moveToStart(taskList, currentTaskIndex),
                    });
                }
            }
            this.app.knockKnock('/change_position', responseHandler, sendData);
        }
    }

    /**
     * POST: json = {
     *          listId: 'number',
     *          taskText: 'string',
     *          parentId: 'number',
     *          taskPosition: 'number'
     * }
     * RESPONSE:
     * if OK = true: json = {
     *                  ok: true,
     *                  task_id: 'number',
     *                  task_position: 'number'
     *              }
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */
    addTask(taskText) {
        let taskPosition;

        if (this.state.linearTaskList.length === 0) {
            taskPosition = 1;
        } else {
            taskPosition = this.state.linearTaskList[this.state.linearTaskList.length - 1].position + 1;
        }
        let sendData = {
            'listId': this.props.LIST_ID,
            'taskText': taskText,
            'parentId': null,
            'taskPosition': taskPosition,
        };

        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                let taskId = response.data['task_id'];
                let taskPosition = response.data['task_position'];
                let newTask = new Task(taskId, taskText, taskPosition);
                let taskList = [...this.state.linearTaskList]

                this.tasksTree.set(newTask.id, newTask);
                taskList.push(newTask);

                this.setState({
                    linearTaskList: taskList,
                })
            } else if (response.status === 204) {
                this.props.dispatch(showInfoWindow(true, localisation['error_messages']['list_is_not_exists']))
            }
        }
        this.app.knockKnock('/save_task', responseHandler, sendData);
    }

    /**
     * POST: json = {
     *          listId: 'number',
     *          taskId: 'number',
     *          taskPosition: 'number'
     *      }
     * GET:
     * if OK = true: json = {'ok': true, 'del_result': 1}
     * if OK = false: json = {
     *                      'ok': 'boolean',
     *                      'del_result': 0,
     *                      'error_code': 'number' or null,
     *                      'error_message': 'string' or null
     *                      }
     * @param task {TaskReact} Task instance of React.Component
     */
    removeTask(task) {
        const sendData = {
            'listId': this.props.LIST_ID,
            'taskId': task.id,
            'taskPosition': task.taskInst.position
        }
        let taskList = [...this.state.linearTaskList];
        const responseHandler = (answer) => {
            if (answer.status === 200 && answer.data['ok'] === true) {
                let removingTaskId = task.id;
                let removingTaskPosition = task.taskInst.position;
                let removingTaskHeight = task.taskDiv.current.offsetHeight;

                this.props.dispatch(removeTask(true, removingTaskId, removingTaskPosition, removingTaskHeight));

                setTimeout(() => {
                    taskList.splice(findIndex(taskList, task.taskInst), 1);

                    this.tasksTree.delete(task.id);

                    for (let task of taskList) {
                        if (task.position > removingTaskPosition) {
                            task.position -= 1;
                        }
                    }

                    this.setState({
                        linearTaskList: taskList,
                    });
                    this.props.dispatch(removeTask(false, null, null, null));
                }, 500);
            } else if (answer.status === 200 && answer.data['del_result'] === 0) {
                this.props.dispatch(showInfoWindow(true, localisation['error_messages']['task_is_not_exists']));
            }
        }
        this.app.knockKnock('/delete_task', responseHandler, sendData);
    }

    render() {
        const LetStart = () => {
            if (this.state.linearTaskList.length === 0) {
                return (
                    <div id={'let_start_div'} className={'let_start_div'}>
                        <img id={'let_start_image'} className={'let_start_image'} src={'static/favicon.ico'} alt={'let`s start!'}/>
                        <p id={'let_start_paragraph'} className={'let_start_paragraph'}>{localisation['start_window']['let_start']}</p>
                    </div>
                )
            } else {
                return null;
            }
        }
        return (
            <div className={'task_list'} id={'task_list'} ref={this.taskListRef}>
                {this.state.linearTaskList.map((task) =>
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
                <LetStart/>
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

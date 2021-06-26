import React from "react";
import {connect} from "react-redux";
import {
    moveTask,
    removeTask,
    showInfoWindow
} from "../redux/actions";
import {
    findIndex,
    getNewPosition,
    moveToStart,
    regularSort,
    swap
} from "../todo_functions";
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
            mainTasksList: [],
            checkedTasksList: [],
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
            let mainTasksList = [];
            let checkedTasksList = [];
            
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

            // if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM === true) {
            //     this.tasksFromServer.sort(function(a, b) {
            //         if (a['task_status'] === true && b['task_status'] === false) {
            //             return 1
            //         }
            //         if (a['task_status'] === false && b['task_status'] === true) {
            //             return -1
            //         }
            //         return 0
            //     });
            // }


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
                    if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM) {
                        if (task.status === true) {
                            checkedTasksList.push(task);
                        } else {
                            mainTasksList.push(task);
                        }
                    } else {
                        // this.rootTasksList.push(task);
                        mainTasksList.push(task);
                    }
                }
            }
            this.setState({
                // linearTaskList: this.rootTasksList,
                mainTasksList: mainTasksList,
                checkedTasksList: checkedTasksList,
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
     * POST: json = {
     *      task_id: 'number',
     *      status: 'boolean'
     * }
     * RESPONSE:
     * if OK = true: json = {
     *      ok: 'boolean'
     * }
     * if OK = false: json = {
     *      ok: 'boolean',
     *      error_code: 'number' or 'null',
     *      error_message: 'string' or 'null'
     * }
     * @param task {TaskReact} Task instance of React.Component
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

                if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM) {
                    let taskInst = task.taskInst;
                    let mainTasksList = [...this.state.mainTasksList];
                    let checkedTasksList = [...this.state.checkedTasksList];

                    if (taskStatus === true) {
                        mainTasksList.splice(findIndex(mainTasksList, taskInst), 1);
                        checkedTasksList.push(taskInst);

                        this.setState({
                            mainTasksList: regularSort(mainTasksList),
                            checkedTasksList: regularSort(checkedTasksList),
                        });
                    } else if (taskStatus === false) {
                        mainTasksList.push(taskInst);
                        checkedTasksList.splice(findIndex(checkedTasksList, taskInst), 1);

                        this.setState({
                            mainTasksList: regularSort(mainTasksList),
                            checkedTasksList: regularSort(checkedTasksList),
                        });
                    }
                } else {
                    let mainTasksList = [...this.state.mainTasksList];
                    this.setState({
                        mainTasksList: mainTasksList,
                    });
                }
            }
        }
        this.app.knockKnock('/finish_task', responseHandler, sendData);
    }

    /**
     *
     * @param {TaskReact} task Task instance of React.Component
     * @param {String} taskMoveDirection String value of task moving direction
     */
    swapTasks(task, taskMoveDirection) {
        let mainTasksList;
        let currentTask = task.taskInst;
        let currentTaskId = currentTask.id;
        let currentTaskPosition = currentTask.position;
        let taskToSwap;
        let taskToSwapId;
        let taskToSwapPosition;
        let taskToSwapIndex;
        let taskMovingUpId;
        let taskMovingDownId;

        if (currentTask.parentId) {
            mainTasksList = this.tasksTree.get(currentTask.parentId).subtasks;
        } else {
            mainTasksList = [...this.state.mainTasksList];
        }

        let currentTaskIndex = findIndex(mainTasksList, currentTask);

        if (taskMoveDirection === "UP" && currentTaskIndex > 0) {
            taskToSwapIndex = currentTaskIndex - 1;
            taskToSwap = mainTasksList[taskToSwapIndex];
            taskToSwapId = taskToSwap.id;
            taskToSwapPosition = taskToSwap.position;
            taskMovingUpId = currentTaskId;
            taskMovingDownId = taskToSwapId;
        } else if (taskMoveDirection === "DOWN" && currentTaskIndex < mainTasksList.length - 1) {
            taskToSwapIndex = currentTaskIndex + 1;
            taskToSwap = mainTasksList[taskToSwapIndex];
            taskToSwapId = taskToSwap.id;
            taskToSwapPosition = taskToSwap.position;
            taskMovingUpId = taskToSwapId;
            taskMovingDownId = currentTaskId;
        } else {
            return;
        }
        const sendData = {
            'listId': this.props.LIST_ID,
            'currentTaskId': currentTaskId,
            'currentTaskPosition': currentTaskPosition,
            'taskToSwapId': taskToSwapId,
            'taskToSwapPosition': taskToSwapPosition
        }
        const responseHandler = (response) => {
            if (response.status === 200 && response.data['ok'] === true) {
                currentTask.position = taskToSwapPosition;
                taskToSwap.position = currentTaskPosition;

                this.props.dispatch(moveTask(true, taskMovingUpId, taskMovingDownId, currentTaskId));
                setTimeout(() => {
                    this.setState({
                        mainTasksList: swap(mainTasksList, currentTaskIndex, taskToSwapIndex)
                    })
                    this.props.dispatch(moveTask(false, null, null, null));
                }, 300);
            }
        }
        this.app.knockKnock('swap_tasks', responseHandler, sendData);
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
        let mainTasksList;
        let checkedTasksList = [];
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
            mainTasksList = this.tasksTree.get(currentTask.parentId).subtasks;
        } else {
            mainTasksList = [...this.state.mainTasksList];
        }

        currentTaskIndex = findIndex(mainTasksList, currentTask);

        if (taskMoveDirection === 'UP' && currentTaskIndex > 0) {
            taskToSwapIndex = currentTaskIndex - 1;
            taskToSwap = mainTasksList[taskToSwapIndex]
            taskToSwapId = taskToSwap.id;
            currentTaskNewPosition = taskToSwap.position;
            taskMovingUpId = currentTaskId;
            taskMovingDownId = taskToSwapId;
        } else if (taskMoveDirection === 'DOWN' && currentTaskIndex < mainTasksList.length - 1) {
            taskToSwapIndex = currentTaskIndex + 1;
            taskToSwap = mainTasksList[taskToSwapIndex];
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

                if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM) {
                    checkedTasksList = [...this.state.checkedTasksList];

                    if (taskMoveDirection === 'UP') {
                        for (let task of checkedTasksList) {
                            if (task.position >= currentTaskNewPosition) {
                                task.position += 1;
                            }
                        }
                    } else if (taskMoveDirection === 'DOWN') {
                        for (let task of checkedTasksList) {
                            if (task.position <= currentTaskNewPosition) {
                                task.position -= 1;
                            }
                        }
                    }
                }
                this.props.dispatch(moveTask(true, taskMovingUpId, taskMovingDownId, currentTaskId));
                setTimeout(()=>{
                    this.setState({
                        mainTasksList: swap(mainTasksList, currentTaskIndex, taskToSwapIndex),
                        checkedTasksList: checkedTasksList,
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
        let mainTasksList = [...this.state.mainTasksList];
        let checkedTasksList = [...this.state.checkedTasksList];
        let currentTask = task.taskInst;
        let currentTaskId = currentTask.id;
        let currentTaskIndex = findIndex(mainTasksList, currentTask);

        if (mainTasksList.length > 1 && currentTaskIndex > 0) {
            let taskToSwap = mainTasksList[0];
            let currentTaskOldPosition = currentTask.position;
            let currentTaskNewPosition = 1;

            let sendData = {
                'listId': this.props.LIST_ID,
                'currentTaskId': currentTaskId,
                'currentTaskOldPosition': currentTaskOldPosition,
                'currentTaskNewPosition': currentTaskNewPosition
            }
            const responseHandler = (response) => {
                if (response.status === 200 && response.data['ok'] === true) {
                    let generalTasksList = mainTasksList.concat(checkedTasksList);

                    for (let task of generalTasksList) {
                        if (task.position >= currentTaskNewPosition && task.position < currentTaskOldPosition) {
                            task.position += 1;
                        }
                    }
                    currentTask.position = currentTaskNewPosition;

                    this.setState({
                        mainTasksList: moveToStart(mainTasksList, currentTaskIndex),
                        checkedTasksList: checkedTasksList,
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
     *      ok: true,
     *      task_id: 'number',
     *      task_position: 'number'
     * }
     * if OK = false: json = {
     *      ok: 'boolean',
     *      error_code: 'number' or null,
     *      error_message: 'string' or null
     * }
     * @param taskText {string}
     */
    addTask(taskText) {
        let taskPosition;

        if (this.state.mainTasksList.length === 0 && this.state.checkedTasksList.length === 0) {
            taskPosition = 1;
        } else {
            if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM) {
                let mainTasksList = [...this.state.mainTasksList];
                let checkedTasksList = [...this.state.checkedTasksList];
                taskPosition = getNewPosition(mainTasksList.concat(checkedTasksList));
            } else {
                let mainTasksList = [...this.state.mainTasksList];
                taskPosition = getNewPosition(mainTasksList);
            }
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
                let mainTasksList = [...this.state.mainTasksList]

                this.tasksTree.set(newTask.id, newTask);
                mainTasksList.push(newTask);

                this.setState({
                    mainTasksList: mainTasksList,
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
        const taskInstance = task.taskInst;
        const sendData = {
            'listId': this.props.LIST_ID,
            'taskId': task.id,
            'taskPosition': taskInstance.position
        }
        const responseHandler = (answer) => {
            if (answer.status === 200 && answer.data['ok'] === true) {
                let removingTaskId = task.id;
                let removingTaskPosition = taskInstance.position;
                let removingTaskHeight = task.taskDiv.current.offsetHeight;

                this.props.dispatch(removeTask(true, removingTaskId, removingTaskPosition, removingTaskHeight));

                setTimeout(() => {
                    let mainTasksList = [...this.state.mainTasksList];

                    if (this.props.MOVE_FINISHED_TASKS_TO_BOTTOM) {
                        let checkedTasksList = [...this.state.checkedTasksList];

                        checkedTasksList.splice(findIndex(checkedTasksList, taskInstance), 1);
                        this.tasksTree.delete(taskInstance.id);

                        for (let task of checkedTasksList) {
                            if (task.position > removingTaskPosition) {
                                task.position -= 1;
                            }
                        }

                        for (let task of mainTasksList) {
                            if (task.position > removingTaskPosition) {
                                task.position -= 1;
                            }
                        }

                        this.setState({
                            mainTasksList: mainTasksList,
                            checkedTasksList: checkedTasksList,
                        });
                    } else {
                        mainTasksList.splice(findIndex(mainTasksList, taskInstance), 1);

                        this.tasksTree.delete(taskInstance.id);

                        for (let task of mainTasksList) {
                            if (task.position > removingTaskPosition) {
                                task.position -= 1;
                            }
                        }

                        this.setState({
                            mainTasksList: mainTasksList,
                        });
                    }
                    this.props.dispatch(removeTask(false, null, null, null));
                }, 500);
            } else if (answer.status === 200 && answer.data['del_result'] === 0) {
                this.app.networkError = true;
                this.props.dispatch(showInfoWindow(true, localisation['error_messages']['task_is_not_exists']));
            }
        }
        this.app.knockKnock('/delete_task', responseHandler, sendData);
    }

    moveCheckedTasksToBottom(value) {
        let mainTasksList = [...this.state.mainTasksList];
        if (value === true) {
            console.log('to bottom sort');
            let checkedTasksList = [];

            for (let i = 0; i < mainTasksList.length; i++) {
                if (mainTasksList[i].status === true) {
                    checkedTasksList.push(mainTasksList[i]);
                    mainTasksList.splice(i, 1);
                    i--;
                }
            }
            this.setState({
                mainTasksList: mainTasksList,
                checkedTasksList: checkedTasksList,
            });
        } else if (value === false) {
            console.log('regular sort');
            let checkedTasksList = [...this.state.checkedTasksList];
            this.setState({
                mainTasksList: regularSort(mainTasksList.concat(checkedTasksList)),
                checkedTasksList: [],
            });
        }
    }

    render() {
        const CheckedTasksSeparator = () => {
            if (this.state.mainTasksList.length > 0 && this.state.checkedTasksList.length > 0) {
                return (
                    <div id={'checked_tasks_separator_div'}
                         className={'checked_tasks_separator_div'}>
                        <p id={'checked_tasks_separator_paragraph'}
                           className={'checked_tasks_separator_paragraph'}>
                            ----------------------------------------
                        </p>
                    </div>
                )
            } else {
                return null;
            }
        }
        const LetStart = () => {
            if (this.state.linearTaskList.length === 0 && (this.state.mainTasksList.length === 0 && this.state.checkedTasksList.length === 0)) {
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
                {/*{this.state.linearTaskList.map((task) =>*/}
                {/*    <TaskReact key={task.id.toString()}*/}
                {/*               app={this.app}*/}
                {/*               login={this.login}*/}
                {/*               taskList={this}*/}
                {/*               taskInst={task}*/}
                {/*               taskId={task.id}*/}
                {/*               status={task.status}*/}
                {/*               taskText={task.text}*/}
                {/*               parentId={task.parentId}*/}
                {/*    />)}*/}
                {this.state.mainTasksList.map((task) =>
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
                <CheckedTasksSeparator/>
                {this.state.checkedTasksList.map((task) =>
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
        MOVE_FINISHED_TASKS_TO_BOTTOM: state.settings.MOVE_FINISHED_TASKS_TO_BOTTOM,
    }
}

export default connect(mapStateToProps, null, null, {forwardRef: true})(TaskList);

import {registry} from "../main";
import {findPosition, showInfoWindow, swap} from "../todo_functions";
import {Task} from "../todo_classes";
import {TaskReact} from "./TaskReact";
import React from "react";

export class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.tasksFromServer = [];
        this.tasksTree = new Map();
        this.rootTasksList = [];

        // this.tasksFromServer.sort(function (a, b) {
        //     if (a['task_position'] && b['task_position']) {
        //         return a['task_position'] - b['task_position'];
        //     } else if (!a['task_position'] && !b['task_position']) {
        //         return a['task_id'] - b['task_id'];
        //     } else if (!a['task_position']) {
        //         return a['task_id'] - b['task_position'];
        //     } else if (!b['task_position']) {
        //         return a['task_position'] - b['task_id'];
        //     }
        //     return 0;
        // });
        //
        // for (let task of this.tasksFromServer) {
        //     let taskId = task['task_id'];
        //     let taskText = task['task_text'];
        //     let taskStatus = task['task_status'];
        //     let taskParentId = task['parent_id'];
        //     let taskPosition = task['task_position'];
        //
        //     this.tasksTree.set(taskId, new Task(taskId, taskText, taskPosition, taskParentId, taskStatus));
        // }
        //
        // for (let task of this.tasksTree.values()) {
        //     if (this.tasksTree.has(task.parentId)) {
        //         this.tasksTree.get(task.parentId).subtasks.push(task);
        //     } else {
        //         this.rootTasksList.push(task);
        //     }
        // }

        // console.log(this.tasksTree);
        // console.log(this.rootTasksList);

        this.state = {
            linearTasksList: this.rootTasksList,
            movingTasks: {
                moving: false,
                taskMovingUpId: null,
                taskMovingDownId: null,
                activeMovingTaskId: null,
            },
            removingTask: {
                removing: false,
                removingTaskId: null,
                removingTaskPosition: null,
                removingTaskHeight: null,
            },
        }
        this.addTask = this.addTask.bind(this);
        // this.addSubtask = this.addSubtask.bind(this);
        this.removeTask = this.removeTask.bind(this);
    }

    componentDidMount() {
        registry.taskList = this;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.tasksFromServer !== nextProps.tasksFromServer && nextProps.tasksFromServer) {
            this.tasksFromServer = nextProps.tasksFromServer;
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

            console.log(this.tasksTree);
            console.log(this.rootTasksList);
        }
        return true;
    }

    componentWillUnmount() {
        registry.taskList = null;
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
            console.log('up');
            if (currentTaskIndex > 0 && currentTaskIndex !== -1) {
                taskToSwapIndex = currentTaskIndex - 1;
                taskToSwap = taskList[taskToSwapIndex]
                taskToSwapId = taskToSwap.id;
                taskToSwapPosition = taskToSwap.position ? taskToSwap.position : taskToSwapId;
                taskMovingUpId = currentTaskId;
                taskMovingDownId = taskToSwapId;
            }
        } else if (taskMoveDirection === 'DOWN') {
            console.log('down');
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

                this.setState({
                    movingTasks: {
                        moving: true,
                        taskMovingUpId: taskMovingUpId,
                        taskMovingDownId: taskMovingDownId,
                        activeMovingTaskId: currentTaskId,
                    },
                })
                console.log(this.state);
                setTimeout(()=>{
                    this.setState({
                        linearTasksList: swap(taskList, currentTaskIndex, taskToSwapIndex),
                        movingTasks: {
                            moving: false,
                            taskMovingUpId: null,
                            taskMovingDownId: null,
                            activeMovingTaskId: null,
                        },
                    });
                    console.log(this.state);
                }, 300);

                // this.setState({
                //     linearTasksList: swap(taskList, currentTaskIndex, taskToSwapIndex),
                // });
            }
        }
        registry.app.knockKnock('/change_position', responseHandler, sendData);
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
            'listId': this.props.listId,
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
                registry.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            } else {
                showInfoWindow('Some problem!');
            }
        }
        registry.app.knockKnock('/save_task', responseHandler, sendData);
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
    //             registry.login.forceLogOut();
    //             showInfoWindow('Authorisation problem!');
    //         }
    //     }
    //     registry.app.knockKnock('/save_task', add, sendData);
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

                this.setState({
                    removingTask: {
                        removing: true,
                        removingTaskId: task.id,
                        removingTaskPosition: task.taskInst.position,
                        removingTaskHeight: task.taskDiv.current.offsetHeight,
                    },
                });

                setTimeout(() => {
                    this.rootTasksList.splice(findPosition(this.rootTasksList, task.taskInst), 1);
                    this.tasksTree.delete(task.id);

                    this.setState({
                        // linearTasksList: this.makeLinearList(this.rootTasksList),
                        linearTasksList: this.rootTasksList,
                        removingTask: {
                            removing: false,
                            removingTaskId: null,
                            removingTaskPosition: null,
                            removingTaskHeight: null,
                        },
                    });
                }, 500);
            } else if (answer.status === 401) {
                registry.login.forceLogOut();
                showInfoWindow('Authorisation problem!');
            }
        }
        registry.app.knockKnock('/delete_task', responseHandler, sendData);
    }

    render() {
        console.log(this.state.linearTasksList);
        return (
            <div className={'tasks'} id={'tasks'}>
                {this.state.linearTasksList.map((task) =>
                    <TaskReact key={task.id.toString()}
                               taskInst={task}
                               taskId={task.id}
                               status={task.status}
                               taskText={task.text}
                               parentId={task.parentId}
                               movingTasks={this.state.movingTasks}
                               removingTask={this.state.removingTask}
                    />)}
            </div>
        )
    }
}
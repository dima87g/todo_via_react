export function showCookiesAlertWindow(value) {
    return {
        type: 'COOKIES_WINDOW_IS_VISIBLE',
        value,
    }
}

export function showShadowModal(value) {
    return {
        type: 'SHADOW_MODAL_IS_VISIBLE',
        value,
    }
}

export function showConfirmWindow(value, message, func) {
    return {
        type: 'CONFIRM_WINDOW_IS_VISIBLE',
        value,
        message,
        func,
    }
}

export function showInfoWindow(value, message) {
    return {
        type: 'INFO_WINDOW_IS_VISIBLE',
        value,
        message,
    }
}

export function createList(userName, listId, listSelectMenu, tasksFromServer) {
    //TODO Need to rename and refactor this function
    return {
        type: 'CREATE_LIST',
        userName,
        listId,
        listSelectMenu,
        tasksFromServer,
    }
}

export function moveTask(moving, taskMovingUpId, taskMovingDownId, movingTaskId) {
    return {
        type: 'MOVING_TASK',
        moving,
        taskMovingUpId,
        taskMovingDownId,
        movingTaskId,
    }
}

export function removeTask(removing, removingTaskId, removingTaskPosition, removingTaskHeight) {
    return {
        type: 'REMOVING_TASK',
        removing,
        removingTaskId,
        removingTaskPosition,
        removingTaskHeight,
    }
}

export function test(value) {
    return {
        type: 'TEST',
        value,
    }
}
export function userLogOut() {
    return {
        type: 'USER_LOGOUT',
    }
}

export function showCookiesAlertWindow() {
    return {
        type: 'COOKIES_WINDOW_IS_VISIBLE',
        value: true,
    }
}

export function hideCookiesAlertWindow() {
    return {
        type: 'COOKIES_WINDOW_IS_VISIBLE',
        value: false,
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

export function showHeaderMenu() {
    return {
        type: 'SHOW_HEADER_MENU',
    }
}

export function hideHeaderMenu() {
    return {
        type: 'HIDE_HEADER_MENU',
    }
}

export function showAuthMenu() {
    return {
        type: 'SHOW_AUTH_MENU',
    }
}

export function hideAuthMenu() {
    return {
        type: 'HIDE_AUTH_MENU',
    }
}

export function showSettingsMenu() {
    return {
        type: 'SHOW_SETTINGS_MENU',
    }
}

export function hideSettingsMenu() {
    return {
        type: 'HIDE_SETTINGS_MENU',
    }
}

export function showTaskEditField() {
    return {
        type: 'SHOW_TASK_EDIT_FIELD',
    }
}

export function hideTaskEditField() {
    return {
        type: 'HIDE_TASK_EDIT_FIELD',
    }
}

export function test(value) {
    return {
        type: 'TEST',
        value,
    }
}

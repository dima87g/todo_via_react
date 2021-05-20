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

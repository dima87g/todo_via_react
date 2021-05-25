/**
 *
 * @param value {boolean}
 * @returns {{type: string, value}}
 */
export function moveTaskToTopByUpButton(value) {
    return {
        type: 'MOVE_TASK_TO_TOP_BY_UP_BUTTON',
        value,
    }
}

/**
 *
 * @param value {boolean}
 * @returns {{type: string, value}}
 */
export function moveFinishedToBottom(value) {
    return {
        type: 'MOVE_FINISHED_TASKS_TO_BOTTOM',
        value,
    }
}
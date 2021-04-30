/**
 * ID = 1 in server settings table
 * @param value {boolean}
 * @returns {{type: string, value}}
 */
export function moveTaskToTopByUpButton(value) {
    return {
        type: 'MOVE_TASK_TO_TOP_BY_UP_BUTTON',
        value,
    }
}
let initialState = {
    MOVE_TASK_TO_TOP_BY_UP_BUTTON: false,
    MOVE_FINISHED_TASKS_TO_BOTTOM: false,
}

export function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'MOVE_TASK_TO_TOP_BY_UP_BUTTON':
            return {
                ...state,
                MOVE_TASK_TO_TOP_BY_UP_BUTTON: action.value
            }
        case 'MOVE_FINISHED_TASKS_TO_BOTTOM':
            return {
                ...state,
                MOVE_FINISHED_TASKS_TO_BOTTOM: action.value
            }
        default:
            return state;
    }
}
let initialState = {
    MOVE_TASK_TO_TOP_BY_UP_BUTTON: false,
    MOVE_FINISHED_TASKS_TO_BOTTOM: false,
    DEFAULT_LIST: 'main',
    DEFAULT_LIST_ID: null,
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
        case 'SET_DEFAULT_LIST':
            return {
                ...state,
                DEFAULT_LIST: action.value,
                DEFAULT_LIST_ID: action.listId
            }
        default:
            return state;
    }
}
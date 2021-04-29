let initialState = {
    MOVE_TASK_TO_TOP_BY_UP_BUTTON: false,
}

export function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'MOVE_TASK_TO_TOP_BY_UP_BUTTON':
            return {
                ...state,
                MOVE_TASK_TO_TOP_BY_UP_BUTTON: action.value
            }
        default:
            return state;
    }
}
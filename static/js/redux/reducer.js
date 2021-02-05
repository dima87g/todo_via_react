let initialState = {
    SHADOW_MODAL_IS_VISIBLE: false,
    CONFIRM_WINDOW_IS_VISIBLE: false,
    CONFIRM_WINDOW_MESSAGE: '',
    INFO_WINDOW_IS_VISIBLE: false,
    INFO_WINDOW_MESSAGE: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CONFIRM_WINDOW_IS_VISIBLE':
            return {
                ...state,
                CONFIRM_WINDOW_IS_VISIBLE: action.value,
                CONFIRM_WINDOW_MESSAGE: action.message,
            };
        case 'SHADOW_MODAL_IS_VISIBLE':
            return {
                ...state,
                SHADOW_MODAL_IS_VISIBLE: action.value
            };
        case 'INFO_WINDOW_IS_VISIBLE':
            return {
                ...state,
                INFO_WINDOW_IS_VISIBLE: action.value,
                INFO_WINDOW_MESSAGE: action.message,
            }
        default:
            return state;
    }
}
let initialState = {
    SHADOW_MODAL_IS_VISIBLE: false,
    CONFIRM_WINDOW_IS_VISIBLE: false,
    CONFIRM_WINDOW_MESSAGE: '',
    CONFIRM_WINDOW_FUNCTION: null,
    INFO_WINDOW_IS_VISIBLE: false,
    INFO_WINDOW_MESSAGE: '',
    COOKIES_WINDOW_IS_VISIBLE: false,
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'COOKIES_WINDOW_IS_VISIBLE':
            return {
                ...state,
                COOKIES_WINDOW_IS_VISIBLE: action.value,
            };
        case 'CONFIRM_WINDOW_IS_VISIBLE':
            return {
                ...state,
                CONFIRM_WINDOW_IS_VISIBLE: action.value,
                CONFIRM_WINDOW_MESSAGE: action.message,
                CONFIRM_WINDOW_FUNCTION: action.func,
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
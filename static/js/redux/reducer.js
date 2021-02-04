let initialState = {
    SHADOW_MODAL_IS_VISIBLE: false,
    CONFIRM_WINDOW_IS_VISIBLE: false,
}

export function reducer(state = initialState, action) {
    console.log(action);
    switch (action.type) {
        case 'CONFIRM_WINDOW_IS_VISIBLE':
            return {
                ...state,
                CONFIRM_WINDOW_IS_VISIBLE: action.value
            };
        case 'SHADOW_MODAL_IS_VISIBLE':
            return {
                ...state,
                SHADOW_MODAL_IS_VISIBLE: action.value
            };
        default:
            return state;
    }
}
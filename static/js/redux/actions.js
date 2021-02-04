export function shadowModalShowing(value) {
    return {
        type: 'SHADOW_MODAL_IS_VISIBLE',
        value
    }
}

export function conformWindowShowing(value, message, func) {
    return {
        type: 'CONFIRM_WINDOW_IS_VISIBLE',
        value,
        message,
        func
    }
}
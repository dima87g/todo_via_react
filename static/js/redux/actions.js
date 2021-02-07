export function showShadowModal(value) {
    return {
        type: 'SHADOW_MODAL_IS_VISIBLE',
        value,
    }
}

export function showConfirmWindow(value, message) {
    return {
        type: 'CONFIRM_WINDOW_IS_VISIBLE',
        value,
        message,
    }
}

export function showInfoWindow(value, message) {
    return {
        type: 'INFO_WINDOW_IS_VISIBLE',
        value,
        message,
    }
}
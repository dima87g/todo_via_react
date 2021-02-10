export function showCookiesAlertWindow(value) {
    return {
        type: 'COOKIES_WINDOW_IS_VISIBLE',
        value,
    }
}

export function showShadowModal(value) {
    return {
        type: 'SHADOW_MODAL_IS_VISIBLE',
        value,
    }
}

export function showConfirmWindow(value, message, func) {
    return {
        type: 'CONFIRM_WINDOW_IS_VISIBLE',
        value,
        message,
        func,
    }
}

export function showInfoWindow(value, message) {
    return {
        type: 'INFO_WINDOW_IS_VISIBLE',
        value,
        message,
    }
}
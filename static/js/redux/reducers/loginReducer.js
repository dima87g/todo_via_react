'use strict'

let initialState = {
    AUTH_MENU_IS_VISIBLE: true,
}

export function loginReducer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_AUTH_MENU':
            return {
                ...state,
                AUTH_MENU_IS_VISIBLE: true,
            }
        case 'HIDE_AUTH_MENU':
            return {
                ...state,
                AUTH_MENU_IS_VISIBLE: false,
            }
        default:
            return state
    }
}
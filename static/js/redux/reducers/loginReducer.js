'use strict'

let initialState = {
    AUTH_MENU_IS_VISIBLE: true,
    USER_NAME: '',
    LIST_ID: null,
    LIST_SELECT_MENU: [],
    TASKS_FROM_SERVER: [],
}

export function loginReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                USER_NAME: action.userName,
            }
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
        case 'CREATE_LIST':
            return {
                ...state,
                LIST_ID: action.listId,
                LIST_SELECT_MENU: action.listSelectMenu,
                TASKS_FROM_SERVER: action.tasksFromServer,
            }
        default:
            return state
    }
}
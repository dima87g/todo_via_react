export function userLogIn(userName) {
    return {
        type: 'USER_LOGIN',
        userName,
    }
}

export function showAuthMenu() {
    return {
        type: 'SHOW_AUTH_MENU',
    }
}

export function hideAuthMenu() {
    return {
        type: 'HIDE_AUTH_MENU',
    }
}

export function createList(listId, listSelectMenu, tasksFromServer) {
    //TODO Need to rename and refactor this function
    return {
        type: 'CREATE_LIST',
        listId,
        listSelectMenu,
        tasksFromServer,
    }
}

export function userLogOut() {
    return {
        type: 'USER_LOGOUT',
    }
}
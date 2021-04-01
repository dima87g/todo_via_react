import {loginReducer} from "./loginReducer";
import {combineReducers} from "redux";

let initialState = {
    SETTINGS_MENU_IS_VISIBLE: false,
    SHADOW_MODAL_IS_VISIBLE: true,
    CONFIRM_WINDOW_IS_VISIBLE: false,
    CONFIRM_WINDOW_MESSAGE: '',
    CONFIRM_WINDOW_FUNCTION: null,
    INFO_WINDOW_IS_VISIBLE: false,
    INFO_WINDOW_MESSAGE: '',
    COOKIES_WINDOW_IS_VISIBLE: true,
    TASK_IS_MOVING: false,
    TASK_MOVING_UP_ID: null,
    TASK_MOVING_DOWN_ID: null,
    MOVING_TASK_ID: null,
    TASK_IS_REMOVING: false,
    REMOVING_TASK_ID: null,
    REMOVING_TASK_POSITION: null,
    REMOVING_TASK_HEIGHT: null,
    HEADER_MENU_IS_SHOWING: false,
    TASK_EDIT_FIELD_IS_SHOWING: false,
}

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'TEST':
            return {
                ...state,
                VALUE: action.value,
            }
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
        case 'SHOW_SETTINGS_MENU':
            return {
                ...state,
                SETTINGS_MENU_IS_VISIBLE: true,
            }
        case 'HIDE_SETTINGS_MENU':
            return {
                ...state,
                SETTINGS_MENU_IS_VISIBLE: false,
            }
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
        case 'MOVING_TASK':
            return  {
                ...state,
                TASK_IS_MOVING: action.moving,
                TASK_MOVING_UP_ID: action.taskMovingUpId,
                TASK_MOVING_DOWN_ID: action.taskMovingDownId,
                MOVING_TASK_ID: action.movingTaskId,
            }
        case 'REMOVING_TASK':
            return {
                ...state,
                TASK_IS_REMOVING: action.removing,
                REMOVING_TASK_ID: action.removingTaskId,
                REMOVING_TASK_POSITION: action.removingTaskPosition,
                REMOVING_TASK_HEIGHT: action.removingTaskHeight,
            }
        case 'SHOW_HEADER_MENU':
            return {
                ...state,
                HEADER_MENU_IS_SHOWING: true,
            }
        case 'HIDE_HEADER_MENU':
            return {
                ...state,
                HEADER_MENU_IS_SHOWING: false,
            }
        case 'SHOW_TASK_EDIT_FIELD':
            return {
                ...state,
                TASK_EDIT_FIELD_IS_SHOWING: true,
            }
        case 'HIDE_TASK_EDIT_FIELD':
            return {
                ...state,
                TASK_EDIT_FIELD_IS_SHOWING: false,
            }
        default:
            return state;
    }
}
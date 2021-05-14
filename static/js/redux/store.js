import {createStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import {appReducer} from "./reducers/appReducer";
import {loginReducer} from "./reducers/loginReducer";
import {settingsReducer} from "./reducers/settingsReducer";

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return mainReducer(undefined, action);
    } else {
        return mainReducer(state, action);
    }
}

const mainReducer = combineReducers({
    app: appReducer,
    login: loginReducer,
    settings: settingsReducer
})

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 }));

export {store}

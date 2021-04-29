import {createStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import {appReducer} from "./reducers/appReducer";
import {loginReducer} from "./reducers/loginReducer";
import {settingsReducer} from "./reducers/settingsReducer";

const mainReducer = combineReducers({
    app: appReducer,
    login: loginReducer,
    settings: settingsReducer
})

const store = createStore(mainReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export {store}

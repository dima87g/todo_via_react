'use strict';

import "core-js/stable/promise";
import "core-js/stable/symbol";
import "core-js/stable/set";
import App from "./react_components/App";
import React from "react";
import ReactDOM from "react-dom";
import {conformWindowShowing} from "./redux/actions.js";
import {store} from "./redux/store";
import {Provider} from "react-redux";

    // Not guaranteed that taskInput always will be 'not null' in registry,
    // while code is working, need always check if it exists in the registry!!!
export const registry = {
    //App React component
    app: null,
    login: null,
    taskList: null,
}

console.log(store);
console.log(store.getState());

store.subscribe(() => {
    console.log(store);
    console.log(store.getState());
})

store.dispatch(conformWindowShowing(true));

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
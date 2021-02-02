'use strict';

import "core-js/stable/promise";
import "core-js/stable/symbol";
import "core-js/stable/set";
import {App} from "./react_components/App";
import React from "react";
import ReactDOM from "react-dom";

    // Not guaranteed that taskInput always will be 'not null' in registry,
    // while code is working, need always check if it exists in the registry!!!
export const registry = {
    //App React component
    app: null,
    login: null,
    taskList: null,
}

ReactDOM.render(<App/>, document.getElementById('root'));
'use strict';

import {App} from "./react_components/App";

export const registry = {
    // Not guaranteed that taskInput always will be 'not null' in registry,
    // while code is working, need always check if it exists in the registry!!!
    app: null,
    login: null,
    headerMenu: null,
    taskInput: null,
    taskList: null,
}

ReactDOM.render(<App/>, document.getElementById('root'));
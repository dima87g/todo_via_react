'use strict';

import "core-js/stable/promise";
import "core-js/stable/symbol";
import "core-js/stable/set";
import App from "./react_components/App";
import React from "react";
import ReactDOM from "react-dom";
import {store} from "./redux/store";
import {Provider} from "react-redux";
import '../css/style.css';

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
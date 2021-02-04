import {createStore} from "@reduxjs/toolkit";
import {reducer} from "./reducer";

let init = {
    CONFIRM_WINDOW_IS_VISIBLE: false,
}

const store = createStore(reducer);

export {store}

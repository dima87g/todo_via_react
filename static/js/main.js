'use strict';

Array.prototype.swap = function (x,y) {
  let b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function findPosition(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return i;
        }
    }
    return -1;
}

const registry = {
    // Not guaranteed that taskInput always will be 'not null' in registry,
    // while code is working, need always check if it exists in the registry!!!
    app: null,
    headerMenu: null,
    taskInput: null,
    taskList: null,
}

ReactDOM.render(<App/>, document.getElementById('root'));
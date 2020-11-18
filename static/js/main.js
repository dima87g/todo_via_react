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
    app: null,
    taskList: null,
}

ReactDOM.render(<App/>, document.getElementById('root'));
'use strict';

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
};

function findPosition(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }

  return -1;
}

var registry = {
  // Not guaranteed that taskInput always will be 'not null' in registry,
  // while code is working,
  // need
  // check
  // it
  // in
  // the
  // code!!!
  app: null,
  headerMenu: null,
  taskInput: null,
  taskList: null
};
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));

//# sourceMappingURL=main_compiled.js.map
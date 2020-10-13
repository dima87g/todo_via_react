'use strict'; // document.addEventListener('DOMContentLoaded', function() {
//     let mainLogin = new Login();
//     authCheck(mainLogin);
//     events();
// });

var mainLogin = new Login();
var showLoading = new LoadingWindow();
authCheck(mainLogin);
events();
console.log(document.cookie);
ReactDOM.render( /*#__PURE__*/React.createElement(TaskListReact, null), document.getElementById('root'));

//# sourceMappingURL=main_compiled.js.map
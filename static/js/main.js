'use strict';

// document.addEventListener('DOMContentLoaded', function() {
//     let mainLogin = new Login();
//     authCheck(mainLogin);
//     events();
// });

let mainLogin = new Login();
let showLoading = new LoadingWindow();
authCheck(mainLogin);
events();
console.log(document.cookie)
ReactDOM.render(<TaskListReact/>, document.getElementById('root'));
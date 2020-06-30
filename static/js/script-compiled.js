"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskList = /*#__PURE__*/function () {
  function TaskList() {
    _classCallCheck(this, TaskList);

    this.userId = undefined;
    this.tasks = [];
  }

  _createClass(TaskList, [{
    key: "addTask",
    value: function addTask() {
      /**
       * POST: json = {'user_id': 'number', taskText = 'string'}
       * GET:
       * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var self = this;

      if (document.getElementById("task_input_field").value) {
        var add = function add(answer) {
          if (answer['ok'] === true) {
            var taskId = answer['task_id'];
            var newTask = new Task(self, taskId, taskText);
            self.tasks.push(newTask);
            self.updateDom();
          }
        };

        var taskText = document.getElementById("task_input_field").value;
        document.getElementById("task_input_field").value = "";
        var sendData = {
          'userId': this.userId,
          'taskText': taskText
        };
        knock_knock('save', sendData, add);
      }
    }
  }, {
    key: "finishTask",
    value: function finishTask(node) {
      /**
       * POST: json = {'task_id': 'number', 'status': 'boolean'}
       * GET:
       * if OK = true: json = {'ok': true}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var self = this;
      node.status = node.status === false;
      var sendData = {
        "taskId": node.id,
        "status": node.status
      };

      function finish(answer) {
        if (answer['ok'] === true) {
          self.updateDom();
        }
      }

      knock_knock('finish_task', sendData, finish);
    }
  }, {
    key: "removeTask",
    value: function removeTask(node) {
      /**
       * POST: {taskId: 'number'}
       * GET:
       * if OK = true: json = {'ok': true}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var self = this;
      var sendData = {
        'taskId': node.id
      };

      function remove(answer) {
        if (answer['ok'] === true) {
          self.tasks.splice(self.tasks.indexOf(node), 1);
          self.updateDom();
        }
      }

      knock_knock('delete', sendData, remove);
    }
  }, {
    key: "updateDom",
    value: function updateDom() {
      var tasksParentId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'main_tasks';
      var existsTasksClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'task';
      var tasksParent = document.getElementById(tasksParentId);
      var existTasks = document.getElementsByClassName(existsTasksClass);
      var i = 0;

      for (i; i < this.tasks.length; i++) {
        if (existTasks[i]) {
          this.tasks[i].replaceTaskNode(existTasks[i]);
        } else {
          tasksParent.appendChild(this.tasks[i].createTaskNode());
        }
      }

      if (existTasks[i]) {
        // for (i; i < existTasks.length; i++) {
        //     existTasks[i].remove();
        //     i--;
        // }
        tasksParent.removeChild(tasksParent.lastChild);
      }
    }
  }]);

  return TaskList;
}();

var Task = /*#__PURE__*/function () {
  function Task(taskList, id, text) {
    var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Task);

    this.taskList = taskList;
    this.id = id;
    this.text = text;
    this.status = status;
  }

  _createClass(Task, [{
    key: "createTaskNode",
    value: function createTaskNode() {
      var node = this;
      var taskDiv = document.createElement("div");
      taskDiv.setAttribute("class", "task");
      var finishButton = document.createElement("input");
      finishButton.setAttribute("type", "button");
      finishButton.setAttribute("class", "task_finish_button");

      if (this.status === false) {
        finishButton.setAttribute("value", "Выполнено");
      } else {
        finishButton.setAttribute("value", "Не выполнено");
        taskDiv.setAttribute("class", "task finished_task");
      }

      finishButton.onclick = function () {
        node.taskList.finishTask(node);
      };

      var removeButton = document.createElement("input");
      removeButton.setAttribute("type", "button");
      removeButton.setAttribute("value", "X");
      removeButton.setAttribute("class", "task_remove_button");

      removeButton.onclick = function () {
        node.taskList.removeTask(node);
      };

      var par = document.createElement("p");
      par.appendChild(document.createTextNode(this.text));
      par.setAttribute("class", "paragraph");
      taskDiv.appendChild(finishButton);
      taskDiv.appendChild(par);
      taskDiv.appendChild(removeButton);
      return taskDiv;
    }
  }, {
    key: "replaceTaskNode",
    value: function replaceTaskNode(existTask) {
      var node = this;
      var finishButton = existTask.getElementsByClassName("task_finish_button")[0];
      var removeButton = existTask.getElementsByClassName("task_remove_button")[0];
      existTask.getElementsByTagName("p")[0].textContent = this.text;

      if (this.status === false) {
        finishButton.setAttribute("value", "Выполнено");
        existTask.setAttribute("class", "task");
      } else {
        finishButton.setAttribute("value", "Не выполнено");
        existTask.setAttribute("class", "task finished_task");
      }

      finishButton.onclick = function () {
        node.taskList.finishTask(node);
      };

      removeButton.onclick = function () {
        node.taskList.removeTask(node);
      };
    }
  }]);

  return Task;
}();

var Login = /*#__PURE__*/function () {
  function Login() {
    _classCallCheck(this, Login);

    var self = this;
    this.authMenu = document.getElementById("auth_menu");
    this.loginForm = document.getElementById("login_form");
    this.loginFormInfo = document.getElementById("login_form_info");
    this.loginFormUsername = document.getElementById("login_form_username");
    this.loginFormPassword = document.getElementById("login_form_password");
    this.loginButton = document.getElementById("login_form_button");
    this.registerForm = document.getElementById("register_form");
    this.registerFormInfo = document.getElementById("register_form_info");
    this.registerFormUsername = document.getElementById("register_form_username");
    this.registerFormPassword = document.getElementById("register_form_password");
    this.registerFormPasswordConfirm = document.getElementById("register_form_password_confirm");
    this.userRegisterButton = document.getElementById("register_form_button");
    this.switchRegisterButton = document.getElementById("register_button");
    this.switchLoginButton = document.getElementById("login_button");
    this.userNameField = document.getElementById("user_name_field");
    this.userLogOutButton = document.getElementById('user_logout_button');
    this.userDeleteButton = document.getElementById("user_delete_button");
    this.shadow = document.getElementById("shadow");
    this.loginFormUsername.focus();
    this.userLogOutButton.disabled = true;

    this.switchRegisterButton.onclick = function () {
      self.switchLogin(this.value);
    };

    this.switchLoginButton.onclick = function () {
      self.switchLogin(this.value);
    };

    this.loginButton.onclick = function () {
      self.logIn();
    };

    this.userLogOutButton.onclick = function () {
      self.logOut();
    };

    this.userDeleteButton.onclick = function () {
      self.userDelete();
    };

    this.userRegisterButton.onclick = function () {
      self.userRegister();
    };
  }

  _createClass(Login, [{
    key: "switchLogin",
    value: function switchLogin(val) {
      if (val === 'register') {
        windowChange(this.registerForm, this.switchLoginButton, this.loginForm, this.switchRegisterButton, this.registerFormUsername, this.loginFormInfo);
      } else if (val === 'login') {
        windowChange(this.loginForm, this.switchRegisterButton, this.registerForm, this.switchLoginButton, this.loginFormUsername, this.registerFormInfo);
      }

      function windowChange(activate, activateButton, deactivate, deactivateButton, focusField, infoField) {
        removeChilds(infoField);
        deactivate.style.opacity = '0';
        deactivateButton.disabled = true;
        activate.style.display = 'block';
        focusField.focus();
        setTimeout(function () {
          activate.style.opacity = '1';
        });
        setTimeout(function () {
          deactivate.style.display = 'none';
          activateButton.disabled = false;
        }, 500);
      }
    }
  }, {
    key: "onLoad",
    value: function onLoad(userName, password) {
      var _this = this;

      /**
       * POST: userName = 'string'
       * GET:
       * if OK = true: json = {'ok': 'boolean', 'user_id': 'number', 'tasks': [
       *                                          {'user_id': 'number', 'task_text': 'string', 'status': 'string'},
       *                                          ...
       *                                          ]
       *             }
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var sendData = {
        'userName': userName,
        "password": password
      };

      var loadTasks = function loadTasks(answer) {
        if (answer['ok'] === true) {
          _this.loginFormUsername.value = "";
          removeChilds(_this.loginFormInfo);
          _this.authMenu.style.opacity = '0';
          _this.shadow.style.display = "none";
          setTimeout(function () {
            _this.authMenu.style.display = 'none';
            document.getElementById('task_input_field').focus();
          }, 500);

          _this.userNameField.appendChild(document.createTextNode(userName));

          _this.userLogOutButton.disabled = false;
          var userId = answer['user_id'];
          var tasksFromServer = answer['tasks'];
          createNewTaskList(userId, tasksFromServer, 'task_input_button', 'main_tasks', 'task');
        } else {
          removeChilds(_this.loginFormInfo);

          _this.loginFormInfo.appendChild(document.createTextNode("Проблема((((("));
        }
      };

      knock_knock('load_tasks', sendData, loadTasks);
    }
  }, {
    key: "logIn",
    value: function logIn() {
      var _this2 = this;

      /**
       * POST: json = {"userName": "string", "password": "string"}
       * GET:
       * if OK = true: json = {"ok": "boolean", "user_id": "number",
       *                         "tasks": [{"task_id": "number", "task_text": "string", "status": "boolean"},
       *                                  ..........] }
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       *                        'error_message': 'string' or null}
       */
      removeChilds(this.loginFormInfo);

      if (this.loginFormUsername.value) {
        if (this.loginFormPassword.value) {
          var userName = this.loginFormUsername.value;
          var password = this.loginFormPassword.value;
          var sendData = {
            "userName": userName,
            "password": password
          };
          this.loginFormPassword.value = "";

          var login = function login(answer) {
            if (answer["ok"] === true) {
              _this2.onLoad(userName, password);
            } else {
              _this2.loginFormInfo.appendChild(document.createTextNode(answer["error_message"]));
            }
          };

          knock_knock('login', sendData, login);
        } else {
          this.loginFormInfo.appendChild(document.createTextNode("Enter password!"));
        }
      } else {
        this.loginFormInfo.appendChild(document.createTextNode('Please, enter user name!'));
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      var _this3 = this;

      // let userNameField = document.getElementById('user_name_field');
      var tasksParent = document.getElementById("main_tasks");
      this.shadow.style.display = "block";
      removeChilds(this.userNameField);
      this.userLogOutButton.disabled = true;
      removeChilds(tasksParent);
      this.authMenu.style.display = 'block';
      this.loginFormUsername.focus();
      setTimeout(function () {
        _this3.authMenu.style.opacity = '1';
      });
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      var _this4 = this;

      var userName = document.getElementById('user_name_field').textContent;
      var sendData = {
        "userName": userName
      };

      var confirm = function confirm() {
        knock_knock("user_delete", sendData, del);
      };

      var del = function del(answer) {
        if (answer["ok"] === true) {
          _this4.logOut();
        }
      };

      createConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }
  }, {
    key: "userRegister",
    value: function userRegister() {
      var _this5 = this;

      /**
       * POST: json =  {newUserName: 'string'}
       * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
       'error_message': 'string' or null}
       */
      // let infoMessage = document.getElementById("register_form_info");
      removeChilds(this.registerFormInfo);

      if (this.registerFormUsername.value) {
        if (this.registerFormPassword.value) {
          if (this.registerFormPasswordConfirm.value) {
            var newUserName = this.registerFormUsername.value;
            var password = this.registerFormPassword.value;
            var passwordConform = this.registerFormPasswordConfirm.value;

            if (password === passwordConform) {
              var sendData = {
                "newUserName": newUserName,
                "password": password
              };

              var register = function register(answer) {
                if (answer['ok'] === true) {
                  _this5.registerFormUsername.value = "";
                  _this5.registerFormPassword.value = "";
                  _this5.registerFormPasswordConfirm.value = "";

                  _this5.registerFormInfo.appendChild(document.createTextNode("New user " + newUserName + " successfully created!"));
                } else if (answer['error_code'] === 1062) {
                  _this5.registerFormInfo.appendChild(document.createTextNode("Name " + newUserName + " is already used!"));
                } else {
                  _this5.registerFormInfo.appendChild(document.createTextNode(answer['error_message'] + ' Код ошибки: ' + answer['error_code']));
                }
              };

              knock_knock('user_register', sendData, register);
            } else {
              this.registerFormInfo.appendChild(document.createTextNode("Passwords arenot match!"));
            }
          } else {
            this.registerFormInfo.appendChild(document.createTextNode("Please, confirm password!"));
          }
        } else {
          this.registerFormInfo.appendChild(document.createTextNode("Please, enter new password!"));
        }
      } else {
        this.registerFormInfo.appendChild(document.createTextNode("Please, enter new user name!"));
      }
    }
  }]);

  return Login;
}();

function events() {
  function noEnterRefreshLogin(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("task_input_button").click();
    }
  }

  function noEnterRefreshRegister(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("register_form_button").click();
    }
  }

  var taskInputField = document.getElementById("task_input_field");
  taskInputField.addEventListener("keydown", noEnterRefreshLogin, false);
  var registerField = document.getElementById("register_form_username");
  registerField.addEventListener('keydown', noEnterRefreshRegister, false);
}

function knock_knock(path, sendData, func) {
  if (window.fetch) {
    var init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(sendData)
    };
    fetch('http://127.0.0.1:5000/' + path, init).then(function (answer) {
      if (answer.ok && answer.headers.get('Content-Type') === 'application/json') {
        return answer.json();
      }
    }).then(function (answer) {
      func(answer);
    });
  } else {
    var req = new XMLHttpRequest();
    req.open('POST', 'http://127.0.0.1:5000/' + path);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(sendData));

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status === 200 && req.getResponseHeader('Content-type') === 'application/json') {
          func(JSON.parse(req.responseText));
        }
      }
    };
  }
}

function createNewTaskList(userId, tasksFromServer, taskInputButtonId, taskParentId, existsTasksClass) {
  var taskList = new TaskList();
  var taskInputButton = document.getElementById(taskInputButtonId);

  taskInputButton.onclick = function () {
    taskList.addTask();
  };

  taskList.userId = userId;

  var _iterator = _createForOfIteratorHelper(tasksFromServer),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var task = _step.value;
      taskList.tasks.push(new Task(taskList, task["task_id"], task["task_text"], task["status"]));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  taskList.updateDom(taskParentId, existsTasksClass);
}

function createConfirmWindow(func, message) {
  var shadow = document.getElementById("shadow");
  var confirmWindow = document.getElementById("confirm_window");
  var confirmWindowMessage = document.getElementById("confirm_window_message");
  var okButton = document.getElementById("confirm_window_ok_button");
  var cancelButton = document.getElementById("confirm_window_cancel_button");
  shadow.style.display = "block";
  confirmWindowMessage.appendChild(document.createTextNode(message));
  confirmWindow.style.display = "block";
  setTimeout(function () {
    shadow.style.opacity = "0.5";
  });
  okButton.onclick = click;
  cancelButton.onclick = click;

  function click() {
    if (this.value === "OK") {
      func();
    }

    shadow.style.display = "none";
    confirmWindow.style.display = "none";
    confirmWindowMessage.removeChild(confirmWindowMessage.firstChild);
  }
}

function removeChilds(field) {
  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var login = new Login();
  events();
});

//# sourceMappingURL=script-compiled.js.map
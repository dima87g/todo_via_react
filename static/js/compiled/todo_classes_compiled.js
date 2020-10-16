'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskList = function TaskList(loginInst, rawTasks) {
  _classCallCheck(this, TaskList);

  this.loginInst = null;
  this.rawTasks = rawTasks;
  this.tasksTree = new Map();
  this.tasks = [];

  var _iterator = _createForOfIteratorHelper(this.rawTasks),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var task = _step.value;
      var taskId = task['task_id'];
      var taskText = task['task_text'];
      var taskStatus = task['task_status'];
      var taskParentId = task['parent_id'];
      this.tasksTree.set(taskId, new Task(taskId, taskText, taskParentId, taskStatus));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(this.tasksTree.values()),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _task = _step2.value;

      if (this.tasksTree.has(_task.parentId)) {
        this.tasksTree.get(_task.parentId).subtasks.push(_task);
      } else {
        this.tasks.push(_task);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  ReactDOM.render( /*#__PURE__*/React.createElement(TaskListReact, {
    loginInst: this.loginInst,
    taskListInst: this,
    tasksTree: this.tasksTree,
    tasks: this.tasks
  }), document.getElementById('root'));
};

var Task = function Task(id, text) {
  var parentId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  _classCallCheck(this, Task);

  this.id = id;
  this.text = text;
  this.parentId = parentId;
  this.status = status;
  this.subtasks = [];
};

var Login = /*#__PURE__*/function () {
  function Login() {
    _classCallCheck(this, Login);

    var self = this;
    this.taskList = undefined;
    this.authMenu = document.getElementById("auth_menu");
    this.loginWindow = document.getElementById("login_window");
    this.loginWindowInfo = document.getElementById("login_window_info");
    this.loginFormUsername = document.getElementById("login_form_username");
    this.loginFormPassword = document.getElementById("login_form_password");
    this.loginButton = document.getElementById("login_form_button");
    this.registerWindow = document.getElementById("register_window");
    this.registerWindowInfo = document.getElementById("register_window_info");
    this.registerFormUsername = document.getElementById("register_form_username");
    this.registerFormPassword = document.getElementById("register_form_password");
    this.registerFormPasswordConfirm = document.getElementById("register_form_password_confirm");
    this.agreementCheckbox = document.getElementById('agreement_checkbox');
    this.userRegisterButton = document.getElementById("register_form_button");
    this.switchRegisterButton = document.getElementById("register_button");
    this.switchLoginButton = document.getElementById("login_button");
    this.userNameField = document.getElementById("user_name_field");
    this.userLogOutButton = document.getElementById('user_logout_button');
    this.userDeleteButton = document.getElementById("user_delete_button");
    this.userChangePasswordButton = document.getElementById('change_password_button');
    this.changePasswordWindow = document.getElementById('change_password_window');
    this.changePasswordWindowCancelButton = document.getElementById('change_password_window_cancel_button');
    this.changePasswordFormOldPassword = document.getElementById('change_password_form_old_password');
    this.changePasswordFormNewPassword = document.getElementById('change_password_form_new_password');
    this.changePasswordFormNewPasswordConfirm = document.getElementById('change_password_form_new_password_confirm');
    this.changePasswordButton = document.getElementById('change_password_form_button');
    this.changePasswordWindowInfo = document.getElementById('change_password_window_info');
    this.loginFormUsername.focus();
    this.userLogOutButton.disabled = true;
    this.userDeleteButton.disabled = true;
    this.userChangePasswordButton.disabled = true;

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

    this.userChangePasswordButton.onclick = function () {
      self.showChangePasswordWindow();
    };

    this.changePasswordWindowCancelButton.onclick = function () {
      self.hideChangePasswordWindow();
    };

    this.userRegisterButton.onclick = function () {
      self.userRegister();
    };

    this.changePasswordButton.onclick = function () {
      self.changePassword();
    };
  }

  _createClass(Login, [{
    key: "switchLogin",
    value: function switchLogin(val) {
      if (val === 'register') {
        windowChange(this.registerWindow, this.switchLoginButton, this.loginWindow, this.switchRegisterButton, this.loginWindowInfo);
      } else if (val === 'login') {
        windowChange(this.loginWindow, this.switchRegisterButton, this.registerWindow, this.switchLoginButton, this.registerWindowInfo);
      }

      function windowChange(activate, activateButton, deactivate, deactivateButton, infoField) {
        removeChildren(infoField);
        deactivate.style.opacity = '0';
        deactivateButton.disabled = true;
        activate.style.visibility = 'inherit';
        setTimeout(function () {
          activate.style.opacity = '1';
        });
        setTimeout(function () {
          deactivate.style.visibility = 'hidden';
          activateButton.disabled = false;
        }, 500);
      }
    }
  }, {
    key: "hideLoginWindow",
    value: function hideLoginWindow() {
      var _this = this;

      this.loginFormUsername.value = "";
      this.registerFormUsername.value = '';
      this.registerFormPassword.value = '';
      this.registerFormPasswordConfirm.value = '';
      removeChildren(this.loginWindowInfo);
      this.authMenu.style.opacity = '0';
      hideShadow();
      setTimeout(function () {
        _this.authMenu.style.visibility = 'hidden'; // document.getElementById('task_input_field').focus();
      }, 500);
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      var _this2 = this;

      showShadow();
      removeChildren(this.userNameField);
      this.userLogOutButton.disabled = true;
      this.userDeleteButton.disabled = true;
      this.userChangePasswordButton.disabled = true;
      this.authMenu.style.visibility = 'visible';
      this.loginFormUsername.focus();
      setTimeout(function () {
        _this2.authMenu.style.opacity = '1';
      });
    }
  }, {
    key: "showChangePasswordWindow",
    value: function showChangePasswordWindow() {
      showShadow();
      this.userLogOutButton.disabled = true;
      this.userDeleteButton.disabled = true;
      this.userChangePasswordButton.disabled = true;
      this.changePasswordWindow.style.visibility = 'visible';
      this.changePasswordWindowCancelButton.disabled = false;
      this.changePasswordButton.disabled = false;
    }
  }, {
    key: "hideChangePasswordWindow",
    value: function hideChangePasswordWindow() {
      hideShadow();
      this.changePasswordFormOldPassword.value = '';
      this.changePasswordFormNewPassword.value = '';
      this.changePasswordFormNewPasswordConfirm.value = '';
      this.userLogOutButton.disabled = false;
      this.userDeleteButton.disabled = false;
      this.userChangePasswordButton.disabled = false;
      this.changePasswordWindow.style.visibility = 'hidden';
      this.changePasswordWindowCancelButton.disabled = true;
      this.changePasswordButton.disabled = true;
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this3 = this;

      /**
       * POST:
       * GET:
       * if OK = true: json = {'ok': 'boolean', 'user_id': 'number', 'tasks': [
       *                                          {"task_id": "number", 'task_text': 'string', 'status': 'string'},
       *                                          ...
       *                                          ]
       *             }
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var loadTasks = function loadTasks(answer) {
        if (answer['ok'] === true) {
          var userName = answer["user_name"];
          var tasksFromServer = answer['tasks'];

          if (!_this3.userNameField.firstChild) {
            _this3.userNameField.appendChild(document.createTextNode(userName));

            _this3.userLogOutButton.disabled = false;
            _this3.userDeleteButton.disabled = false;
            _this3.userChangePasswordButton.disabled = false;
          }

          _this3.taskList = new TaskList(_this3, tasksFromServer); // let taskInputButton = document.getElementById("task_input_button");
          //
          // taskInputButton.onclick = () => {
          //     this.taskList.addTask();
          //     return false;
          // }
          // let tasksTree = this.taskList.tasksTree;
          //
          // for (let task of tasksFromServer) {
          //     let taskId = task["task_id"];
          //     let taskText = task["task_text"];
          //     let taskStatus = task["task_status"];
          //     let parentId = task["parent_id"];
          //
          //     tasksTree.set(taskId, new Task(this, this.taskList, taskId, taskText, parentId, taskStatus));
          // }
          //
          // for (let task of tasksTree.values()) {
          //     if (tasksTree.has(task.parentId)) {
          //         tasksTree.get(task.parentId).subtasks.push(task);
          //     } else {
          //         this.taskList.tasks.push(task);
          //     }
          // }
          //
          // this.taskList.updateDom();
        }

        if (answer["error_code"] === 401) {
          _this3.forceLogOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      knock_knock('/load_tasks', loadTasks);
    }
  }, {
    key: "logIn",
    value: function logIn() {
      var _this4 = this;

      /**
       * POST: json = {"userName": "string", "password": "string"}
       * GET:
       * if OK = true: json = {"ok": "boolean", "user_id": "number",
       *                         "tasks": [{"task_id": "number", "task_text": "string", "status": "boolean"},
       *                                  ..........] }
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       *                        'error_message': 'string' or null}
       */
      removeChildren(this.loginWindowInfo);

      if (this.loginFormUsername.value && this.loginFormPassword.value) {
        var userName = this.loginFormUsername.value;
        var password = this.loginFormPassword.value;
        var sendData = {
          "userName": userName,
          "password": password
        };
        this.loginFormPassword.value = "";

        var login = function login(answer) {
          if (answer["ok"] === true) {
            var _userName = answer["user_name"];

            _this4.userNameField.appendChild(document.createTextNode(_userName));

            _this4.userLogOutButton.disabled = false;
            _this4.userDeleteButton.disabled = false;
            _this4.userChangePasswordButton.disabled = false;

            _this4.hideLoginWindow();

            _this4.onLoad();
          } else {
            _this4.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
          }
        };

        knock_knock('/user_login', login, sendData);
      } else if (!this.loginFormUsername.value) {
        this.loginWindowInfo.appendChild(document.createTextNode('Please, enter user name!'));
      } else if (!this.loginFormPassword.value) {
        this.loginWindowInfo.appendChild(document.createTextNode('Please, enter password!'));
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      var _this5 = this;

      var out = function out() {
        _this5.taskList = null;
        document.cookie = "id=; expires=-1";
        document.cookie = "sign=; expires=-1"; // let tasksParent = document.getElementById("main_tasks");
        // removeChildren(tasksParent);

        ReactDOM.unmountComponentAtNode(document.getElementById('root'));

        _this5.showLoginWindow();
      };

      var userLanguage = getCookie('lang');
      var message = null;

      if (userLanguage === 'ru') {
        message = 'Вы уверены, что хотите выйти?';
      } else if (userLanguage === 'en') {
        message = 'Are you sure, you want to log out?';
      }

      showConfirmWindow(out, message);
    }
  }, {
    key: "forceLogOut",
    value: function forceLogOut() {
      this.taskList = null;
      document.cookie = 'id=; expires=-1';
      document.cookie = 'sign=; expires=-1'; // let taskParent = document.getElementById('main_tasks');
      // removeChildren(taskParent);

      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      this.showLoginWindow();
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      var _this6 = this;

      var confirm = function confirm() {
        knock_knock("/user_delete", del);
      };

      var del = function del(answer) {
        if (answer["ok"] === true) {
          _this6.forceLogOut();
        }

        if (answer["error_code"] === 401) {
          _this6.forceLogOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      var userLanguage = getCookie('lang');
      var message = null;

      if (userLanguage === 'ru') {
        message = 'Вы уверены, что хотите удалить пользователя?';
      } else if (userLanguage === 'en') {
        message = 'Are you sure, you want to delete user?';
      }

      showConfirmWindow(confirm, message);
    }
  }, {
    key: "changePassword",
    value: function changePassword() {
      var _this7 = this;

      removeChildren(this.changePasswordWindowInfo);

      if (this.changePasswordFormOldPassword.value && this.changePasswordFormNewPassword.value && this.changePasswordFormNewPasswordConfirm.value) {
        if (this.changePasswordFormNewPassword.value === this.changePasswordFormNewPasswordConfirm.value) {
          var oldPassword = this.changePasswordFormOldPassword.value;
          var newPassword = this.changePasswordFormNewPassword.value;
          var sendData = {
            'oldPassword': oldPassword,
            'newPassword': newPassword
          };

          var change = function change(answer) {
            if (answer['ok'] === true) {
              _this7.hideChangePasswordWindow();

              showInfoWindow('Password is successfully changed!');
            } else if (answer['error_code'] === 401) {
              _this7.hideChangePasswordWindow();

              _this7.forceLogOut();

              showInfoWindow('Authorisation problem!');
            } else {
              _this7.changePasswordWindowInfo.appendChild(document.createTextNode(answer['error_message']));
            }
          };

          knock_knock('/change_password', change, sendData);
        } else {
          this.changePasswordWindowInfo.appendChild(document.createTextNode('Passwords are not match!'));
        }
      } else if (!this.changePasswordFormOldPassword.value) {
        this.changePasswordWindowInfo.appendChild(document.createTextNode('Please, enter your old password!'));
      } else if (!this.changePasswordFormNewPassword.value) {
        this.changePasswordWindowInfo.appendChild(document.createTextNode('Please, enter new password!'));
      } else if (!this.changePasswordFormNewPasswordConfirm.value) {
        this.changePasswordWindowInfo.appendChild(document.createTextNode('Please, confirm new password!'));
      }
    }
  }, {
    key: "userRegister",
    value: function userRegister() {
      var _this8 = this;

      /**
       * POST: json =  {"newUserName": "string",  "password": "string"}
       * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
      'error_message': 'string' or null}
       */
      removeChildren(this.registerWindowInfo);

      if (this.registerFormUsername.value && this.registerFormPassword.value && this.registerFormPasswordConfirm.value && this.agreementCheckbox.checked === true) {
        if (this.registerFormPassword.value === this.registerFormPasswordConfirm.value) {
          var newUserName = this.registerFormUsername.value;
          var password = this.registerFormPassword.value;
          var sendData = {
            "newUserName": newUserName,
            "password": password
          };

          var register = function register(answer) {
            if (answer['ok'] === true) {
              _this8.registerFormUsername.value = "";
              _this8.registerFormPassword.value = "";
              _this8.registerFormPasswordConfirm.value = "";

              _this8.registerWindowInfo.appendChild(document.createTextNode("New user " + newUserName + " successfully created!"));
            } else if (answer['error_code'] === 1062) {
              _this8.registerWindowInfo.appendChild(document.createTextNode("Name " + newUserName + " is already used!"));
            } else {
              _this8.registerWindowInfo.appendChild(document.createTextNode(answer['error_message'] + ' Код ошибки: ' + answer['error_code']));
            }
          };

          knock_knock('/user_register', register, sendData);
        } else {
          this.registerWindowInfo.appendChild(document.createTextNode('Passwords are not match!'));
        }
      } else if (!this.registerFormUsername.value) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, enter new user name!'));
      } else if (!this.registerFormPassword.value) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, enter Password!'));
      } else if (!this.registerFormPasswordConfirm.value) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, confirm Password!'));
      } else if (!this.agreementCheckbox.checked) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, accept agreements!'));
      }
    }
  }]);

  return Login;
}();

var TaskListReact = /*#__PURE__*/function (_React$Component) {
  _inherits(TaskListReact, _React$Component);

  var _super = _createSuper(TaskListReact);

  function TaskListReact(props) {
    var _this9;

    _classCallCheck(this, TaskListReact);

    _this9 = _super.call(this, props);
    _this9.loginInst = _this9.props.loginInst;
    _this9.taskListInst = _this9.props.taskListInst;
    _this9.tasksTree = _this9.props.tasksTree;
    _this9.tasks = _this9.props.tasks;
    _this9.state = {
      linearTasksList: _this9.makeLinearList(_this9.tasks)
    };
    _this9.linearTasksList = _this9.makeLinearList(_this9.tasks);
    _this9.addTask = _this9.addTask.bind(_assertThisInitialized(_this9));
    _this9.addSubtask = _this9.addSubtask.bind(_assertThisInitialized(_this9));
    _this9.removeTask = _this9.removeTask.bind(_assertThisInitialized(_this9));
    _this9.textInputField = React.createRef();
    return _this9;
  }

  _createClass(TaskListReact, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('mount');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      console.log('unmount');
    }
  }, {
    key: "makeLinearList",
    value: function makeLinearList(tasksList) {
      var linearTasksList = [];

      function recursionWalk(tasksList) {
        var _iterator3 = _createForOfIteratorHelper(tasksList),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var task = _step3.value;
            linearTasksList.push(task);

            if (task.subtasks.length > 0) {
              recursionWalk(task.subtasks);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      recursionWalk(tasksList);
      return linearTasksList;
    }
    /**
     * POST: json = {'taskText': 'string', 'parentId' = 'number'}
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */

  }, {
    key: "addTask",
    value: function addTask(e) {
      var _this10 = this;

      e.preventDefault();

      if (this.textInputField.current.value) {
        var taskText = this.textInputField.current.value;
        this.textInputField.current.value = '';
        var sendData = {
          'taskText': taskText,
          'parentId': null
        };

        var add = function add(answer) {
          if (answer['ok'] === true) {
            var taskId = answer['task_id'];
            var newTask = new Task(taskId, taskText);

            _this10.tasksTree.set(newTask.id, newTask);

            _this10.tasks.push(newTask);

            _this10.setState({
              linearTasksList: _this10.makeLinearList(_this10.tasks)
            });
          } else if (answer['error_code'] === 401) {
            _this10.loginInst.forceLogOut();

            showInfoWindow('Authorisation problem!');
          }
        };

        knock_knock('/save_task', add, sendData);
      }
    }
    /**
     * POST: json = {'taskText': 'string', 'parentId' = 'number'}
     * GET:
     * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     */

  }, {
    key: "addSubtask",
    value: function addSubtask(subtaskParentId, subtaskText) {
      var _this11 = this;

      var sendData = {
        'taskText': subtaskText,
        'parentId': subtaskParentId
      };

      var add = function add(answer) {
        if (answer['ok'] === true) {
          var taskId = answer['task_id'];
          var newTask = new Task(taskId, subtaskText, subtaskParentId);

          _this11.tasksTree.set(taskId, newTask);

          _this11.tasksTree.get(subtaskParentId).subtasks.push(newTask);

          _this11.setState({
            linearTasksList: _this11.makeLinearList(_this11.tasks)
          });
        } else if (answer['error_code'] === 401) {
          _this11.loginInst.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      knock_knock('/save_task', add, sendData);
    }
    /**
     * POST: {taskId: 'number'}
     * GET:
     * if OK = true: json = {'ok': true}
     * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
     * 'error_message': 'string' or null}
     * @param task
     */

  }, {
    key: "removeTask",
    value: function removeTask(task) {
      var _this12 = this;

      var sendData = {
        'taskId': task.id
      };

      var remove = function remove(answer) {
        if (answer['ok'] === true) {
          if (_this12.tasksTree.has(task.parentId)) {
            var childrenList = _this12.tasksTree.get(task.parentId).subtasks;

            childrenList.splice(childrenList.indexOf(task), 1);
          } else {
            _this12.tasks.splice(_this12.tasks.indexOf(task), 1);
          }

          _this12.setState({
            linearTasksList: _this12.makeLinearList(_this12.tasks)
          });
        } else if (answer['error_code'] === 401) {
          _this12.loginInst.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      knock_knock('/delete_task', remove, sendData);
    }
  }, {
    key: "render",
    value: function render() {
      var _this13 = this;

      return /*#__PURE__*/React.createElement("div", {
        className: 'main_window'
      }, /*#__PURE__*/React.createElement("div", {
        className: "task_input"
      }, /*#__PURE__*/React.createElement("form", {
        onSubmit: this.addTask
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: 'task_input_field'
      }), /*#__PURE__*/React.createElement("input", {
        type: 'text',
        className: 'task_input_field',
        onSubmit: this.addTask,
        ref: this.textInputField
      }), /*#__PURE__*/React.createElement("button", {
        type: 'button',
        className: 'task_input_button',
        onClick: this.addTask
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/add_sub.svg",
        alt: "+"
      })))), /*#__PURE__*/React.createElement("div", {
        className: "main_tasks",
        id: 'main_tasks'
      }, this.state.linearTasksList.map(function (task) {
        return /*#__PURE__*/React.createElement(TaskReact, {
          key: task.id.toString(),
          loginInst: _this13.loginInst,
          taskInst: task,
          taskId: task.id,
          status: task.status,
          taskText: task.text,
          parentId: task.parentId,
          removeTaskFunc: _this13.removeTask,
          addSubtaskFunc: _this13.addSubtask
        });
      })));
    }
  }]);

  return TaskListReact;
}(React.Component);

var TaskReact = /*#__PURE__*/function (_React$Component2) {
  _inherits(TaskReact, _React$Component2);

  var _super2 = _createSuper(TaskReact);

  function TaskReact(props) {
    var _this14;

    _classCallCheck(this, TaskReact);

    _this14 = _super2.call(this, props);
    _this14.taskInst = _this14.props.taskInst;
    _this14.loginInst = _this14.props.loginInst;
    _this14.taskId = _this14.props.taskId;
    _this14.shadow = shadow();
    _this14.state = {
      status: _this14.props.status,
      showSubtaskDivButtonZIndex: '0',
      showSubtaskDivButtonDisabled: false,
      taskTextValue: _this14.props.taskText,
      taskTextOpacity: '1',
      removeTaskButtonDisabled: false,
      removeTaskButtonScale: 'scale(1)',
      removeTaskButtonTransitionDelay: '0',
      subtaskDivShowed: false,
      subtaskDivVisibility: 'hidden',
      subtaskTimerShow: null,
      subtaskTimerHide: null,
      subtaskTextFieldOpacity: '0',
      subtaskTextFieldWidth: '0',
      addSubtaskButtonDisabled: true,
      addSubtaskButtonOpacity: '0',
      addSubtaskButtonScale: 'scale(0)',
      addSubtaskButtonTransitionDelay: '0.2s',
      taskTextEditDivShowed: false,
      taskTextEditDivVisibility: 'hidden',
      taskTextEditFieldWidth: '0',
      taskTextEditFieldOpacity: '0',
      taskTextEditFieldScale: 'scale(0)',
      saveEditButtonScale: 'scale(0)',
      saveEditButtonTransitionDelay: '0'
    };
    _this14.finishTask = _this14.finishTask.bind(_assertThisInitialized(_this14));
    _this14.removeTask = _this14.removeTask.bind(_assertThisInitialized(_this14));
    _this14.showEditTaskField = _this14.showEditTaskField.bind(_assertThisInitialized(_this14));
    _this14.saveEdit = _this14.saveEdit.bind(_assertThisInitialized(_this14));
    _this14.showSubtaskField = _this14.showSubtaskField.bind(_assertThisInitialized(_this14));
    _this14.addSubtask = _this14.addSubtask.bind(_assertThisInitialized(_this14));
    _this14.addSubtaskByEnterKey = _this14.addSubtaskByEnterKey.bind(_assertThisInitialized(_this14));
    _this14.addSubtaskField = React.createRef();
    _this14.editTaskField = React.createRef();
    return _this14;
  }
  /**
   * POST: json = {'task_id': 'number', 'status': 'boolean'}
   * GET:
   * if OK = true: json = {'ok': true}
   * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
   * 'error_message': 'string' or null}
   */


  _createClass(TaskReact, [{
    key: "finishTask",
    value: function finishTask() {
      var _this15 = this;

      var taskStatus = this.state.status === false;
      var sendData = {
        'taskId': this.taskId,
        'status': taskStatus
      };

      var finish = function finish(answer) {
        if (answer['ok'] === true) {
          _this15.setState({
            status: taskStatus
          });
        } else if (answer['error_code'] === 401) {
          _this15.loginInst.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      knock_knock('/finish_task', finish, sendData);
    }
  }, {
    key: "removeTask",
    value: function removeTask() {
      this.props.removeTaskFunc(this.taskInst);
    }
  }, {
    key: "showSubtaskField",
    value: function showSubtaskField() {
      var _this16 = this;

      if (this.state.subtaskDivShowed === false) {
        this.shadow();
        this.subtaskDivHideTimer = clearTimeout(this.subtaskDivHideTimer);
        this.setState({
          subtaskDivShowed: true,
          showSubtaskDivButtonZIndex: '1',
          removeTaskButtonDisabled: true,
          removeTaskButtonScale: 'scale(0)',
          removeTaskButtonTransitionDelay: '0s',
          taskTextOpacity: '0.2',
          subtaskDivVisibility: 'visible',
          subtaskTextFieldOpacity: '1',
          subtaskTextFieldWidth: '65%',
          addSubtaskButtonDisabled: false,
          addSubtaskButtonOpacity: '1',
          addSubtaskButtonScale: 'scale(1)',
          addSubtaskButtonTransitionDelay: '0.2s'
        });
      } else {
        this.shadow();
        this.setState({
          subtaskDivShowed: false,
          removeTaskButtonDisabled: false,
          removeTaskButtonScale: 'scale(1)',
          removeTaskButtonTransitionDelay: '0.2s',
          taskTextOpacity: '1',
          subtaskTextFieldOpacity: '0',
          subtaskTextFieldWidth: '0',
          addSubtaskButtonDisabled: true,
          addSubtaskButtonOpacity: '0',
          addSubtaskButtonScale: 'scale(0)',
          addSubtaskButtonTransitionDelay: '0s'
        });
        this.subtaskDivHideTimer = setTimeout(function () {
          _this16.setState({
            subtaskDivVisibility: 'hidden',
            showSubtaskDivButtonZIndex: '0'
          });
        }, 700);
      }
    }
  }, {
    key: "addSubtask",
    value: function addSubtask() {
      if (this.addSubtaskField.current.value) {
        var subtaskText = this.addSubtaskField.current.value;
        this.addSubtaskField.current.value = '';
        this.showSubtaskField();
        this.props.addSubtaskFunc(this.taskId, subtaskText);
      }
    }
  }, {
    key: "addSubtaskByEnterKey",
    value: function addSubtaskByEnterKey(e) {
      if (e.keyCode === 13) {
        this.addSubtask();
      }
    }
  }, {
    key: "showEditTaskField",
    value: function showEditTaskField() {
      var _this17 = this;

      if (this.state.taskTextEditDivShowed === false) {
        this.shadow();
        this.hideEditDivTimer = clearTimeout(this.hideEditDivTimer);
        this.setState({
          taskTextEditDivShowed: true,
          showSubtaskDivButtonDisabled: true,
          taskTextEditDivVisibility: 'visible',
          taskTextEditFieldOpacity: '1',
          taskTextEditFieldScale: 'scale(1)',
          taskTextEditFieldWidth: '65%',
          removeTaskButtonScale: 'scale(0)',
          removeTaskButtonTransitionDelay: '0s',
          saveEditButtonScale: 'scale(1)',
          saveEditButtonTransitionDelay: '0.2s',
          taskTextOpacity: '0.2'
        });
        this.editTaskField.current.value = this.state.taskTextValue;
      } else {
        if (this.editTaskField.current.value !== this.state.taskTextValue) {
          var sendData = {
            'taskId': this.props.taskId,
            'taskText': this.editTaskField.current.value
          };

          var saveEdit = function saveEdit(answer) {
            if (answer['ok'] === true) {
              _this17.setState({
                taskTextValue: _this17.editTaskField.current.value
              });
            } else if (answer['error_code'] === 401) {
              _this17.loginInst.forceLogOut();

              showInfoWindow('Authorisation problem!');
            }
          };

          knock_knock('/save_edit_task', saveEdit, sendData);
        }

        this.shadow();
        this.setState({
          taskTextEditDivShowed: false,
          showSubtaskDivButtonDisabled: false,
          taskTextEditFieldOpacity: '0',
          taskTextEditFieldScale: 'scale(0)',
          taskTextEditFieldWidth: '0',
          removeTaskButtonScale: 'scale(1)',
          removeTaskButtonTransitionDelay: '0.2s',
          saveEditButtonScale: 'scale(0)',
          saveEditButtonTransitionDelay: '0s',
          taskTextOpacity: '1'
        });
        this.hideEditDivTimer = setTimeout(function () {
          _this17.setState({
            taskTextEditDivVisibility: 'hidden'
          });
        }, 700);
      }
    }
  }, {
    key: "saveEdit",
    value: function saveEdit(e) {
      if (e.keyCode === 13) {
        this.showEditTaskField();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: this.state.status === false ? 'task_div_content' : 'task_div_content finished_task'
      }, /*#__PURE__*/React.createElement("button", {
        className: 'task_finish_button',
        type: 'button',
        onClick: this.finishTask
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/check.svg",
        alt: "V"
      })), /*#__PURE__*/React.createElement("button", {
        className: 'show_subtask_input_button',
        style: {
          zIndex: this.state.showSubtaskDivButtonZIndex
        },
        onClick: this.showSubtaskField,
        disabled: this.state.showSubtaskDivButtonDisabled
      }, "+"), /*#__PURE__*/React.createElement("p", {
        className: 'task_text',
        style: {
          opacity: this.state.taskTextOpacity
        },
        onClick: this.showEditTaskField
      }, this.state.taskTextValue), /*#__PURE__*/React.createElement("button", {
        className: 'remove_task_button',
        style: {
          transform: this.state.removeTaskButtonScale,
          transitionDelay: this.state.removeTaskButtonTransitionDelay
        },
        disabled: this.state.removeTaskButtonDisabled,
        type: 'button',
        onClick: this.removeTask
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/delete.svg",
        alt: ""
      })), /*#__PURE__*/React.createElement("div", {
        className: 'subtask_div',
        style: {
          visibility: this.state.subtaskDivVisibility
        }
      }, /*#__PURE__*/React.createElement("input", {
        className: 'subtask_text_field',
        type: "text",
        style: {
          width: this.state.subtaskTextFieldWidth,
          opacity: this.state.subtaskTextFieldOpacity
        },
        onKeyDown: this.addSubtaskByEnterKey,
        ref: this.addSubtaskField
      }), /*#__PURE__*/React.createElement("button", {
        className: 'add_subtask_button',
        type: 'button',
        style: {
          opacity: this.state.addSubtaskButtonOpacity,
          transform: this.state.addSubtaskButtonScale,
          transitionDelay: this.state.addSubtaskButtonTransitionDelay
        },
        disabled: this.state.addSubtaskButtonDisabled,
        onClick: this.addSubtask
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/add_sub.svg",
        alt: "+"
      }))), /*#__PURE__*/React.createElement("div", {
        className: 'task_text_edit_div',
        style: {
          visibility: this.state.taskTextEditDivVisibility
        }
      }, /*#__PURE__*/React.createElement("input", {
        className: 'task_text_edit_field',
        style: {
          opacity: this.state.taskTextEditFieldOpacity,
          width: this.state.taskTextEditFieldWidth,
          transform: this.state.taskTextEditFieldScale
        },
        type: 'text',
        ref: this.editTaskField,
        onKeyDown: this.saveEdit
      }), /*#__PURE__*/React.createElement("button", {
        className: 'save_edit_button',
        style: {
          transform: this.state.saveEditButtonScale,
          transitionDelay: this.state.saveEditButtonTransitionDelay
        },
        type: 'button',
        onClick: this.showEditTaskField
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/edit.svg",
        alt: "+"
      }))));
    }
  }]);

  return TaskReact;
}(React.Component); //TODO Maybe compile class LoadingWindow and knock_knock function together????


var LoadingWindow = /*#__PURE__*/function () {
  function LoadingWindow() {
    _classCallCheck(this, LoadingWindow);

    this.isAlive = false;
    this.reqCount = 0;
    this.timerShow = undefined;
    this.timerHide = undefined;
    this.startTime = undefined;
    this.stopTime = undefined;
  }

  _createClass(LoadingWindow, [{
    key: "showWindow",
    value: function showWindow(loadingWindow) {
      var _this18 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          loadingWindow.style.visibility = 'visible';
          _this18.startTime = Date.now();
          _this18.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow(loadingWindow) {
      var _this19 = this;

      if (this.reqCount > 0) {
        this.reqCount--;
        this.stopTime = Date.now();
      }

      if (this.reqCount === 0) {
        this.timerShow = clearTimeout(this.timerShow);

        if (this.isAlive) {
          if (this.stopTime - this.startTime >= 200) {
            loadingWindow.style.visibility = 'hidden';
            this.isAlive = false;
          } else {
            this.timerHide = setTimeout(function () {
              loadingWindow.style.visibility = 'hidden';
              _this19.isAlive = false;
            }, 200 - (this.stopTime - this.startTime));
          }
        }
      }
    }
  }]);

  return LoadingWindow;
}();

//# sourceMappingURL=todo_classes_compiled.js.map
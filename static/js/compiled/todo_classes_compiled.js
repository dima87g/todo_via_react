'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskList = /*#__PURE__*/function () {
  function TaskList() {
    _classCallCheck(this, TaskList);

    this.tasks = [];
    this.tasksTree = new Map();
    this.loginClass = null;
  }

  _createClass(TaskList, [{
    key: "addTask",
    value: function addTask() {
      var _this = this;

      /**
       * POST: json = {'taskText': 'string', 'parentId' = 'number'}
       * GET:
       * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      if (document.getElementById("task_input_field").value) {
        var taskText = document.getElementById("task_input_field").value;
        document.getElementById("task_input_field").value = "";
        var sendData = {
          "taskText": taskText,
          "parentId": null
        };

        var add = function add(answer) {
          if (answer['ok'] === true) {
            var taskId = answer['task_id'];
            var newTask = new Task(_this.loginClass, _this, taskId, taskText);

            _this.tasksTree.set(newTask.id, newTask);

            _this.tasks.push(newTask);

            _this.updateDom();
          }

          if (answer["error_code"] === 401) {
            _this.loginClass.forceLogOut();

            showInfoWindow("Authorisation problem!");
          }
        };

        knock_knock('save_task', add, sendData);
      }
    }
  }, {
    key: "addSubtask",
    value: function addSubtask(taskObject, DOMElement) {
      var _this2 = this;

      /**
       * POST: json = {'taskText': 'string', 'parentId': 'number'}
       * GET:
       * if OK = true: json = {'ok': 'boolean', 'task_id': 'number'}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var subtaskDiv = DOMElement.parentNode;
      var taskDiv = subtaskDiv.parentNode;

      if (subtaskDiv.getElementsByClassName('subtask_text_field')[0].value) {
        var taskText = subtaskDiv.getElementsByClassName('subtask_text_field')[0].value;
        subtaskDiv.getElementsByClassName('subtask_text_field')[0].value = '';
        taskDiv.getElementsByClassName('show_subtask_input_button')[0].click();
        var parentId = taskObject.id;
        var sendData = {
          'taskText': taskText,
          'parentId': parentId
        };

        var add = function add(answer) {
          if (answer['ok'] === true) {
            var taskId = answer['task_id'];
            var newTask = new Task(_this2, taskId, taskText, parentId);

            _this2.tasksTree.set(taskId, newTask);

            taskObject.subtasks.push(newTask);

            _this2.updateDom();
          } else if (answer['error_code'] === 401) {
            _this2.loginClass.forceLogOut();

            showInfoWindow("Authorisation problem!");
          }
        };

        knock_knock('save_task', add, sendData);
      }
    }
  }, {
    key: "removeTask",
    value: function removeTask(node) {
      var _this3 = this;

      /**
       * @param {object} - Task instance object
       * POST: {taskId: 'number'}
       * GET:
       * if OK = true: json = {'ok': true}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var sendData = {
        'taskId': node.id
      };

      var remove = function remove(answer) {
        if (answer['ok'] === true) {
          if (_this3.tasksTree.has(node.parentId)) {
            var parentList = _this3.tasksTree.get(node.parentId).subtasks;

            parentList.splice(parentList.indexOf(node), 1);
          } else {
            _this3.tasks.splice(_this3.tasks.indexOf(node), 1);
          }

          _this3.tasksTree.delete(node.id);

          _this3.updateDom();
        } else if (answer["error_code"] === 401) {
          _this3.loginClass.forceLogOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      knock_knock('delete_task', remove, sendData);
    }
  }, {
    key: "updateDom",
    value: function updateDom() {
      var tasksParent = document.getElementById("main_tasks");
      var existTasks = document.getElementsByClassName("task");
      var linearTasksList = [];

      function linearTaskListFiller(tasks) {
        var _iterator = _createForOfIteratorHelper(tasks),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var task = _step.value;
            linearTasksList.push(task);

            if (task.subtasks.length > 0) {
              linearTaskListFiller(task.subtasks);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      linearTaskListFiller(this.tasks);
      var i = 0;

      for (i; i < linearTasksList.length; i++) {
        if (existTasks[i]) {
          linearTasksList[i].replaceTaskNode(existTasks[i]);
        } else {
          tasksParent.appendChild(linearTasksList[i].createTaskNode());
        }
      }

      while (existTasks[i]) {
        tasksParent.removeChild(tasksParent.lastChild);
      }
    }
  }]);

  return TaskList;
}();

var Task = /*#__PURE__*/function () {
  function Task(loginInst, taskList, id, text) {
    var parentId = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var status = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

    _classCallCheck(this, Task);

    this.loginInst = loginInst;
    this.taskList = taskList;
    this.id = id;
    this.text = text;
    this.parentId = parentId;
    this.status = status;
    this.subtasks = [];
  }

  _createClass(Task, [{
    key: "createTaskNode",
    value: function createTaskNode() {
      var self = this;
      var taskDiv = document.createElement("div");
      taskDiv.setAttribute("class", "task");
      ReactDOM.render( /*#__PURE__*/React.createElement(TaskReact, {
        loginInst: this.loginInst,
        taskList: this.taskList,
        taskId: this.id,
        taskText: this.text,
        status: this.status
      }), taskDiv);
      var removeTaskButton = taskDiv.getElementsByClassName('remove_task_button')[0];

      removeTaskButton.onclick = function () {
        self.taskList.removeTask(self);
      };

      return taskDiv;
    }
  }, {
    key: "replaceTaskNode",
    value: function replaceTaskNode(existTask) {
      var self = this;
      var finishButton = existTask.getElementsByClassName("task_finish_button")[0];
      var addSubtaskButton = existTask.getElementsByClassName('add_subtask_button')[0];
      var removeButton = existTask.getElementsByClassName("remove_task_button")[0];
      existTask.getElementsByTagName("p")[0].textContent = this.text;

      if (this.status === false) {
        existTask.setAttribute("class", "task");
      } else {
        existTask.setAttribute("class", "task finished_task");
      }

      finishButton.onclick = function () {
        self.taskList.finishTask(self);
      };

      addSubtaskButton.onclick = function () {
        self.taskList.addSubtask(self, this);
      };

      removeButton.onclick = function () {
        self.taskList.removeTask(self);
      };
    }
  }]);

  return Task;
}();

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
    this.userRegisterButton = document.getElementById("register_form_button");
    this.switchRegisterButton = document.getElementById("register_button");
    this.switchLoginButton = document.getElementById("login_button");
    this.userNameField = document.getElementById("user_name_field");
    this.userLogOutButton = document.getElementById('user_logout_button');
    this.userDeleteButton = document.getElementById("user_delete_button");
    this.loginFormUsername.focus();
    this.userLogOutButton.disabled = true;
    this.userDeleteButton.disabled = true;

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
      var _this4 = this;

      this.loginFormUsername.value = "";
      this.registerFormUsername.value = '';
      this.registerFormPassword.value = '';
      this.registerFormPasswordConfirm.value = '';
      removeChildren(this.loginWindowInfo);
      this.authMenu.style.opacity = '0';
      hideShadow();
      setTimeout(function () {
        _this4.authMenu.style.visibility = 'hidden'; // document.getElementById('task_input_field').focus();
      }, 500);
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      var _this5 = this;

      showShadow();
      removeChildren(this.userNameField);
      this.userLogOutButton.disabled = true;
      this.userDeleteButton.disabled = true;
      this.authMenu.style.visibility = 'visible';
      this.loginFormUsername.focus();
      setTimeout(function () {
        _this5.authMenu.style.opacity = '1';
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this6 = this;

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

          if (!_this6.userNameField.firstChild) {
            _this6.userNameField.appendChild(document.createTextNode(userName));

            _this6.userLogOutButton.disabled = false;
            _this6.userDeleteButton.disabled = false;
          }

          _this6.taskList = new TaskList();
          _this6.taskList.loginClass = _this6;
          var taskInputButton = document.getElementById("task_input_button");

          taskInputButton.onclick = function () {
            _this6.taskList.addTask();

            return false;
          };

          var tasksTree = _this6.taskList.tasksTree;

          var _iterator2 = _createForOfIteratorHelper(tasksFromServer),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var task = _step2.value;
              var taskId = task["task_id"];
              var taskText = task["task_text"];
              var taskStatus = task["task_status"];
              var parentId = task["parent_id"];
              tasksTree.set(taskId, new Task(_this6, _this6.taskList, taskId, taskText, parentId, taskStatus));
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          var _iterator3 = _createForOfIteratorHelper(tasksTree.values()),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _task = _step3.value;

              if (tasksTree.has(_task.parentId)) {
                tasksTree.get(_task.parentId).subtasks.push(_task);
              } else {
                _this6.taskList.tasks.push(_task);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          _this6.taskList.updateDom();
        }

        if (answer["error_code"] === 401) {
          _this6.forceLogOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      knock_knock('load_tasks', loadTasks);
    }
  }, {
    key: "logIn",
    value: function logIn() {
      var _this7 = this;

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

            _this7.userNameField.appendChild(document.createTextNode(_userName));

            _this7.userLogOutButton.disabled = false;
            _this7.userDeleteButton.disabled = false;

            _this7.hideLoginWindow();

            _this7.onLoad();
          } else {
            _this7.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
          }
        };

        knock_knock('user_login', login, sendData);
      } else if (!this.loginFormUsername.value) {
        this.loginWindowInfo.appendChild(document.createTextNode('Please, enter user name!'));
      } else if (!this.loginFormPassword.value) {
        this.loginWindowInfo.appendChild(document.createTextNode('Please, enter password!'));
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      var _this8 = this;

      var out = function out() {
        _this8.taskList = null;
        document.cookie = "id=; expires=-1";
        document.cookie = "sign=; expires=-1";
        var tasksParent = document.getElementById("main_tasks");
        removeChildren(tasksParent);

        _this8.showLoginWindow();
      };

      showConfirmWindow(out, 'Are you sure, you want to log out?');
    }
  }, {
    key: "forceLogOut",
    value: function forceLogOut() {
      this.taskList = null;
      document.cookie = 'id=; expires=-1';
      document.cookie = 'sign=; expires=-1';
      var taskParent = document.getElementById('main_tasks');
      removeChildren(taskParent);
      this.showLoginWindow();
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      var _this9 = this;

      var confirm = function confirm() {
        knock_knock("user_delete", del);
      };

      var del = function del(answer) {
        if (answer["ok"] === true) {
          _this9.forceLogOut();
        }

        if (answer["error_code"] === 401) {
          _this9.forceLogOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      showConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }
  }, {
    key: "userRegister",
    value: function userRegister() {
      var _this10 = this;

      /**
       * POST: json =  {"newUserName": "string",  "password": "string"}
       * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
      'error_message': 'string' or null}
       */
      removeChildren(this.registerWindowInfo);

      if (this.registerFormUsername.value && this.registerFormPassword.value && this.registerFormPasswordConfirm.value) {
        if (this.registerFormPassword.value === this.registerFormPasswordConfirm.value) {
          var newUserName = this.registerFormUsername.value;
          var password = this.registerFormPassword.value;
          var sendData = {
            "newUserName": newUserName,
            "password": password
          };

          var register = function register(answer) {
            if (answer['ok'] === true) {
              _this10.registerFormUsername.value = "";
              _this10.registerFormPassword.value = "";
              _this10.registerFormPasswordConfirm.value = "";

              _this10.registerWindowInfo.appendChild(document.createTextNode("New user " + newUserName + " successfully created!"));
            } else if (answer['error_code'] === 1062) {
              _this10.registerWindowInfo.appendChild(document.createTextNode("Name " + newUserName + " is already used!"));
            } else {
              _this10.registerWindowInfo.appendChild(document.createTextNode(answer['error_message'] + ' Код ошибки: ' + answer['error_code']));
            }
          };

          knock_knock('user_register', register, sendData);
        } else {
          this.registerWindowInfo.appendChild(document.createTextNode('Passwords are not match!'));
        }
      } else if (!this.registerFormUsername.value) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, enter new user name!'));
      } else if (!this.registerFormPassword.value) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, enter Password!'));
      } else if (!this.registerFormPasswordConfirm.value) {
        this.registerWindowInfo.appendChild(document.createTextNode('Please, confirm Password!'));
      }
    }
  }]);

  return Login;
}();

var TaskReact = /*#__PURE__*/function (_React$Component) {
  _inherits(TaskReact, _React$Component);

  var _super = _createSuper(TaskReact);

  function TaskReact(props) {
    var _this11;

    _classCallCheck(this, TaskReact);

    _this11 = _super.call(this, props);
    _this11.loginInst = _this11.props.loginInst;
    _this11.taskList = _this11.props.taskList;
    _this11.shadow = shadow();
    _this11.state = {
      status: _this11.props.status,
      showSubtaskDivButtonZIndex: '0',
      showSubtaskDivButtonDisabled: false,
      taskTextValue: _this11.props.taskText,
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
    _this11.finishTask = _this11.finishTask.bind(_assertThisInitialized(_this11));
    _this11.showEditTaskField = _this11.showEditTaskField.bind(_assertThisInitialized(_this11));
    _this11.saveEdit = _this11.saveEdit.bind(_assertThisInitialized(_this11));
    _this11.showSubtaskField = _this11.showSubtaskField.bind(_assertThisInitialized(_this11));
    _this11.editTextField = React.createRef();
    return _this11;
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
      var _this12 = this;

      var taskStatus = this.state.status === false;
      var sendData = {
        'taskId': this.props.taskId,
        'status': taskStatus
      };

      var finish = function finish(answer) {
        if (answer['ok'] === true) {
          _this12.setState({
            status: taskStatus
          });
        } else if (answer['error_code'] === 401) {
          _this12.loginInst.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      knock_knock('finish_task', finish, sendData);
    }
  }, {
    key: "showSubtaskField",
    value: function showSubtaskField() {
      var _this13 = this;

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
          addSubtaskButtonOpacity: '0',
          addSubtaskButtonScale: 'scale(0)',
          addSubtaskButtonTransitionDelay: '0s'
        });
        this.subtaskDivHideTimer = setTimeout(function () {
          _this13.setState({
            subtaskDivVisibility: 'hidden',
            showSubtaskDivButtonZIndex: '0'
          });
        }, 700);
      }
    }
  }, {
    key: "showEditTaskField",
    value: function showEditTaskField() {
      var _this14 = this;

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
        this.editTextField.current.value = this.state.taskTextValue;
      } else {
        if (this.editTextField.current.value !== this.state.taskTextValue) {
          var sendData = {
            'taskId': this.props.taskId,
            'taskText': this.editTextField.current.value
          };

          var saveEdit = function saveEdit(answer) {
            if (answer['ok'] === true) {
              _this14.setState({
                taskTextValue: _this14.editTextField.current.value
              });
            } else if (answer['error_code'] === 401) {
              _this14.loginInst.forceLogOut();

              showInfoWindow('Authorisation problem!');
            }
          };

          knock_knock('save_edit_task', saveEdit, sendData);
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
          _this14.setState({
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
        type: 'button'
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
        }
      }), /*#__PURE__*/React.createElement("button", {
        className: 'add_subtask_button',
        type: 'button',
        style: {
          opacity: this.state.addSubtaskButtonOpacity,
          transform: this.state.addSubtaskButtonScale,
          transitionDelay: this.state.addSubtaskButtonTransitionDelay
        }
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
        ref: this.editTextField,
        onKeyDown: this.saveEdit // onBlur={this.showEditTaskField}

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
      var _this15 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          loadingWindow.style.visibility = 'visible';
          _this15.startTime = Date.now();
          _this15.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow(loadingWindow) {
      var _this16 = this;

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
              _this16.isAlive = false;
            }, 200 - (this.stopTime - this.startTime));
          }
        }
      }
    }
  }]);

  return LoadingWindow;
}();

//# sourceMappingURL=todo_classes_compiled.js.map
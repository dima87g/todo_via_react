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
            var newTask = new Task(_this, taskId, taskText);

            _this.tasksTree.set(newTask.id, newTask);

            _this.tasks.push(newTask);

            _this.updateDom();
          }

          if (answer["error_code"] === 401) {
            _this.loginClass.logOut();

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
            _this2.loginClass.logOut();

            showInfoWindow("Authorisation problem!");
          }
        };

        knock_knock('save_task', add, sendData);
      }
    }
  }, {
    key: "finishTask",
    value: function finishTask(node) {
      var _this3 = this;

      /**
       * POST: json = {'task_id': 'number', 'status': 'boolean'}
       * GET:
       * if OK = true: json = {'ok': true}
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       * 'error_message': 'string' or null}
       */
      var taskStatus = node.status === false;
      var sendData = {
        "taskId": node.id,
        "status": taskStatus
      };

      var finish = function finish(answer) {
        if (answer['ok'] === true) {
          node.status = taskStatus;

          _this3.updateDom();
        }

        if (answer["error_code"] === 401) {
          _this3.loginClass.logOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      knock_knock('finish_task', finish, sendData);
    }
  }, {
    key: "removeTask",
    value: function removeTask(node) {
      var _this4 = this;

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
          if (_this4.tasksTree.has(node.parentId)) {
            var parentList = _this4.tasksTree.get(node.parentId).subtasks;

            parentList.splice(parentList.indexOf(node), 1);
          } else {
            _this4.tasks.splice(_this4.tasks.indexOf(node), 1);
          }

          _this4.tasksTree.delete(node.id);

          _this4.updateDom();
        } else if (answer["error_code"] === 401) {
          _this4.loginClass.logOut();

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
  function Task(taskList, id, text) {
    var parentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var status = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, Task);

    this.taskList = taskList;
    this.id = id;
    this.text = text;
    this.parentId = parentId;
    this.status = status;
    this.subtasks = [];
  }

  _createClass(Task, [{
    key: "showSubtaskInput",
    value: function showSubtaskInput() {
      var showed = false;
      var timerShow = null;
      var timerHide = null;
      var timerEnableButton = null;
      return function () {
        var taskText = this.parentNode.getElementsByClassName('task_text')[0];
        var removeButton = this.parentNode.getElementsByClassName('task_remove_button')[0];
        var subtaskDiv = this.parentNode.getElementsByClassName('subtask_div')[0];
        var subtaskTextField = this.parentNode.getElementsByClassName('subtask_text_field')[0];
        var addSubtaskButton = this.parentNode.getElementsByClassName('add_subtask_button')[0];
        var addSubtaskButtonIcon = addSubtaskButton.firstChild;

        if (showed === false) {
          showed = true;
          removeButton.disabled = true; // addSubtaskButton.disabled = false;

          timerHide = clearTimeout(timerHide);
          removeButton.style.transitionDelay = '0s';
          removeButton.style.opacity = '0';
          removeButton.style.transform = 'scale(0)'; // taskText.style.transitionDelay = '0s';

          taskText.style.opacity = '0';
          subtaskDiv.style.visibility = 'visible';
          subtaskTextField.style.visibility = 'visible';
          addSubtaskButton.style.visibility = 'visible';
          addSubtaskButtonIcon.style.visibility = 'visible'; // subtaskTextField.style.display = 'inline-block';
          // addSubtaskButton.style.display = 'inline-block';
          // addSubtaskButtonIcon.style.display = 'inline-block';

          timerShow = setTimeout(function () {
            subtaskTextField.style.opacity = '1';
            subtaskTextField.style.width = '65%';
            addSubtaskButton.style.transitionDelay = '0.2s';
            addSubtaskButton.style.opacity = '1';
            addSubtaskButton.style.transform = 'scale(1)';
          });
          timerEnableButton = setTimeout(function () {
            addSubtaskButton.disabled = false;
            taskText.style.visibility = 'hidden';
          }, 700);
        } else {
          showed = false;
          addSubtaskButton.disabled = true;
          timerShow = clearTimeout(timerShow);
          timerEnableButton = clearTimeout(timerEnableButton);
          removeButton.style.transitionDelay = '0.2s';
          removeButton.style.opacity = '1';
          removeButton.style.transform = 'scale(1)'; // taskText.style.transitionDelay = '0.5s';

          taskText.style.visibility = 'visible';
          taskText.style.opacity = '1';
          subtaskTextField.value = '';
          subtaskTextField.style.opacity = '0';
          subtaskTextField.style.width = '0';
          addSubtaskButton.style.transitionDelay = '0s';
          addSubtaskButton.style.opacity = '0';
          addSubtaskButton.style.transform = 'scale(0)';
          timerHide = setTimeout(function () {
            removeButton.disabled = false; // subtaskDiv.style.display = 'none';
            // subtaskTextField.style.display = 'none';
            // addSubtaskButton.style.display = 'none';
            // addSubtaskButtonIcon.style.visibility = 'none';

            subtaskTextField.style.visibility = 'hidden';
            addSubtaskButton.style.visibility = 'hidden';
            addSubtaskButtonIcon.style.visibility = 'hidden';
            subtaskDiv.style.visibility = 'hidden';
          }, 700);
        }
      };
    }
  }, {
    key: "createTaskNode",
    value: function createTaskNode() {
      var self = this;
      var taskDiv = document.createElement("div");
      taskDiv.setAttribute("class", "task");
      var taskDivContent = document.createElement('div');
      taskDivContent.setAttribute('class', 'task_div_content');
      var finishButton = document.createElement('button');
      finishButton.setAttribute('type', 'submit');
      finishButton.setAttribute('class', 'task_finish_button');
      var finishButtonIcon = document.createElement('img');
      finishButtonIcon.setAttribute('src', '../static/icons/check.svg');
      finishButton.appendChild(finishButtonIcon);

      if (this.status === true) {
        taskDiv.setAttribute("class", "task finished_task");
      }

      finishButton.onclick = function () {
        self.taskList.finishTask(self);
      };

      var showSubtaskDivButton = document.createElement('input');
      showSubtaskDivButton.setAttribute('type', 'button');
      showSubtaskDivButton.setAttribute('class', 'show_subtask_input_button');
      showSubtaskDivButton.setAttribute('value', '+');
      showSubtaskDivButton.onclick = this.showSubtaskInput();
      var subtaskDiv = document.createElement('div');
      subtaskDiv.setAttribute('class', 'subtask_div');
      var subtaskTextField = document.createElement('input');
      subtaskTextField.setAttribute('type', 'text');
      subtaskTextField.setAttribute('class', 'subtask_text_field');
      var addSubtaskButton = document.createElement('button');
      addSubtaskButton.setAttribute('type', 'submit');
      addSubtaskButton.setAttribute('class', 'add_subtask_button');
      var addSubtaskButtonIcon = document.createElement('img');
      addSubtaskButtonIcon.setAttribute('src', 'static/icons/add_sub.svg');
      addSubtaskButton.appendChild(addSubtaskButtonIcon);

      function noEnterRefreshAddSubtaskButton(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          addSubtaskButton.click();
        }
      }

      subtaskTextField.addEventListener('keydown', noEnterRefreshAddSubtaskButton, false);

      addSubtaskButton.onclick = function () {
        self.taskList.addSubtask(self, this);
      };

      subtaskDiv.appendChild(subtaskTextField);
      subtaskDiv.appendChild(addSubtaskButton);
      var par = document.createElement("p");
      par.appendChild(document.createTextNode(this.text));
      par.setAttribute("class", "task_text");
      var removeButton = document.createElement('button');
      removeButton.setAttribute('type', 'submit');
      removeButton.setAttribute('class', 'task_remove_button');
      var removeButtonIcon = document.createElement('img');
      removeButtonIcon.setAttribute('src', 'static/icons/delete.svg');
      removeButton.appendChild(removeButtonIcon);

      removeButton.onclick = function () {
        self.taskList.removeTask(self);
      };

      taskDiv.appendChild(finishButton);
      taskDiv.appendChild(showSubtaskDivButton);
      taskDiv.appendChild(subtaskDiv);
      taskDiv.appendChild(par);
      taskDiv.appendChild(removeButton);
      return taskDiv;
    }
  }, {
    key: "replaceTaskNode",
    value: function replaceTaskNode(existTask) {
      var self = this;
      var finishButton = existTask.getElementsByClassName("task_finish_button")[0];
      var addSubtaskButton = existTask.getElementsByClassName('add_subtask_button')[0];
      var removeButton = existTask.getElementsByClassName("task_remove_button")[0];
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
    this.shadow = document.getElementById("shadow");
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
        windowChange(this.registerWindow, this.switchLoginButton, this.loginWindow, this.switchRegisterButton, this.registerFormUsername, this.loginWindowInfo);
      } else if (val === 'login') {
        windowChange(this.loginWindow, this.switchRegisterButton, this.registerWindow, this.switchLoginButton, this.loginFormUsername, this.registerWindowInfo);
      }

      function windowChange(activate, activateButton, deactivate, deactivateButton, focusField, infoField) {
        removeChilds(infoField);
        deactivate.style.opacity = '0';
        deactivateButton.disabled = true; // activate.style.display = 'block';

        activate.style.visibility = 'visible'; // focusField.focus();

        setTimeout(function () {
          activate.style.opacity = '1';
        });
        setTimeout(function () {
          // deactivate.style.display = 'none';
          deactivate.style.visibility = 'hidden';
          activateButton.disabled = false;
        }, 500);
      }
    }
  }, {
    key: "hideLoginWindow",
    value: function hideLoginWindow() {
      var _this5 = this;

      this.loginFormUsername.value = "";
      this.registerFormUsername.value = '';
      this.registerFormPassword.value = '';
      this.registerFormPasswordConfirm.value = '';
      removeChilds(this.loginWindowInfo);
      this.authMenu.style.opacity = '0'; // this.shadow.style.display = "none";

      hideShadow();
      setTimeout(function () {
        // this.authMenu.style.display = 'none';
        _this5.authMenu.style.visibility = 'hidden';
        document.getElementById('task_input_field').focus();
      }, 500);
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      var _this6 = this;

      // this.shadow.style.display = "block";
      showShadow();
      removeChilds(this.userNameField);
      this.userLogOutButton.disabled = true;
      this.userDeleteButton.disabled = true; // this.authMenu.style.display = 'flex';

      this.authMenu.style.visibility = 'visible';
      this.loginFormUsername.focus();
      setTimeout(function () {
        _this6.authMenu.style.opacity = '1';
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this7 = this;

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

          if (!_this7.userNameField.firstChild) {
            _this7.userNameField.appendChild(document.createTextNode(userName));

            _this7.userLogOutButton.disabled = false;
            _this7.userDeleteButton.disabled = false;
          }

          _this7.taskList = new TaskList();
          _this7.taskList.loginClass = _this7;
          var taskInputButton = document.getElementById("task_input_button");

          taskInputButton.onclick = function () {
            _this7.taskList.addTask();

            return false;
          };

          var tasksTree = _this7.taskList.tasksTree;

          var _iterator2 = _createForOfIteratorHelper(tasksFromServer),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var task = _step2.value;
              var taskId = task["task_id"];
              var taskText = task["task_text"];
              var taskStatus = task["task_status"];
              var parentId = task["parent_id"];
              tasksTree.set(taskId, new Task(_this7.taskList, taskId, taskText, parentId, taskStatus));
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
                _this7.taskList.tasks.push(_task);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          _this7.taskList.updateDom();
        }

        if (answer["error_code"] === 401) {
          _this7.logOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      knock_knock('load_tasks', loadTasks);
    }
  }, {
    key: "logIn",
    value: function logIn() {
      var _this8 = this;

      /**
       * POST: json = {"userName": "string", "password": "string"}
       * GET:
       * if OK = true: json = {"ok": "boolean", "user_id": "number",
       *                         "tasks": [{"task_id": "number", "task_text": "string", "status": "boolean"},
       *                                  ..........] }
       * if OK = false: json = {'ok': 'boolean', 'error_code': 'number' or null,
       *                        'error_message': 'string' or null}
       */
      removeChilds(this.loginWindowInfo);

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

            _this8.userNameField.appendChild(document.createTextNode(_userName));

            _this8.userLogOutButton.disabled = false;
            _this8.userDeleteButton.disabled = false;

            _this8.hideLoginWindow();

            _this8.onLoad();
          } else {
            _this8.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
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
      var _this9 = this;

      var out = function out() {
        _this9.taskList = null;
        document.cookie = "id=; expires=-1";
        document.cookie = "sign=; expires=-1";
        var tasksParent = document.getElementById("main_tasks");
        removeChilds(tasksParent);

        _this9.showLoginWindow();
      };

      showConfirmWindow(out, 'Are you sure, you want to log out?');
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      var _this10 = this;

      var confirm = function confirm() {
        knock_knock("user_delete", del);
      };

      var del = function del(answer) {
        if (answer["ok"] === true) {
          _this10.logOut();
        }

        if (answer["error_code"] === 401) {
          _this10.logOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      showConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }
  }, {
    key: "userRegister",
    value: function userRegister() {
      var _this11 = this;

      /**
       * POST: json =  {"newUserName": "string",  "password": "string"}
       * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
       'error_message': 'string' or null}
       */
      removeChilds(this.registerWindowInfo);

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
              _this11.registerFormUsername.value = "";
              _this11.registerFormPassword.value = "";
              _this11.registerFormPasswordConfirm.value = "";

              _this11.registerWindowInfo.appendChild(document.createTextNode("New user " + newUserName + " successfully created!"));
            } else if (answer['error_code'] === 1062) {
              _this11.registerWindowInfo.appendChild(document.createTextNode("Name " + newUserName + " is already used!"));
            } else {
              _this11.registerWindowInfo.appendChild(document.createTextNode(answer['error_message'] + ' Код ошибки: ' + answer['error_code']));
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
}(); //TODO Maybe compile class LoadingWindow and knock_knock function together????


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
      var _this12 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          // loadingWindow.style.display = "block";
          loadingWindow.style.visibility = 'visible';
          _this12.startTime = Date.now();
          _this12.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow(loadingWindow) {
      var _this13 = this;

      if (this.reqCount > 0) {
        this.reqCount--;
        this.stopTime = Date.now();
      }

      if (this.reqCount === 0) {
        this.timerShow = clearTimeout(this.timerShow);

        if (this.isAlive) {
          if (this.stopTime - this.startTime >= 200) {
            // loadingWindow.style.display = "none";
            loadingWindow.style.visibility = 'hidden';
            this.isAlive = false;
          } else {
            this.timerHide = setTimeout(function () {
              // loadingWindow.style.display = "none";
              loadingWindow.style.visibility = 'hidden';
              _this13.isAlive = false;
            }, 200 - (this.stopTime - this.startTime));
          }
        }
      }
    }
  }]);

  return LoadingWindow;
}();

var showLoading = new LoadingWindow();

function events() {
  function noEnterRefreshTaskInput(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("task_input_button").click();
    }
  }

  function noEnterRefreshLogin(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login_form_button").click();
    }
  }

  function noEnterRefreshRegister(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("register_form_button").click();
    }
  }

  var loginForm = document.forms['login_form'];
  loginForm.addEventListener("keydown", noEnterRefreshLogin, false);
  var registerForm = document.forms['register_form'];
  registerForm.addEventListener("keydown", noEnterRefreshRegister, false);
  var taskInputField = document.getElementById("task_input_field");
  taskInputField.addEventListener("keydown", noEnterRefreshTaskInput, false);
}

function knock_knock(path, func) {
  var sendData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var loadingWindow = document.getElementById("loading_window");
  showLoading.showWindow(loadingWindow);

  if (window.fetch) {
    var init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(sendData)
    };
    fetch(path, init).then(function (answer) {
      if (answer.ok && answer.headers.get('Content-Type') === 'application/json') {
        return answer.json();
      } else {
        return Promise.reject({
          "ok": false
        });
      }
    }).then(function (answer) {
      showLoading.hideWindow(loadingWindow);
      func(answer);
    }, function (error) {
      showLoading.hideWindow(loadingWindow);
      func(error);
    });
  } else {
    var req = new XMLHttpRequest();
    req.open('POST', path);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(sendData));

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status === 200 && req.getResponseHeader('Content-type') === 'application/json') {
          showLoading.hideWindow(loadingWindow);
          func(JSON.parse(req.responseText));
        }
      }
    };
  }
}

function showConfirmWindow(func, message) {
  var shadow = document.getElementById("shadow");
  var confirmWindow = document.getElementById("confirm_window");
  var confirmWindowMessage = document.getElementById("confirm_window_message");
  var okButton = document.getElementById("confirm_window_ok_button");
  var cancelButton = document.getElementById("confirm_window_cancel_button"); // shadow.style.display = "block";

  showShadow();
  confirmWindowMessage.appendChild(document.createTextNode(message)); // confirmWindow.style.display = "block";

  confirmWindow.style.visibility = 'visible';
  confirmWindow.style.opacity = '1'; // setTimeout(function() {
  //     shadow.style.opacity = "0.5";
  // })

  okButton.onclick = click;
  cancelButton.onclick = click;

  function click() {
    if (this.value === "OK") {
      func();
    } // shadow.style.display = "none";
    // confirmWindow.style.display = "none";


    hideShadow();
    confirmWindow.style.opacity = '0';
    setTimeout(function () {
      confirmWindow.style.visibility = 'hidden';
      confirmWindowMessage.removeChild(confirmWindowMessage.firstChild);
    }, 500);
  }
}

function showInfoWindow(message) {
  var infoWindow = document.getElementById("info_window");
  var infoWindowMessage = document.getElementById("info_window_message");
  removeChilds(infoWindowMessage);
  infoWindowMessage.appendChild(document.createTextNode(message)); // infoWindow.style.display = "block";

  infoWindow.style.visibility = 'visible';
  setTimeout(function () {
    // infoWindow.style.display = "none";
    infoWindow.style.visibility = 'hidden';
  }, 3000);
}

function showShadow() {
  var shadow = document.getElementById('shadow');
  shadow.style.visibility = 'visible';
  shadow.style.opacity = '0.5';
}

function hideShadow() {
  var shadow = document.getElementById('shadow');
  shadow.style.opacity = '0';
  setTimeout(function () {
    shadow.style.visibility = 'hidden';
  }, 500);
}

function removeChilds(field) {
  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }
}

function showCookiesAlertWindow() {
  var userLanguage = window.navigator.language;
  var cookiesAlertWindow = document.getElementById('cookies_alert_window');
  var cookiesAlertWindowText = document.getElementById('cookies_alert_window_text');
  var cookiesAlertWindowConfirmButton = document.getElementById('cookies_alert_confirm_button');

  if (userLanguage === 'en-US' || userLanguage === 'en') {
    cookiesAlertWindowText.appendChild(document.createTextNode('By continuing to use our site, you consent to the processing of' + ' cookies, which ensure the correct operation of the site.'));
  } else if (userLanguage === 'ru-RU' || userLanguage === 'ru') {
    cookiesAlertWindowText.appendChild(document.createTextNode('Продолжая использовать наш сайт, вы даете согласие на обработку' + '  файлов cookie, которые обеспечивают правильную работу сайта.'));
  }

  cookiesAlertWindowConfirmButton.onclick = function () {
    cookiesAlertWindow.style.opacity = '0';
    setTimeout(function () {
      cookiesAlertWindow.style.display = 'none';
    }, 500);
  };

  cookiesAlertWindow.style.display = 'block';
}

function authCheck(mainLogin) {
  var check = function check(answer) {
    if (answer["ok"] === true) {
      mainLogin.hideLoginWindow();
      mainLogin.onLoad();
    } else {
      showCookiesAlertWindow();
    }
  };

  knock_knock("/auth_check", check);
}

document.addEventListener('DOMContentLoaded', function () {
  var mainLogin = new Login();
  authCheck(mainLogin);
  events();
});

//# sourceMappingURL=script-compiled.js.map
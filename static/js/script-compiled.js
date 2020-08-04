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
    this.tasksTree = new Map();
    this.loginClass = undefined;
  }

  _createClass(TaskList, [{
    key: "addTask",
    value: function addTask() {
      var _this = this;

      /**
       * POST: json = {'user_id': 'number', taskText = 'string'}
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

      //FIXME Сделать изменение статуса задачи ТОЛЬКО после полодительного ответа от сервера, а не перед отправкой запроса на сервер.
      //FIXME Make task status change ONLY after positive answer from server, not before send request to server.

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
          node.status = node.status === false;

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
      return function () {
        var subtaskDiv = this.parentNode.getElementsByClassName('subtask_div')[0];
        var subtaskTextField = this.parentNode.getElementsByClassName('subtask_text_field')[0];
        var addSubtaskButton = this.parentNode.getElementsByClassName('add_subtask_button')[0];

        if (showed === false) {
          showed = true;
          timerHide = clearTimeout(timerHide);
          subtaskDiv.style.display = 'inline-block';
          subtaskTextField.style.display = 'inline-block';
          addSubtaskButton.style.display = 'inline-block';
          timerShow = setTimeout(function () {
            subtaskTextField.style.opacity = '1';
            subtaskTextField.style.width = '65%';
            subtaskTextField.focus();
            addSubtaskButton.style.transitionDelay = '0.5s';
            addSubtaskButton.style.opacity = '1';
            addSubtaskButton.style.width = '75px';
          }, 50);
        } else {
          showed = false;
          timerShow = clearTimeout(timerShow);
          subtaskTextField.value = '';
          subtaskTextField.style.opacity = '0';
          subtaskTextField.style.width = '0';
          addSubtaskButton.style.transitionDelay = '0s';
          addSubtaskButton.style.opacity = '0';
          addSubtaskButton.style.width = '0';
          document.getElementById('task_input_field').focus();
          timerHide = setTimeout(function () {
            subtaskDiv.style.display = 'none';
            subtaskTextField.style.display = 'none';
            addSubtaskButton.style.display = 'none';
          }, 1000);
        }
      };
    }
  }, {
    key: "createTaskNode",
    value: function createTaskNode() {
      var self = this;
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
        self.taskList.finishTask(self);
      };

      var showSubtaskInputButton = document.createElement('input');
      showSubtaskInputButton.setAttribute('type', 'button');
      showSubtaskInputButton.setAttribute('class', 'show_subtask_input_button');
      showSubtaskInputButton.setAttribute('value', 'sub');
      showSubtaskInputButton.onclick = this.showSubtaskInput();
      var subtaskDiv = document.createElement('div');
      subtaskDiv.setAttribute('class', 'subtask_div');
      var subtaskTextField = document.createElement('input');
      subtaskTextField.setAttribute('type', 'text');
      subtaskTextField.setAttribute('class', 'subtask_text_field');
      var addSubtaskButton = document.createElement('input');
      addSubtaskButton.setAttribute('type', 'button');
      addSubtaskButton.setAttribute('class', 'add_subtask_button');
      addSubtaskButton.setAttribute('value', 'add subtask');
      subtaskTextField.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          addSubtaskButton.click();
        }
      });

      addSubtaskButton.onclick = function () {
        self.taskList.addSubtask(self, this);
      };

      subtaskDiv.appendChild(subtaskTextField);
      subtaskDiv.appendChild(addSubtaskButton);
      var removeButton = document.createElement("input");
      removeButton.setAttribute("type", "button");
      removeButton.setAttribute("value", "X");
      removeButton.setAttribute("class", "task_remove_button");

      removeButton.onclick = function () {
        self.taskList.removeTask(self);
      };

      var par = document.createElement("p");
      par.appendChild(document.createTextNode(this.text));
      par.setAttribute("class", "paragraph");
      taskDiv.appendChild(finishButton);
      taskDiv.appendChild(showSubtaskInputButton);
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
      var showSubtaskInputButton = existTask.getElementsByClassName('show_subtask_input_button')[0];
      var addSubtaskButton = existTask.getElementsByClassName('add_subtask_button')[0];
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
    key: "hideLoginWindow",
    value: function hideLoginWindow() {
      var _this5 = this;

      this.loginFormUsername.value = "";
      removeChilds(this.loginWindowInfo);
      this.authMenu.style.opacity = '0';
      this.shadow.style.display = "none";
      setTimeout(function () {
        _this5.authMenu.style.display = 'none';
        document.getElementById('task_input_field').focus();
      }, 500);
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      var _this6 = this;

      this.shadow.style.display = "block";
      removeChilds(this.userNameField);
      this.userLogOutButton.disabled = true;
      this.userDeleteButton.disabled = true;
      this.authMenu.style.display = 'block';
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
          var userId = answer['user_id'];
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
          };

          _this7.taskList.userId = userId;
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
              var _userName = answer["user_name"];

              _this8.userNameField.appendChild(document.createTextNode(_userName));

              _this8.userLogOutButton.disabled = false;

              _this8.hideLoginWindow();

              _this8.onLoad();
            } else {
              _this8.loginWindowInfo.appendChild(document.createTextNode(answer["error_message"]));
            }
          };

          knock_knock('user_login', login, sendData);
        } else {
          this.loginWindowInfo.appendChild(document.createTextNode("Enter password!"));
        }
      } else {
        this.loginWindowInfo.appendChild(document.createTextNode('Please, enter user name!'));
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      this.taskList = null;
      document.cookie = "id=; expires=-1";
      document.cookie = "sign=; expires=-1";
      var tasksParent = document.getElementById("main_tasks");
      removeChilds(tasksParent);
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
          _this9.logOut();
        }

        if (answer["error_code"] === 401) {
          _this9.logOut();

          showInfoWindow("Authorisation problem!");
        }
      };

      showConfirmWindow(confirm, "Are you sure, you want to delete user?");
    }
  }, {
    key: "userRegister",
    value: function userRegister() {
      var _this10 = this;

      // TODO: Слишком большая вложенность, нужно попробовать переписать метод через конструкцию SWITCH

      /**
       * POST: json =  {"newUserName": "string",  "password": "string"}
       * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
       'error_message': 'string' or null}
       */
      removeChilds(this.registerWindowInfo);

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
              this.registerWindowInfo.appendChild(document.createTextNode("Passwords are not match!"));
            }
          } else {
            this.registerWindowInfo.appendChild(document.createTextNode("Please, confirm password!"));
          }
        } else {
          this.registerWindowInfo.appendChild(document.createTextNode("Please, enter new password!"));
        }
      } else {
        this.registerWindowInfo.appendChild(document.createTextNode("Please, enter new user name!"));
      }
    }
  }]);

  return Login;
}();

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
      var _this11 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          loadingWindow.style.display = "block";
          _this11.startTime = Date.now();
          _this11.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow(loadingWindow) {
      var _this12 = this;

      if (this.reqCount > 0) {
        this.reqCount--;
        this.stopTime = Date.now();
      }

      if (this.reqCount === 0) {
        this.timerShow = clearTimeout(this.timerShow);

        if (this.isAlive) {
          if (this.stopTime - this.startTime >= 200) {
            loadingWindow.style.display = "none";
            this.isAlive = false;
          } else {
            this.timerHide = setTimeout(function () {
              loadingWindow.style.display = "none";
              _this12.isAlive = false;
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

  var loginForm = document.forms.login_form;
  loginForm.addEventListener("keydown", noEnterRefreshLogin, false);
  var registerForm = document.forms.register_form;
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

function showInfoWindow(message) {
  var infoWindow = document.getElementById("info_window");
  var infoWindowMessage = document.getElementById("info_window_message");
  removeChilds(infoWindowMessage);
  infoWindowMessage.appendChild(document.createTextNode(message));
  infoWindow.style.display = "block";
  setTimeout(function () {
    infoWindow.style.display = "none";
  }, 3000);
}

function removeChilds(field) {
  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }
}

function authCheck(mainLogin) {
  var check = function check(answer) {
    if (answer["ok"] === true) {
      mainLogin.hideLoginWindow();
      mainLogin.onLoad();
    }
  };

  knock_knock("/auth_check", check);
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

document.addEventListener('DOMContentLoaded', function () {
  var mainLogin = new Login();
  authCheck(mainLogin);
  events();
});

//# sourceMappingURL=script-compiled.js.map
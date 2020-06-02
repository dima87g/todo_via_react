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
      var list = this;

      if (document.getElementById("task_input_field").value) {
        var add = function add(answer) {
          if (answer['ok'] === true) {
            var taskId = answer['task_id'];
            var newTask = new Task(taskId, taskText);
            list.tasks.push(newTask);
            list.updateDom();
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
      var list = this;
      node.status = node.status === false;
      var sendData = {
        "taskId": node.id,
        "status": node.status
      };

      function finish(answer) {
        if (answer['ok'] === true) {
          list.updateDom();
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
      var list = this;
      var sendData = {
        'taskId': node.id
      };

      function remove(answer) {
        if (answer['ok'] === true) {
          list.tasks.splice(list.tasks.indexOf(node), 1);
          list.updateDom();
        }
      }

      knock_knock('delete', sendData, remove);
    }
  }, {
    key: "updateDom",
    value: function updateDom() {
      var tasksParent = document.getElementById("tasks");
      var existTasks = document.getElementsByClassName("task");
      var i = 0;

      for (i; i < this.tasks.length; i++) {
        if (existTasks[i]) {
          this.tasks[i].replaceTaskNode(existTasks[i]);
        } else {
          tasksParent.append(this.tasks[i].createTaskNode());
        }
      }

      if (existTasks[i]) {
        for (i; i < existTasks.length; i++) {
          existTasks[i].remove();
        }
      }
    }
  }]);

  return TaskList;
}();

var Task = /*#__PURE__*/function () {
  function Task(id, text) {
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, Task);

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
        taskList.finishTask(node);
      };

      var removeButton = document.createElement("input");
      removeButton.setAttribute("type", "button");
      removeButton.setAttribute("value", "Удалить");
      removeButton.setAttribute("class", "task_remove_button");

      removeButton.onclick = function () {
        taskList.removeTask(node);
      };

      var par = document.createElement("p");
      par.append(this.text);
      par.setAttribute("class", "paragraph");
      taskDiv.append(finishButton);
      taskDiv.append(par);
      taskDiv.append(removeButton);
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
        taskList.finishTask(node);
      };

      removeButton.onclick = function () {
        taskList.removeTask(node);
      };
    }
  }]);

  return Task;
}(); //todo
// create login class (functions onLad, login, switchLogin, userRegister)


function onLoad(userName) {
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
    'userName': userName
  };

  function loadTasks(answer) {
    var menu = document.getElementById("auth_menu");
    var infoMessage = document.getElementById('login_form_info');

    if (answer['ok'] === true) {
      menu.style.opacity = '0%';
      setTimeout(function () {
        menu.style.display = 'none';
        document.getElementById('task_input_field').focus();
      }, 500);
      var userId = answer['user_id'];
      var tasksFromServer = answer['tasks'];
      taskList.userId = userId;

      var _iterator = _createForOfIteratorHelper(tasksFromServer),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var task = _step.value;
          taskList.tasks.push(new Task(task["task_id"], task["task_text"], task["status"]));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      taskList.updateDom();
    } else {
      infoMessage.textContent = 'Проблема(((((';
    }
  }

  knock_knock('load', sendData, loadTasks);
}

function switchLogin(val) {
  var loginWindow = document.getElementById('login_form');
  var registerButton = document.getElementById('register_button');
  var registerWindow = document.getElementById('register_form');
  var loginButton = document.getElementById('login_button');

  if (val === 'register') {
    windowChange(registerWindow, loginButton, loginWindow, registerButton);
  } else if (val === 'login') {
    windowChange(loginWindow, registerButton, registerWindow, loginButton);
  }

  function windowChange(activate, activateButton, deactivate, deactivateButton) {
    deactivate.style.opacity = '0%';
    deactivateButton.disabled = true;
    activate.style.display = 'block';
    setTimeout(function () {
      activate.style.opacity = '100%';
    });
    setTimeout(function () {
      deactivate.style.display = 'none';
      activateButton.disabled = false;
    }, 500);
  }
}

function loginButton() {
  /**
   * POST: json =  {userName: 'string'}
   * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
   'error_message': 'string' or null}
   */
  var userName = document.getElementById("login_field").value;
  document.getElementById("login_field").value = '';
  var infoMessage = document.getElementById('login_form_info');
  var sendData = {
    'userName': userName
  };

  function login(answer) {
    if (answer['ok'] === true) {
      onLoad(userName);
    } else {
      infoMessage.textContent = 'Авторизация не удалась =(';
    }
  }

  knock_knock('login', sendData, login);
}

function userRegisterButton() {
  /**
   * POST: json =  {newUserName: 'string'}
   * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null,
   'error_message': 'string' or null}
   */
  var infoMessage = document.getElementById("register_form_info");

  if (document.getElementById('register_form_text').value) {
    var register = function register(answer) {
      if (answer['ok'] === true) {
        infoMessage.textContent = 'New user ' + newUserName + ' successfully created!';
      } else if (answer['error_code'] === 1062) {
        infoMessage.textContent = 'Name ' + newUserName + ' is already used!';
      } else {
        infoMessage.textContent = answer['error_message'] + ' Код ошибки: ' + answer['error_code'];
      }
    };

    var newUserName = document.getElementById('register_form_text').value;
    var sendData = {
      'newUserName': newUserName
    };
    knock_knock('user_register', sendData, register);
  } else {
    infoMessage.textContent = 'Please, enter new user name!';
    infoMessage.style.color = 'red';
  }
}

function events() {
  function noEnterRefresh(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("task_input_button").click();
    }
  }

  var taskInputField = document.getElementById("task_input_field");
  taskInputField.addEventListener("keydown", noEnterRefresh, false);
}

function knock_knock(path, sendData, func) {
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

var taskList = new TaskList();
events();

//# sourceMappingURL=script-compiled.js.map
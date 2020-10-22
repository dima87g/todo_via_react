'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var App = /*#__PURE__*/function (_React$Component) {
  _inherits(App, _React$Component);

  var _super = _createSuper(App);

  function App() {
    var _this;

    _classCallCheck(this, App);

    _this = _super.call(this);
    _this.state = {
      shadow: {
        showed: true,
        opacity: '0.5',
        visibility: 'visible'
      },
      loadingWindow: {
        showed: false,
        reqCount: 0,
        startTime: null,
        stopTime: null
      },
      confirmWindow: {
        visibility: 'hidden',
        opacity: '0',
        message: ''
      },
      confirmWindowOnClick: null,
      userLogOutButtonDisabled: true,
      userDeleteButtonDisabled: true,
      changePasswordButtonDisabled: true
    };
    _this.authCheck = _this.authCheck.bind(_assertThisInitialized(_this));
    _this.createTaskList = _this.createTaskList.bind(_assertThisInitialized(_this));
    _this.logOut = _this.logOut.bind(_assertThisInitialized(_this));
    _this.changePassword = _this.changePassword.bind(_assertThisInitialized(_this));
    _this.userDelete = _this.userDelete.bind(_assertThisInitialized(_this));
    _this.showConfirmWindow = _this.showConfirmWindow.bind(_assertThisInitialized(_this));
    _this.knockKnock = _this.knockKnock.bind(_assertThisInitialized(_this));
    _this.login = React.createRef();
    _this.userNameField = React.createRef();
    _this.loadingWindow = React.createRef();
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.authCheck();
    }
  }, {
    key: "authCheck",
    value: function authCheck() {
      var _this2 = this;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200) {
          _this2.createTaskList();

          _this2.login.current.hideLoginWindow();
        } else {
          showCookiesAlertWindow();
        }
      };

      this.knockKnock('/auth_check', responseHandler);
    }
  }, {
    key: "createTaskList",
    value: function createTaskList() {
      var _this3 = this;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200) {
          var userName = response.data['user_name'];
          var tasksFromServer = response.data['tasks'];

          _this3.userNameField.current.appendChild(document.createTextNode(userName));

          ReactDOM.render( /*#__PURE__*/React.createElement(TaskListReact, {
            app: _this3,
            login: _this3.login.current,
            tasksFromServer: tasksFromServer
          }), document.getElementById('task_list'));
        } else if (response.status === 401) {
          _this3.login.current.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.knockKnock('/load_tasks', responseHandler);
    }
  }, {
    key: "removeChildren",
    value: function removeChildren(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      this.login.current.logOut();
    }
  }, {
    key: "changePassword",
    value: function changePassword() {
      this.login.current.changePasswordWindow();
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      this.login.current.userDelete();
    }
  }, {
    key: "showConfirmWindow",
    value: function showConfirmWindow(message, func) {
      confirmWindowOnClick = confirmWindowOnClick.bind(this);
      this.showShadowModal();

      function confirmWindowOnClick(e) {
        var _this4 = this;

        if (e.target.value === 'ok') {
          func();
        }

        this.setState({
          confirmWindow: _objectSpread(_objectSpread({}, this.state.confirmWindow), {}, {
            opacity: '0',
            message: ''
          })
        });
        setTimeout(function () {
          _this4.setState({
            confirmWindow: _objectSpread(_objectSpread({}, _this4.state.confirmWindow), {}, {
              visibility: 'hidden'
            })
          });
        }, 500);
        this.hideShadowModal();
      }

      this.setState({
        confirmWindow: _objectSpread(_objectSpread({}, this.state.confirmWindow), {}, {
          visibility: 'visible',
          opacity: '1',
          message: message
        }),
        confirmWindowOnClick: confirmWindowOnClick
      });
    }
  }, {
    key: "showShadowModal",
    value: function showShadowModal() {
      this.hideShadowModalTimeout = clearTimeout(this.hideShadowModalTimeout);
      this.setState({
        shadow: _objectSpread(_objectSpread({}, this.state.shadow), {}, {
          visibility: 'visible',
          opacity: '0.5'
        })
      });
    }
  }, {
    key: "hideShadowModal",
    value: function hideShadowModal() {
      var _this5 = this;

      this.setState({
        shadow: _objectSpread(_objectSpread({}, this.state.shadow), {}, {
          opacity: '0'
        })
      });
      this.hideShadowModalTimeout = setTimeout(function () {
        _this5.setState({
          shadow: _objectSpread(_objectSpread({}, _this5.state.shadow), {}, {
            visibility: 'hidden'
          })
        });
      }, 500);
    }
  }, {
    key: "knockKnock",
    value: function knockKnock(path, func, sendData) {
      var _this6 = this;

      var req = axios.default;
      this.loadingWindow.current.showWindow();
      req.post(path, sendData).then(function (response) {
        _this6.loadingWindow.current.hideWindow();

        if (response.headers['content-type'] === 'application/json') {
          func(response);
        }
      }).catch(function (error) {
        _this6.loadingWindow.current.hideWindow();

        console.log(error);
        func(error.response);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: 'app',
        id: 'app'
      }, /*#__PURE__*/React.createElement("div", {
        className: "header"
      }, /*#__PURE__*/React.createElement("a", {
        href: "/ru",
        className: 'language_switch_button'
      }, "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"), /*#__PURE__*/React.createElement("a", {
        href: "/en",
        className: 'language_switch_button'
      }, "English"), /*#__PURE__*/React.createElement("p", {
        className: "user_name_field",
        id: 'user_name_field',
        ref: this.userNameField
      }), /*#__PURE__*/React.createElement("input", {
        type: "button",
        className: "user_logout_button",
        id: "user_logout_button",
        value: localisation['buttons']['logout'],
        disabled: this.state.userLogOutButtonDisabled,
        onClick: this.logOut
      }), /*#__PURE__*/React.createElement("input", {
        type: "button",
        className: "user_delete_button",
        id: "user_delete_button",
        value: localisation['buttons']['delete_user'],
        disabled: this.state.userDeleteButtonDisabled,
        onClick: this.userDelete
      }), /*#__PURE__*/React.createElement("input", {
        type: "button",
        className: "change_password_button",
        id: "change_password_button",
        value: localisation['buttons']['change_password'],
        disabled: this.state.changePasswordButtonDisabled,
        onClick: this.changePassword
      }), /*#__PURE__*/React.createElement("p", {
        className: "version"
      }, "Ver. 1.8")), /*#__PURE__*/React.createElement("div", {
        className: 'task_list',
        id: 'task_list'
      }), /*#__PURE__*/React.createElement(LoginReact, {
        app: this,
        ref: this.login
      }), /*#__PURE__*/React.createElement("div", {
        className: "confirm_window",
        id: "confirm_window",
        style: {
          visibility: this.state.confirmWindow.visibility,
          opacity: this.state.confirmWindow.opacity
        }
      }, /*#__PURE__*/React.createElement("p", {
        className: "confirm_window_message",
        id: "confirm_window_message"
      }, this.state.confirmWindow.message), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "confirm_window_ok_button",
        id: "confirm_window_ok_button",
        value: "ok",
        onClick: this.state.confirmWindowOnClick
      }, "OK"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "confirm_window_cancel_button",
        id: "confirm_window_cancel_button",
        value: "cancel",
        onClick: this.state.confirmWindowOnClick
      }, localisation['confirm_window']['cancel_button'])), /*#__PURE__*/React.createElement("div", {
        className: "info_window",
        id: "info_window"
      }, /*#__PURE__*/React.createElement("p", {
        className: "info_window_message",
        id: "info_window_message"
      })), /*#__PURE__*/React.createElement(LoadingWindowReact, {
        ref: this.loadingWindow
      }), /*#__PURE__*/React.createElement("div", {
        className: 'shadow',
        id: 'shadow',
        style: {
          visibility: this.state.shadow.visibility,
          opacity: this.state.shadow.opacity
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "cookies_alert_window",
        id: "cookies_alert_window"
      }, /*#__PURE__*/React.createElement("p", {
        className: "cookies_alert_window_text",
        id: "cookies_alert_window_text"
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "cookies_alert_confirm_button",
        id: "cookies_alert_confirm_button"
      }, "OK")));
    }
  }]);

  return App;
}(React.Component);

var LoginReact = /*#__PURE__*/function (_React$Component2) {
  _inherits(LoginReact, _React$Component2);

  var _super2 = _createSuper(LoginReact);

  function LoginReact(props) {
    var _this7;

    _classCallCheck(this, LoginReact);

    _this7 = _super2.call(this, props);
    _this7.app = _this7.props.app;
    _this7.state = {
      authMenu: {
        opacity: '1',
        visibility: 'visible'
      },
      loginWindow: {
        opacity: 1,
        visibility: 'inherit'
      },
      loginWindowSwitchButton: {
        disabled: false
      },
      registerWindow: {
        opacity: 0,
        visibility: 'hidden'
      },
      registerWindowSwitchButton: {
        disabled: true
      },
      changePasswordWindow: {
        showed: false,
        cancelButtonDisabled: true,
        submitButtonDisabled: true
      },
      changePasswordWindowShowed: false,
      changePasswordBWindowCancelButtonDisabled: true
    };
    _this7.switchLogin = _this7.switchLogin.bind(_assertThisInitialized(_this7));
    _this7.hideLoginWindow = _this7.hideLoginWindow.bind(_assertThisInitialized(_this7));
    _this7.login = _this7.login.bind(_assertThisInitialized(_this7));
    _this7.logOut = _this7.logOut.bind(_assertThisInitialized(_this7));
    _this7.userDelete = _this7.userDelete.bind(_assertThisInitialized(_this7));
    _this7.changePasswordWindow = _this7.changePasswordWindow.bind(_assertThisInitialized(_this7));
    _this7.changePassword = _this7.changePassword.bind(_assertThisInitialized(_this7));
    _this7.userRegister = _this7.userRegister.bind(_assertThisInitialized(_this7));
    _this7.loginFormUsernameField = React.createRef();
    _this7.loginFormPasswordField = React.createRef();
    _this7.registerFormUsernameField = React.createRef();
    _this7.registerFormPasswordField = React.createRef();
    _this7.registerFormPasswordConfirmField = React.createRef();
    _this7.loginFormInfo = React.createRef();
    _this7.registerFormInfo = React.createRef();
    _this7.changePasswordFormInfo = React.createRef();
    return _this7;
  }

  _createClass(LoginReact, [{
    key: "switchLogin",
    value: function switchLogin(e) {
      if (e.target.value === 'register') {
        this.setState({
          loginWindow: _objectSpread(_objectSpread({}, this.state.loginWindow), {}, {
            opacity: 0,
            visibility: 'hidden'
          }),
          loginWindowSwitchButton: _objectSpread(_objectSpread({}, this.state.loginWindowSwitchButton), {}, {
            disabled: true
          }),
          registerWindow: _objectSpread(_objectSpread({}, this.state.registerWindow), {}, {
            opacity: 1,
            visibility: 'inherit'
          }),
          registerWindowSwitchButton: _objectSpread(_objectSpread({}, this.state.registerWindowSwitchButton), {}, {
            disabled: false
          })
        });
        this.loginFormUsernameField.current.value = '';
        this.loginFormPasswordField.current.value = '';
        this.app.removeChildren(this.loginFormInfo.current);
      } else {
        this.setState({
          loginWindow: _objectSpread(_objectSpread({}, this.state.loginWindow), {}, {
            opacity: 1,
            visibility: 'inherit'
          }),
          loginWindowSwitchButton: _objectSpread(_objectSpread({}, this.state.loginWindowSwitchButton), {}, {
            disabled: false
          }),
          registerWindow: _objectSpread(_objectSpread({}, this.state.registerWindow), {}, {
            opacity: 0,
            visibility: 'hidden'
          }),
          registerWindowSwitchButton: _objectSpread(_objectSpread({}, this.state.registerWindowSwitchButton), {}, {
            disabled: false
          })
        });
        this.registerFormUsernameField.current.value = '';
        this.registerFormPasswordField.current.value = '';
        this.registerFormPasswordConfirmField.current.value = '';
        this.app.removeChildren(this.registerFormInfo.current);
      }
    }
  }, {
    key: "hideLoginWindow",
    value: function hideLoginWindow() {
      var _this8 = this;

      this.loginFormUsernameField.current.value = '';
      this.loginFormPasswordField.current.value = '';
      this.registerFormUsernameField.current.value = '';
      this.registerFormPasswordField.current.value = '';
      this.registerFormPasswordConfirmField.current.value = '';
      this.app.removeChildren(this.loginFormInfo.current);
      this.app.hideShadowModal();
      this.setState({
        authMenu: _objectSpread(_objectSpread({}, this.state.authMenu), {}, {
          opacity: '0'
        })
      });
      this.hideLoginWindowTimeout = setTimeout(function () {
        _this8.setState({
          authMenu: _objectSpread(_objectSpread({}, _this8.state.authMenu), {}, {
            visibility: 'hidden'
          })
        });
      }, 500);
      this.app.setState({
        userLogOutButtonDisabled: false,
        userDeleteButtonDisabled: false,
        changePasswordButtonDisabled: false
      });
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      this.hideLoginWindowTimeout = clearTimeout(this.hideLoginWindowTimeout);
      this.app.removeChildren(this.app.userNameField.current);
      this.app.showShadowModal();
      this.setState({
        authMenu: _objectSpread(_objectSpread({}, this.state.authMenu), {}, {
          visibility: 'visible',
          opacity: '1'
        })
      });
      this.app.setState({
        userLogOutButtonDisabled: true,
        userDeleteButtonDisabled: true,
        changePasswordButtonDisabled: true
      });
    }
  }, {
    key: "login",
    value: function login(e) {
      var _this9 = this;

      e.preventDefault();
      this.app.removeChildren(this.loginFormInfo.current);
      var userName = this.loginFormUsernameField.current.value;
      var password = this.loginFormPasswordField.current.value;

      if (userName && password) {
        var data = {
          'userName': userName,
          'password': password
        };

        var loginResponseHandler = function loginResponseHandler(response) {
          if (response.status === 200) {
            _this9.app.createTaskList();

            _this9.hideLoginWindow();
          } else if (response.status === 401) {
            _this9.loginFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
          }
        };

        this.app.knockKnock('/user_login', loginResponseHandler, data);
      } else if (!userName) {
        this.loginFormInfo.current.appendChild(document.createTextNode('Please, enter user name!'));
      } else if (!password) {
        this.loginFormInfo.current.appendChild(document.createTextNode('Please, enter password!'));
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      var _this10 = this;

      var confirmFunction = function confirmFunction() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';
        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));

        _this10.showLoginWindow();
      };

      var userLanguage = getCookie('lang');
      var message = null;

      if (userLanguage === 'ru') {
        message = 'Вы уверены, что хотите выйти?';
      } else {
        message = 'Are you sure, you want to logOut?';
      }

      this.app.showConfirmWindow(message, confirmFunction);
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      var _this11 = this;

      var userLanguage = getCookie('lang');
      var message = null;

      if (userLanguage === 'ru') {
        message = 'Выуверены, что хотите удалить пользователя?';
      } else {
        message = 'Are you sure, you want to delete user?';
      }

      var responseHandler = function responseHandler(response) {
        if (response.status === 200) {
          _this11.forceLogOut();
        } else if (response.status === 401) {
          _this11.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      var confirmFunction = function confirmFunction() {
        _this11.app.knockKnock('/user_delete', responseHandler);
      };

      this.app.showConfirmWindow(message, confirmFunction);
    }
  }, {
    key: "changePasswordWindow",
    value: function changePasswordWindow() {
      if (this.state.changePasswordWindow.showed === false) {
        this.showLoginWindow();
        this.setState({
          loginWindow: _objectSpread(_objectSpread({}, this.state.loginWindow), {}, {
            visibility: 'hidden'
          }),
          registerWindow: _objectSpread(_objectSpread({}, this.state.registerWindow), {}, {
            visibility: 'hidden'
          }),
          changePasswordWindow: _objectSpread(_objectSpread({}, this.state.changePasswordWindow), {}, {
            showed: true,
            cancelButtonDisabled: false,
            submitButtonDisabled: false
          })
        });
      } else {
        this.hideLoginWindow();
        this.setState({
          loginWindow: _objectSpread(_objectSpread({}, this.state.loginWindow), {}, {
            visibility: 'inherit'
          }),
          registerWindow: _objectSpread(_objectSpread({}, this.state.registerWindow), {}, {
            visibility: 'hidden'
          }),
          changePasswordWindow: _objectSpread(_objectSpread({}, this.state.changePasswordWindow), {}, {
            showed: false,
            cancelButtonDisabled: true,
            submitButtonDisabled: true
          })
        });
      }
    }
  }, {
    key: "changePassword",
    value: function changePassword(e) {
      var _this12 = this;

      e.preventDefault();
      this.app.removeChildren(this.changePasswordFormInfo.current);
      var oldPassword = e.target['change_password_form_old_password'].value;
      var newPassword = e.target['change_password_form_new_password'].value;
      var newPasswordConfirm = e.target['change_password_form_new_password_confirm'].value;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200 && response.data['ok'] === true) {
          _this12.changePasswordWindow();

          showInfoWindow('Password is changed!');
        } else if (response.status === 401) {
          _this12.forceLogOut();

          showInfoWindow('Authorisation problem!');
        } else {
          _this12.changePasswordFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
        }
      };

      if (oldPassword && newPassword && newPasswordConfirm) {
        if (newPassword === newPasswordConfirm) {
          var sendData = {
            'oldPassword': oldPassword,
            'newPassword': newPassword
          };
          this.app.knockKnock('change_password', responseHandler, sendData);
        } else {
          this.changePasswordFormInfo.current.appendChild(document.createTextNode('Passwords are not match!'));
        }
      } else if (!oldPassword) {
        this.changePasswordFormInfo.current.appendChild(document.createTextNode('Please, enter old password!'));
      } else if (!newPassword) {
        this.changePasswordFormInfo.current.appendChild(document.createTextNode('Please, enter new password!'));
      } else if (!newPasswordConfirm) {
        this.changePasswordFormInfo.current.appendChild(document.createTextNode('Please, confirm new password!'));
      }
    }
    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */

  }, {
    key: "userRegister",
    value: function userRegister(e) {
      var _this13 = this;

      e.preventDefault();
      this.app.removeChildren(this.registerFormInfo.current);
      var userName = document.forms['register_form']['register_form_username'].value;
      var password = document.forms['register_form']['register_form_password'].value;
      var confirmPassword = document.forms['register_form']['register_form_password_confirm'].value;
      var agreementCheckbox = e.target['agreement_checkbox'];

      var handleResponse = function handleResponse(response) {
        if (response.status === 200) {
          if (response.data['ok'] === true) {
            _this13.registerFormInfo.current.appendChild(document.createTextNode('New user ' + userName + ' register!'));
          }
        }
      };

      if (userName && password && confirmPassword && agreementCheckbox.checked) {
        if (password === confirmPassword) {
          var sendData = {
            'newUserName': userName,
            'password': password
          };
          this.app.knockKnock('/user_register', handleResponse, sendData);
        } else {
          this.registerFormInfo.current.appendChild(document.createTextNode('Passwords are not match!'));
        }
      } else if (!userName) {
        this.registerFormInfo.current.appendChild(document.createTextNode('Please, enter user name!'));
      } else if (!password) {
        this.registerFormInfo.current.appendChild(document.createTextNode('Please, enter password!'));
      } else if (!confirmPassword) {
        this.registerFormInfo.current.appendChild(document.createTextNode('Please, confirm password!'));
      } else if (!agreementCheckbox.checked) {
        this.registerFormInfo.current.appendChild(document.createTextNode('Please, accept the agreements!'));
      }
    }
  }, {
    key: "forceLogOut",
    value: function forceLogOut() {
      document.cookie = 'id=; expires=-1';
      document.cookie = 'id=; expires=-1';
      ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
      this.showLoginWindow();
      console.log('Force logOut!!!!!');
    }
  }, {
    key: "render",
    value: function render() {
      var changePasswordWindowStyle = 'change_password_window';

      if (this.state.changePasswordWindow.showed) {
        changePasswordWindowStyle += ' change_password_window_showed';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: 'auth_menu',
        id: 'auth_menu',
        style: {
          visibility: this.state.authMenu.visibility,
          opacity: this.state.authMenu.opacity
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: 'login_window',
        id: 'login_window',
        style: {
          visibility: this.state.loginWindow.visibility,
          opacity: this.state.loginWindow.opacity
        }
      }, /*#__PURE__*/React.createElement("p", {
        className: "auth_menu_forms_labels"
      }, localisation['login_window']['label']), /*#__PURE__*/React.createElement("form", {
        name: "login_form",
        onSubmit: this.login
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "login_form_username",
        className: "auth_menu_labels"
      }, localisation['login_window']['user_name']), /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "login_form_username",
        className: "login_form_username",
        id: "login_form_username",
        ref: this.loginFormUsernameField,
        placeholder: localisation['login_window']['user_name_placeholder'],
        autoComplete: 'off'
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "login_form_password",
        className: "auth_menu_labels"
      }, localisation['login_window']['password']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "login_form_password",
        className: "login_form_password",
        id: "login_form_password",
        ref: this.loginFormPasswordField,
        placeholder: localisation['login_window']['password_placeholder']
      }), /*#__PURE__*/React.createElement("button", {
        type: "submit",
        className: "login_form_button",
        id: "login_form_button"
      }, localisation['login_window']['submit_button'])), /*#__PURE__*/React.createElement("p", {
        className: "login_window_info",
        id: "login_window_info",
        ref: this.loginFormInfo
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "switch_to_register_button",
        id: "switch_to_register_button",
        value: 'register',
        disabled: this.state.loginWindowSwitchButton.disabled,
        onClick: this.switchLogin
      }, localisation['login_window']['switch_to_register_button'])), /*#__PURE__*/React.createElement("div", {
        className: 'register_window',
        id: 'register_window',
        style: {
          visibility: this.state.registerWindow.visibility,
          opacity: this.state.registerWindow.opacity
        }
      }, /*#__PURE__*/React.createElement("p", {
        className: "auth_menu_forms_labels"
      }, localisation['register_window']['label']), /*#__PURE__*/React.createElement("form", {
        name: "register_form",
        onSubmit: this.userRegister
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "register_form_username",
        className: "auth_menu_labels"
      }, localisation['register_window']['user_name']), /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "register_form_username",
        id: "register_form_username",
        className: "register_form_username",
        ref: this.registerFormUsernameField,
        placeholder: localisation['register_window']['user_name_placeholder'],
        autoComplete: 'off'
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "register_form_password",
        className: "auth_menu_labels"
      }, localisation['register_window']['password']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "register_form_password",
        id: "register_form_password",
        className: "register_form_password",
        ref: this.registerFormPasswordField,
        placeholder: localisation['register_window']['password_placeholder']
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "register_form_password_confirm",
        className: "auth_menu_labels"
      }, localisation['register_window']['password_confirm']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "register_form_password_confirm",
        id: "register_form_password_confirm",
        className: "register_form_password_confirm",
        ref: this.registerFormPasswordConfirmField,
        placeholder: localisation['register_window']['password_confirm_placeholder']
      }), /*#__PURE__*/React.createElement("p", {
        className: "agreement",
        id: "agreement"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        id: "agreement_checkbox",
        name: 'agreement_checkbox'
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "agreement_checkbox"
      }, "\u041D\u0430\u0436\u0438\u043C\u0430\u044F \u0432\u044B \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044C \u0441", /*#__PURE__*/React.createElement("a", {
        href: "../static/agreements/agreement_ru.html",
        target: "_blank"
      }, "\u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435\u043C"), ", \u0432\u043E\u0442\u044C.")), /*#__PURE__*/React.createElement("button", {
        type: "submit",
        id: "register_form_button",
        className: "register_form_button"
      }, localisation['register_window']['create_button'])), /*#__PURE__*/React.createElement("p", {
        className: "register_window_info",
        id: "register_window_info",
        ref: this.registerFormInfo
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "login_button",
        id: "login_button",
        value: 'login',
        disabled: this.state.registerWindowSwitchButton.disabled,
        onClick: this.switchLogin
      }, localisation['register_window']['switch_to_login_button'])), /*#__PURE__*/React.createElement("div", {
        className: changePasswordWindowStyle,
        id: "change_password_window"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        id: "change_password_window_cancel_button",
        className: "change_password_window_cancel_button",
        disabled: this.state.changePasswordWindow.cancelButtonDisabled,
        onClick: this.changePasswordWindow
      }, "X"), /*#__PURE__*/React.createElement("p", {
        className: "auth_menu_forms_labels"
      }, localisation['change_password_window']['label']), /*#__PURE__*/React.createElement("form", {
        name: "change_password_form",
        onSubmit: this.changePassword
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "change_password_form_old_password",
        className: "auth_menu_labels"
      }, localisation['change_password_window']['old_password']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "change_password_form_old_password",
        id: "change_password_form_old_password",
        className: "change_password_form_old_password",
        placeholder: localisation['change_password_window']['old_password_placeholder']
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "change_password_form_new_password",
        className: "auth_menu_labels"
      }, localisation['change_password_window']['new_password']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "change_password_form_new_password",
        id: "change_password_form_new_password",
        className: "change_password_form_new_password",
        placeholder: localisation['change_password_window']['new_password_placeholder']
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "change_password_form_new_password_confirm",
        className: "auth_menu_labels"
      }, localisation['change_password_window']['new_password_confirm']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "change_password_form_new_password_confirm",
        id: "change_password_form_new_password_confirm",
        className: "change_password_form_new_password_confirm",
        placeholder: localisation['change_password_window']['new_password_confirm_placeholder']
      }), /*#__PURE__*/React.createElement("button", {
        type: "submit",
        value: "Change password",
        id: "change_password_form_button",
        className: "change_password_form_button",
        disabled: this.state.changePasswordWindow.submitButtonDisabled
      }, localisation['change_password_window']['change_password_button'])), /*#__PURE__*/React.createElement("p", {
        className: "change_password_window_info",
        id: "change_password_window_info",
        ref: this.changePasswordFormInfo
      })));
    }
  }]);

  return LoginReact;
}(React.Component);

var TaskListReact = /*#__PURE__*/function (_React$Component3) {
  _inherits(TaskListReact, _React$Component3);

  var _super3 = _createSuper(TaskListReact);

  function TaskListReact(props) {
    var _this14;

    _classCallCheck(this, TaskListReact);

    _this14 = _super3.call(this, props);
    _this14.app = _this14.props.app;
    _this14.login = _this14.props.login;
    _this14.tasksFromServer = _this14.props.tasksFromServer;
    _this14.tasksTree = new Map();
    _this14.tasks = [];

    var _iterator = _createForOfIteratorHelper(_this14.tasksFromServer),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var task = _step.value;
        var taskId = task['task_id'];
        var taskText = task['task_text'];
        var taskStatus = task['task_status'];
        var taskParentId = task['parent_id'];

        _this14.tasksTree.set(taskId, new Task(taskId, taskText, taskParentId, taskStatus));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(_this14.tasksTree.values()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _task = _step2.value;

        if (_this14.tasksTree.has(_task.parentId)) {
          _this14.tasksTree.get(_task.parentId).subtasks.push(_task);
        } else {
          _this14.tasks.push(_task);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    _this14.state = {
      linearTasksList: _this14.makeLinearList(_this14.tasks)
    };
    _this14.linearTasksList = _this14.makeLinearList(_this14.tasks);
    _this14.addTask = _this14.addTask.bind(_assertThisInitialized(_this14));
    _this14.addSubtask = _this14.addSubtask.bind(_assertThisInitialized(_this14));
    _this14.removeTask = _this14.removeTask.bind(_assertThisInitialized(_this14));
    _this14.textInputField = React.createRef();
    return _this14;
  } // componentDidMount() {
  //     console.log('mount');
  // }
  //
  // componentWillUnmount() {
  //     console.log('unmount');
  // }


  _createClass(TaskListReact, [{
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
      var _this15 = this;

      e.preventDefault();

      if (this.textInputField.current.value) {
        var taskText = this.textInputField.current.value;
        this.textInputField.current.value = '';
        var sendData = {
          'taskText': taskText,
          'parentId': null
        };

        var add = function add(answer) {
          if (answer.status === 200) {
            var taskId = answer.data['task_id'];
            var newTask = new Task(taskId, taskText);

            _this15.tasksTree.set(newTask.id, newTask);

            _this15.tasks.push(newTask);

            _this15.setState({
              linearTasksList: _this15.makeLinearList(_this15.tasks)
            });
          } else if (answer.status === 401) {
            _this15.login.forceLogOut();

            showInfoWindow('Authorisation problem!');
          }
        };

        this.app.knockKnock('/save_task', add, sendData);
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
      var _this16 = this;

      var sendData = {
        'taskText': subtaskText,
        'parentId': subtaskParentId
      };

      var add = function add(answer) {
        if (answer.status === 200) {
          var taskId = answer.data['task_id'];
          var newTask = new Task(taskId, subtaskText, subtaskParentId);

          _this16.tasksTree.set(taskId, newTask);

          _this16.tasksTree.get(subtaskParentId).subtasks.push(newTask);

          _this16.setState({
            linearTasksList: _this16.makeLinearList(_this16.tasks)
          });
        } else if (answer.status === 401) {
          _this16.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/save_task', add, sendData);
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
      var _this17 = this;

      var sendData = {
        'taskId': task.id
      };

      var remove = function remove(answer) {
        if (answer.status === 200) {
          if (_this17.tasksTree.has(task.parentId)) {
            var childrenList = _this17.tasksTree.get(task.parentId).subtasks;

            childrenList.splice(childrenList.indexOf(task), 1);
          } else {
            _this17.tasks.splice(_this17.tasks.indexOf(task), 1);
          }

          _this17.setState({
            linearTasksList: _this17.makeLinearList(_this17.tasks)
          });
        } else if (answer.status === 401) {
          _this17.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/delete_task', remove, sendData);
    }
  }, {
    key: "render",
    value: function render() {
      var _this18 = this;

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
          app: _this18.app,
          login: _this18.login,
          taskInst: task,
          taskId: task.id,
          status: task.status,
          taskText: task.text,
          parentId: task.parentId,
          removeTaskFunc: _this18.removeTask,
          addSubtaskFunc: _this18.addSubtask
        });
      })));
    }
  }]);

  return TaskListReact;
}(React.Component);

var TaskReact = /*#__PURE__*/function (_React$Component4) {
  _inherits(TaskReact, _React$Component4);

  var _super4 = _createSuper(TaskReact);

  function TaskReact(props) {
    var _this19;

    _classCallCheck(this, TaskReact);

    _this19 = _super4.call(this, props);
    _this19.app = _this19.props.app;
    _this19.login = _this19.props.login;
    _this19.taskInst = _this19.props.taskInst;
    _this19.taskId = _this19.props.taskId;
    _this19.state = {
      status: _this19.props.status,
      showSubtaskDivButtonZIndex: '0',
      showSubtaskDivButtonDisabled: false,
      taskTextValue: _this19.props.taskText,
      taskTextOpacity: '1',
      removeTaskButtonDisabled: false,
      removeTaskButtonScale: 'scale(1)',
      removeTaskButtonTransitionDelay: '0',
      subtaskDivShowed: false,
      subtaskDivVisibility: 'hidden',
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
    _this19.finishTask = _this19.finishTask.bind(_assertThisInitialized(_this19));
    _this19.removeTask = _this19.removeTask.bind(_assertThisInitialized(_this19));
    _this19.showEditTaskField = _this19.showEditTaskField.bind(_assertThisInitialized(_this19));
    _this19.saveEdit = _this19.saveEdit.bind(_assertThisInitialized(_this19));
    _this19.showSubtaskField = _this19.showSubtaskField.bind(_assertThisInitialized(_this19));
    _this19.addSubtask = _this19.addSubtask.bind(_assertThisInitialized(_this19));
    _this19.addSubtaskByEnterKey = _this19.addSubtaskByEnterKey.bind(_assertThisInitialized(_this19));
    _this19.addSubtaskField = React.createRef();
    _this19.editTaskField = React.createRef();
    return _this19;
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
      var _this20 = this;

      var taskStatus = this.state.status === false;
      var sendData = {
        'taskId': this.taskId,
        'status': taskStatus
      };

      var finish = function finish(answer) {
        if (answer.status === 200) {
          _this20.setState({
            status: taskStatus
          });
        } else if (answer.status === 401) {
          _this20.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/finish_task', finish, sendData);
    }
  }, {
    key: "removeTask",
    value: function removeTask() {
      this.props.removeTaskFunc(this.taskInst);
    }
  }, {
    key: "showSubtaskField",
    value: function showSubtaskField() {
      var _this21 = this;

      if (this.state.subtaskDivShowed === false) {
        this.app.showShadowModal();
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
        this.app.hideShadowModal();
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
          _this21.setState({
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
      var _this22 = this;

      if (this.state.taskTextEditDivShowed === false) {
        this.app.showShadowModal();
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
            if (answer.status === 200) {
              _this22.setState({
                taskTextValue: _this22.editTaskField.current.value
              });
            } else if (answer.status === 401) {
              _this22.login.forceLogOut();

              showInfoWindow('Authorisation problem!');
            }
          };

          this.app.knockKnock('/save_edit_task', saveEdit, sendData);
        }

        this.app.hideShadowModal();
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
          _this22.setState({
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
}(React.Component);

var LoadingWindowReact = /*#__PURE__*/function (_React$Component5) {
  _inherits(LoadingWindowReact, _React$Component5);

  var _super5 = _createSuper(LoadingWindowReact);

  function LoadingWindowReact() {
    var _this23;

    _classCallCheck(this, LoadingWindowReact);

    _this23 = _super5.call(this);
    _this23.isAlive = false;
    _this23.reqCount = 0;
    _this23.timerShow = null;
    _this23.timerHide = null;
    _this23.startTime = null;
    _this23.stopTime = null;
    _this23.state = {
      visibility: 'hidden'
    };
    _this23.showWindow = _this23.showWindow.bind(_assertThisInitialized(_this23));
    _this23.hideWindow = _this23.hideWindow.bind(_assertThisInitialized(_this23));
    return _this23;
  }

  _createClass(LoadingWindowReact, [{
    key: "showWindow",
    value: function showWindow() {
      var _this24 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          _this24.setState({
            visibility: 'visible'
          });

          _this24.startTime = Date.now();
          _this24.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      var _this25 = this;

      if (this.reqCount > 0) {
        this.reqCount--;
        this.stopTime = Date.now();
      }

      if (this.reqCount === 0) {
        this.timerShow = clearTimeout(this.timerShow);

        if (this.isAlive) {
          if (this.stopTime - this.startTime >= 200) {
            this.setState({
              visibility: 'hidden'
            });
            this.isAlive = false;
          } else {
            this.timerHide = setTimeout(function () {
              _this25.setState({
                visibility: 'hidden'
              });

              _this25.isAlive = false;
            }, 200 - (this.stopTime - this.startTime));
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: 'loading_window',
        id: 'loading_window',
        style: {
          visibility: this.state.visibility
        }
      }, /*#__PURE__*/React.createElement("p", {
        className: 'loading_window_message',
        id: 'loading_window_message'
      }, "\u0413\u0420\u0423\u0416\u0423\u0421\u042C"));
    }
  }]);

  return LoadingWindowReact;
}(React.Component); // //TODO Maybe compile class LoadingWindow and knock_knock function together????
// class LoadingWindow {
//     constructor() {
//         this.isAlive = false;
//         this.reqCount = 0;
//         this.timerShow = undefined;
//         this.timerHide = undefined;
//         this.startTime = undefined;
//         this.stopTime = undefined;
//     }
//
//     showWindow(loadingWindow) {
//         this.reqCount++;
//         if (this.reqCount === 1) {
//             this.timerHide = clearTimeout(this.timerHide);
//             this.timerShow = setTimeout(() => {
//                 loadingWindow.style.visibility = 'visible';
//                 this.startTime = Date.now();
//                 this.isAlive = true;
//             }, 200);
//         }
//     }
//
//     hideWindow(loadingWindow) {
//         if (this.reqCount > 0) {
//             this.reqCount--;
//             this.stopTime = Date.now();
//         }
//         if (this.reqCount === 0) {
//             this.timerShow = clearTimeout(this.timerShow);
//             if (this.isAlive) {
//                 if (this.stopTime - this.startTime >= 200) {
//                     loadingWindow.style.visibility = 'hidden';
//                     this.isAlive = false;
//                 } else {
//                     this.timerHide = setTimeout(() => {
//                         loadingWindow.style.visibility = 'hidden';
//                         this.isAlive = false;
//                     }, 200 - (this.stopTime - this.startTime));
//                 }
//             }
//         }
//     }
// }

//# sourceMappingURL=todo_classes_compiled.js.map
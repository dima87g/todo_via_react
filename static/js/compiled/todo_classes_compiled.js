'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
      shadowModalIsVisible: false,
      confirmWindowIsVisible: false,
      confirmWindowMessage: '',
      confirmWindowOnClick: null
    };
    _this.authCheck = _this.authCheck.bind(_assertThisInitialized(_this));
    _this.showConfirmWindow = _this.showConfirmWindow.bind(_assertThisInitialized(_this));
    _this.knockKnock = _this.knockKnock.bind(_assertThisInitialized(_this));
    _this.login = React.createRef();
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
        if (response.status === 200 && response.data['ok'] === true) {
          _this2.login.current.createTaskList();

          _this2.login.current.hideLoginWindow();
        } else {
          showCookiesAlertWindow();
        }
      };

      this.knockKnock('/auth_check', responseHandler);
    }
  }, {
    key: "removeChildren",
    value: function removeChildren(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }, {
    key: "showConfirmWindow",
    value: function showConfirmWindow(message, func) {
      var _this3 = this;

      this.showShadowModal();

      var confirmWindowOnClick = function confirmWindowOnClick(e) {
        if (e.target.value === 'ok') {
          _this3.hideShadowModal();

          func();
        } else {
          _this3.hideShadowModal();
        }

        _this3.setState({
          confirmWindowIsVisible: false
        });
      };

      this.setState({
        confirmWindowIsVisible: true,
        confirmWindowMessage: message,
        confirmWindowOnClick: confirmWindowOnClick
      });
    }
  }, {
    key: "showShadowModal",
    value: function showShadowModal() {
      this.setState({
        shadowModalIsVisible: true
      });
    }
  }, {
    key: "hideShadowModal",
    value: function hideShadowModal() {
      this.setState({
        shadowModalIsVisible: false
      });
    }
  }, {
    key: "knockKnock",
    value: function knockKnock(path, func, sendData) {
      var _this4 = this;

      var req = axios.default;
      this.loadingWindow.current.showWindow();
      req.post(path, sendData).then(function (response) {
        _this4.loadingWindow.current.hideWindow();

        if (response.headers['content-type'] === 'application/json') {
          func(response);
        }
      }).catch(function (error) {
        _this4.loadingWindow.current.hideWindow();

        console.log(error);
        func(error.response);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var shadowStyle;
      var confirmWindowStyle;

      if (this.state.shadowModalIsVisible) {
        shadowStyle = 'shadow_main shadow_visible';
      } else {
        shadowStyle = 'shadow_main shadow_hidden';
      }

      if (this.state.confirmWindowIsVisible) {
        confirmWindowStyle = 'confirm_window confirm_window_visible';
      } else {
        confirmWindowStyle = 'confirm_window confirm_window_hidden';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: 'app',
        id: 'app'
      }, /*#__PURE__*/React.createElement(LoginReact, {
        app: this,
        ref: this.login
      }), /*#__PURE__*/React.createElement("div", {
        id: "confirm_window",
        className: confirmWindowStyle
      }, /*#__PURE__*/React.createElement("p", {
        id: "confirm_window_message",
        className: 'confirm_window_message'
      }, this.state.confirmWindowMessage), /*#__PURE__*/React.createElement("button", {
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
        id: 'shadow',
        className: shadowStyle
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
    var _this5;

    _classCallCheck(this, LoginReact);

    _this5 = _super2.call(this, props);
    _this5.app = _this5.props.app;
    _this5.state = {
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
      userLogOutButtonDisabled: true,
      userDeleteButtonDisabled: true,
      changePasswordButtonDisabled: true,
      authMenuShowed: true,
      loginWindowShowed: true,
      registerWindowShowed: false,
      changePasswordWindowShowed: false,
      changePasswordBWindowCancelButtonDisabled: true
    };
    _this5.switchLogin = _this5.switchLogin.bind(_assertThisInitialized(_this5));
    _this5.hideLoginWindow = _this5.hideLoginWindow.bind(_assertThisInitialized(_this5));
    _this5.login = _this5.login.bind(_assertThisInitialized(_this5));
    _this5.logOut = _this5.logOut.bind(_assertThisInitialized(_this5));
    _this5.userDelete = _this5.userDelete.bind(_assertThisInitialized(_this5));
    _this5.changePasswordWindow = _this5.changePasswordWindow.bind(_assertThisInitialized(_this5));
    _this5.changePassword = _this5.changePassword.bind(_assertThisInitialized(_this5));
    _this5.userRegister = _this5.userRegister.bind(_assertThisInitialized(_this5));
    _this5.loginFormInfo = React.createRef();
    _this5.registerFormInfo = React.createRef();
    _this5.changePasswordFormInfo = React.createRef();
    _this5.userNameField = React.createRef();
    return _this5;
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
        document.forms['login_form'].reset();
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
        document.forms['register_form'].reset();
        this.app.removeChildren(this.registerFormInfo.current);
      }
    }
  }, {
    key: "hideLoginWindow",
    value: function hideLoginWindow() {
      var _this6 = this;

      document.forms['login_form'].reset();
      document.forms['register_form'].reset();
      this.app.removeChildren(this.loginFormInfo.current);
      this.app.hideShadowModal();
      this.setState({
        authMenu: _objectSpread(_objectSpread({}, this.state.authMenu), {}, {
          opacity: '0'
        })
      });
      this.hideLoginWindowTimeout = setTimeout(function () {
        _this6.setState({
          authMenu: _objectSpread(_objectSpread({}, _this6.state.authMenu), {}, {
            visibility: 'hidden'
          })
        });
      }, 500);
      this.setState({
        userLogOutButtonDisabled: false,
        userDeleteButtonDisabled: false,
        changePasswordButtonDisabled: false
      });
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      this.hideLoginWindowTimeout = clearTimeout(this.hideLoginWindowTimeout);
      this.app.removeChildren(this.userNameField.current);
      this.app.showShadowModal();
      this.setState({
        authMenu: _objectSpread(_objectSpread({}, this.state.authMenu), {}, {
          visibility: 'visible',
          opacity: '1'
        })
      });
      this.setState({
        userLogOutButtonDisabled: true,
        userDeleteButtonDisabled: true,
        changePasswordButtonDisabled: true
      });
    }
  }, {
    key: "login",
    value: function login(e) {
      var _this7 = this;

      e.preventDefault();
      this.app.removeChildren(this.loginFormInfo.current);
      var userName = e.target['login_form_username'].value;
      var password = e.target['login_form_password'].value;

      if (userName && password) {
        var data = {
          'userName': userName,
          'password': password
        };

        var loginResponseHandler = function loginResponseHandler(response) {
          if (response.status === 200) {
            _this7.createTaskList();

            _this7.hideLoginWindow();
          } else if (response.status === 401) {
            _this7.loginFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
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
    key: "createTaskList",
    value: function createTaskList() {
      var _this8 = this;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200) {
          var userName = response.data['user_name'];
          var tasksFromServer = response.data['tasks'];

          _this8.userNameField.current.appendChild(document.createTextNode('User: ' + userName));

          ReactDOM.render( /*#__PURE__*/React.createElement(TaskListReact, {
            app: _this8.app,
            login: _this8,
            tasksFromServer: tasksFromServer
          }), document.getElementById('task_list'));
        } else if (response.status === 401) {
          _this8.login.current.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/load_tasks', responseHandler);
    }
  }, {
    key: "logOut",
    value: function logOut() {
      var _this9 = this;

      var confirmFunction = function confirmFunction() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';
        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));

        _this9.showLoginWindow();
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
      var _this10 = this;

      var userLanguage = getCookie('lang');
      var message = null;

      if (userLanguage === 'ru') {
        message = 'Выуверены, что хотите удалить пользователя?';
      } else {
        message = 'Are you sure, you want to delete user?';
      }

      var responseHandler = function responseHandler(response) {
        if (response.status === 200) {
          _this10.forceLogOut();
        } else if (response.status === 401) {
          _this10.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      var confirmFunction = function confirmFunction() {
        _this10.app.knockKnock('/user_delete', responseHandler);
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
    /**
     * POST: json =  {"oldPassword": "string",  "newPassword": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */

  }, {
    key: "changePassword",
    value: function changePassword(e) {
      var _this11 = this;

      e.preventDefault();
      this.app.removeChildren(this.changePasswordFormInfo.current);
      var oldPassword = e.target['change_password_form_old_password'].value;
      var newPassword = e.target['change_password_form_new_password'].value;
      var newPasswordConfirm = e.target['change_password_form_new_password_confirm'].value;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200 && response.data['ok'] === true) {
          _this11.changePasswordWindow();

          showInfoWindow('Password is changed!');
        } else if (response.status === 401) {
          _this11.forceLogOut();

          showInfoWindow('Authorisation problem!');
        } else {
          _this11.changePasswordFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
        }

        e.target.reset();
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
      var _this12 = this;

      e.preventDefault();
      this.app.removeChildren(this.registerFormInfo.current);
      var userName = e.target['register_form_username'].value;
      var password = e.target['register_form_password'].value;
      var confirmPassword = e.target['register_form_password_confirm'].value;
      var agreementCheckbox = e.target['agreement_checkbox'];

      var handleResponse = function handleResponse(response) {
        if (response.status === 200) {
          if (response.data['ok'] === true) {
            _this12.registerFormInfo.current.appendChild(document.createTextNode('New user ' + userName + ' register!'));
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
      var authMenuStyle;
      var loginWindowStyle;
      var registerWindowStyle;
      var changePasswordWindowStyle = 'change_password_window';

      if (this.state.authMenuShowed) {
        authMenuStyle = 'auth_menu auth_menu_visible';
      } else {
        authMenuStyle = 'auth_menu auth_menu_hidden';
      }

      if (this.state.loginWindowShowed) {
        loginWindowStyle = 'login_window login_window_visible';
      } else {
        loginWindowStyle = 'login_window login_window_hidden';
      }

      if (this.state.registerWindowShowed) {
        registerWindowStyle = 'register_window register_window_visible';
      } else {
        registerWindowStyle = 'register_window register_window_hidden';
      }

      if (this.state.changePasswordWindow.showed) {
        changePasswordWindowStyle += ' change_password_window_showed';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: 'main',
        id: 'main'
      }, /*#__PURE__*/React.createElement("div", {
        id: 'auth_menu',
        className: authMenuStyle
      }, /*#__PURE__*/React.createElement("div", {
        id: 'login_window',
        className: loginWindowStyle
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
        id: 'register_window',
        className: registerWindowStyle
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
        placeholder: localisation['register_window']['password_placeholder']
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "register_form_password_confirm",
        className: "auth_menu_labels"
      }, localisation['register_window']['password_confirm']), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "register_form_password_confirm",
        id: "register_form_password_confirm",
        className: "register_form_password_confirm",
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
      }))), /*#__PURE__*/React.createElement("div", {
        className: "header",
        id: 'header'
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
        onClick: this.changePasswordWindow
      }), /*#__PURE__*/React.createElement("p", {
        className: "version"
      }, "Ver. 1.8")), /*#__PURE__*/React.createElement("div", {
        className: 'task_list',
        id: 'task_list'
      }));
    }
  }]);

  return LoginReact;
}(React.Component);

var TaskListReact = /*#__PURE__*/function (_React$Component3) {
  _inherits(TaskListReact, _React$Component3);

  var _super3 = _createSuper(TaskListReact);

  function TaskListReact(props) {
    var _this13;

    _classCallCheck(this, TaskListReact);

    _this13 = _super3.call(this, props);
    _this13.app = _this13.props.app;
    _this13.login = _this13.props.login;
    _this13.tasksFromServer = _this13.props.tasksFromServer;
    _this13.tasksTree = new Map();
    _this13.tasks = [];

    var _iterator = _createForOfIteratorHelper(_this13.tasksFromServer),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var task = _step.value;
        var taskId = task['task_id'];
        var taskText = task['task_text'];
        var taskStatus = task['task_status'];
        var taskParentId = task['parent_id'];

        _this13.tasksTree.set(taskId, new Task(taskId, taskText, taskParentId, taskStatus));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(_this13.tasksTree.values()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _task = _step2.value;

        if (_this13.tasksTree.has(_task.parentId)) {
          _this13.tasksTree.get(_task.parentId).subtasks.push(_task);
        } else {
          _this13.tasks.push(_task);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    _this13.state = {
      linearTasksList: _this13.makeLinearList(_this13.tasks)
    };
    _this13.linearTasksList = _this13.makeLinearList(_this13.tasks);
    _this13.addTask = _this13.addTask.bind(_assertThisInitialized(_this13));
    _this13.addSubtask = _this13.addSubtask.bind(_assertThisInitialized(_this13));
    _this13.removeTask = _this13.removeTask.bind(_assertThisInitialized(_this13));
    _this13.textInputField = React.createRef();
    return _this13;
  }

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
      var _this14 = this;

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

            _this14.tasksTree.set(newTask.id, newTask);

            _this14.tasks.push(newTask);

            _this14.setState({
              linearTasksList: _this14.makeLinearList(_this14.tasks)
            });
          } else if (answer.status === 401) {
            _this14.login.forceLogOut();

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
      var _this15 = this;

      var sendData = {
        'taskText': subtaskText,
        'parentId': subtaskParentId
      };

      var add = function add(answer) {
        if (answer.status === 200) {
          var taskId = answer.data['task_id'];
          var newTask = new Task(taskId, subtaskText, subtaskParentId);

          _this15.tasksTree.set(taskId, newTask);

          _this15.tasksTree.get(subtaskParentId).subtasks.push(newTask);

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
      var _this16 = this;

      var sendData = {
        'taskId': task.id
      };

      var remove = function remove(answer) {
        if (answer.status === 200) {
          if (_this16.tasksTree.has(task.parentId)) {
            var childrenList = _this16.tasksTree.get(task.parentId).subtasks;

            childrenList.splice(childrenList.indexOf(task), 1);
          } else {
            _this16.tasks.splice(_this16.tasks.indexOf(task), 1);
          }

          _this16.setState({
            linearTasksList: _this16.makeLinearList(_this16.tasks)
          });
        } else if (answer.status === 401) {
          _this16.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/delete_task', remove, sendData);
    }
  }, {
    key: "render",
    value: function render() {
      var _this17 = this;

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
          app: _this17.app,
          login: _this17.login,
          taskInst: task,
          taskId: task.id,
          status: task.status,
          taskText: task.text,
          parentId: task.parentId,
          removeTaskFunc: _this17.removeTask,
          addSubtaskFunc: _this17.addSubtask
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
    var _this18;

    _classCallCheck(this, TaskReact);

    _this18 = _super4.call(this, props);
    _this18.app = _this18.props.app;
    _this18.login = _this18.props.login;
    _this18.taskInst = _this18.props.taskInst;
    _this18.taskId = _this18.props.taskId;
    _this18.state = {
      status: _this18.props.status,
      showSubtaskDivButtonZIndex: '0',
      showSubtaskDivButtonDisabled: false,
      taskTextValue: _this18.props.taskText,
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
    _this18.finishTask = _this18.finishTask.bind(_assertThisInitialized(_this18));
    _this18.removeTask = _this18.removeTask.bind(_assertThisInitialized(_this18));
    _this18.showEditTaskField = _this18.showEditTaskField.bind(_assertThisInitialized(_this18));
    _this18.saveEdit = _this18.saveEdit.bind(_assertThisInitialized(_this18));
    _this18.showSubtaskField = _this18.showSubtaskField.bind(_assertThisInitialized(_this18));
    _this18.addSubtask = _this18.addSubtask.bind(_assertThisInitialized(_this18));
    _this18.addSubtaskByEnterKey = _this18.addSubtaskByEnterKey.bind(_assertThisInitialized(_this18));
    _this18.addSubtaskField = React.createRef();
    _this18.editTaskField = React.createRef();
    return _this18;
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
      var _this19 = this;

      var taskStatus = this.state.status === false;
      var sendData = {
        'taskId': this.taskId,
        'status': taskStatus
      };

      var finish = function finish(answer) {
        if (answer.status === 200) {
          _this19.setState({
            status: taskStatus
          });
        } else if (answer.status === 401) {
          _this19.login.forceLogOut();

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
      var _this20 = this;

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
          _this20.setState({
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
      var _this21 = this;

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
              _this21.setState({
                taskTextValue: _this21.editTaskField.current.value
              });
            } else if (answer.status === 401) {
              _this21.login.forceLogOut();

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
          _this21.setState({
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
    var _this22;

    _classCallCheck(this, LoadingWindowReact);

    _this22 = _super5.call(this);
    _this22.isAlive = false;
    _this22.reqCount = 0;
    _this22.timerShow = null;
    _this22.timerHide = null;
    _this22.startTime = null;
    _this22.stopTime = null;
    _this22.state = {
      visibility: 'hidden'
    };
    _this22.showWindow = _this22.showWindow.bind(_assertThisInitialized(_this22));
    _this22.hideWindow = _this22.hideWindow.bind(_assertThisInitialized(_this22));
    return _this22;
  }

  _createClass(LoadingWindowReact, [{
    key: "showWindow",
    value: function showWindow() {
      var _this23 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          _this23.setState({
            visibility: 'visible'
          });

          _this23.startTime = Date.now();
          _this23.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      var _this24 = this;

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
              _this24.setState({
                visibility: 'hidden'
              });

              _this24.isAlive = false;
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
}(React.Component);

//# sourceMappingURL=todo_classes_compiled.js.map
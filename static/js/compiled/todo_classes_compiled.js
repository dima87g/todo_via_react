'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var Task = function Task(id, text, position) {
  var parentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var status = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  _classCallCheck(this, Task);

  this.id = id;
  this.text = text;
  this.parentId = parentId;
  this.status = status;
  this.position = position;
  this.subtasks = [];
};

var App = /*#__PURE__*/function (_React$Component) {
  _inherits(App, _React$Component);

  var _super = _createSuper(App);

  function App() {
    var _this;

    _classCallCheck(this, App);

    _this = _super.call(this);
    _this.confirmWindowFunction = null;
    _this.state = {
      shadowModalIsVisible: false,
      confirmWindowIsVisible: false,
      confirmWindowMessage: ''
    };
    _this.authCheck = _this.authCheck.bind(_assertThisInitialized(_this));
    _this.showConfirmWindow = _this.showConfirmWindow.bind(_assertThisInitialized(_this));
    _this.confirmWindowClick = _this.confirmWindowClick.bind(_assertThisInitialized(_this));
    _this.knockKnock = _this.knockKnock.bind(_assertThisInitialized(_this));
    _this.login = React.createRef();
    _this.loadingWindow = React.createRef();
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      registry.app = this;
      this.authCheck();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      registry.app = null;
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

          _this2.setState({
            shadowModalIsVisible: true
          });
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
      this.showShadowModal();
      this.confirmWindowFunction = func;
      this.setState({
        confirmWindowIsVisible: true,
        confirmWindowMessage: message
      });
    }
  }, {
    key: "confirmWindowClick",
    value: function confirmWindowClick(e) {
      if (e.target.value === 'ok') {
        this.hideShadowModal();
        this.confirmWindowFunction();
      } else {
        this.hideShadowModal();
      }

      this.confirmWindowFunction = null;
      this.setState({
        confirmWindowIsVisible: false
      });
    }
  }, {
    key: "showShadowModal",
    value: function showShadowModal() {
      registry.headerMenu.setState({
        menuDisabled: true
      });

      if (registry.taskInput) {
        registry.taskInput.setState({
          taskInputDisabled: true
        });
      }

      this.setState({
        shadowModalIsVisible: true
      });
    }
  }, {
    key: "hideShadowModal",
    value: function hideShadowModal() {
      registry.headerMenu.setState({
        menuDisabled: false
      });

      if (registry.taskInput) {
        registry.taskInput.setState({
          taskInputDisabled: false
        });
      }

      this.setState({
        shadowModalIsVisible: false
      });
    }
  }, {
    key: "knockKnock",
    value: function knockKnock(path, func, sendData) {
      var _this3 = this;

      var req = axios.default;
      this.loadingWindow.current.showWindow();
      req.post(path, sendData).then(function (response) {
        _this3.loadingWindow.current.hideWindow();

        if (response.headers['content-type'] === 'application/json') {
          func(response);
        }
      }).catch(function (error) {
        _this3.loadingWindow.current.hideWindow();

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
        className: "confirm_window_buttons",
        value: "ok",
        onClick: this.confirmWindowClick
      }, "OK"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "confirm_window_buttons",
        value: 'cancel',
        onClick: this.confirmWindowClick
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
    var _this4;

    _classCallCheck(this, LoginReact);

    _this4 = _super2.call(this, props);
    _this4.app = _this4.props.app;
    _this4.state = {
      menuShowed: false,
      userLogOutButtonDisabled: true,
      userDeleteButtonDisabled: true,
      changePasswordButtonDisabled: true,
      authMenuShowed: true,
      loginWindowShowed: true,
      loginWindowSwitchButtonDisabled: false,
      registerWindowShowed: false,
      registerWindowSwitchButtonDisabled: true,
      changePasswordWindowShowed: false,
      changePasswordWindowCancelButtonDisabled: true,
      changePasswordWindowSubmitButtonDisabled: true
    };
    _this4.switchLogin = _this4.switchLogin.bind(_assertThisInitialized(_this4));
    _this4.hideLoginWindow = _this4.hideLoginWindow.bind(_assertThisInitialized(_this4));
    _this4.showMenu = _this4.showMenu.bind(_assertThisInitialized(_this4));
    _this4.login = _this4.login.bind(_assertThisInitialized(_this4));
    _this4.logOut = _this4.logOut.bind(_assertThisInitialized(_this4));
    _this4.userDelete = _this4.userDelete.bind(_assertThisInitialized(_this4));
    _this4.changePasswordWindow = _this4.changePasswordWindow.bind(_assertThisInitialized(_this4));
    _this4.changePassword = _this4.changePassword.bind(_assertThisInitialized(_this4));
    _this4.userRegister = _this4.userRegister.bind(_assertThisInitialized(_this4));
    _this4.taskList = React.createRef();
    _this4.loginFormInfo = React.createRef();
    _this4.registerFormInfo = React.createRef();
    _this4.changePasswordFormInfo = React.createRef();
    _this4.userNameField = React.createRef();
    return _this4;
  }

  _createClass(LoginReact, [{
    key: "switchLogin",
    value: function switchLogin(e) {
      var _this5 = this;

      if (e.target.value === 'register') {
        this.setState({
          loginWindowShowed: false,
          loginWindowSwitchButtonDisabled: true,
          registerWindowShowed: true
        });
        setTimeout(function () {
          _this5.setState({
            registerWindowSwitchButtonDisabled: false
          });
        }, 500);
        document.forms['login_form'].reset();
        this.app.removeChildren(this.loginFormInfo.current);
      } else {
        this.setState({
          loginWindowShowed: true,
          registerWindowShowed: false,
          registerWindowSwitchButtonDisabled: true
        });
        setTimeout(function () {
          _this5.setState({
            loginWindowSwitchButtonDisabled: false
          });
        }, 500);
        document.forms['register_form'].reset();
        this.app.removeChildren(this.registerFormInfo.current);
      }
    }
  }, {
    key: "hideLoginWindow",
    value: function hideLoginWindow() {
      document.forms['login_form'].reset();
      document.forms['register_form'].reset();
      this.app.removeChildren(this.loginFormInfo.current);
      this.app.hideShadowModal();
      this.setState({
        authMenuShowed: false,
        loginWindowShowed: false,
        registerWindowShowed: false,
        userLogOutButtonDisabled: false,
        userDeleteButtonDisabled: false,
        changePasswordButtonDisabled: false
      });
    }
  }, {
    key: "showLoginWindow",
    value: function showLoginWindow() {
      this.app.removeChildren(this.userNameField.current);
      this.app.showShadowModal();
      this.setState({
        authMenuShowed: true,
        loginWindowShowed: true,
        userLogOutButtonDisabled: true,
        userDeleteButtonDisabled: true,
        changePasswordButtonDisabled: true
      });
    }
  }, {
    key: "login",
    value: function login(e) {
      var _this6 = this;

      e.preventDefault();
      this.app.removeChildren(this.loginFormInfo.current);
      var userName = e.target['login_form_username'].value;
      var password = e.target['login_form_password'].value;

      if (userName && password) {
        var data = {
          'userName': userName,
          'password': password
        };

        var responseHandler = function responseHandler(response) {
          if (response.status === 200 && response.data['ok'] === true) {
            _this6.createTaskList();

            _this6.hideLoginWindow();
          } else if (response.status === 401) {
            _this6.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['login_error_warning']));
          }
        };

        this.app.knockKnock('/user_login', responseHandler, data);
      } else if (!userName) {
        this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['no_user_name_warning']));
      } else if (!password) {
        this.loginFormInfo.current.appendChild(document.createTextNode(localisation['login_window']['no_password_warning']));
      }
    }
  }, {
    key: "createTaskList",
    value: function createTaskList() {
      var _this7 = this;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200 && response.data['ok'] === true) {
          var userName = response.data['user_name'];
          var tasksFromServer = response.data['tasks'];

          _this7.userNameField.current.appendChild(document.createTextNode('User: ' + userName));

          ReactDOM.render( /*#__PURE__*/React.createElement(TaskListReact, {
            ref: _this7.taskList,
            app: _this7.app,
            login: _this7,
            tasksFromServer: tasksFromServer
          }), document.getElementById('task_list'));
          ReactDOM.render( /*#__PURE__*/React.createElement(TaskInput, {
            taskList: _this7.taskList.current
          }), document.getElementById('input'));
        } else if (response.status === 401) {
          _this7.login.current.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/load_tasks', responseHandler);
    }
  }, {
    key: "showMenu",
    value: function showMenu() {
      if (this.state.menuShowed) {
        this.setState({
          menuShowed: false,
          userLogOutButtonDisabled: true,
          userDeleteButtonDisabled: true,
          changePasswordButtonDisabled: true
        });
      } else {
        this.setState({
          menuShowed: true,
          userLogOutButtonDisabled: false,
          userDeleteButtonDisabled: false,
          changePasswordButtonDisabled: false
        });
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      var _this8 = this;

      var confirmFunction = function confirmFunction() {
        document.cookie = 'id=; expires=-1';
        document.cookie = 'id=; expires=-1';
        ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
        ReactDOM.unmountComponentAtNode(document.getElementById('input'));

        _this8.showLoginWindow();
      };

      var userLanguage = getCookie('lang');
      var message;

      if (userLanguage === 'ru') {
        message = 'Вы уверены, что хотите выйти?';
      } else {
        message = 'Are you sure, you want to logOut?';
      }

      this.app.showConfirmWindow(message, confirmFunction);
    }
  }, {
    key: "forceLogOut",
    value: function forceLogOut() {
      document.cookie = 'id=; expires=-1';
      document.cookie = 'id=; expires=-1';
      ReactDOM.unmountComponentAtNode(document.getElementById('task_list'));
      ReactDOM.unmountComponentAtNode(document.getElementById('input'));
      this.showLoginWindow();
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      var _this9 = this;

      var userLanguage = getCookie('lang');
      var message;

      if (userLanguage === 'ru') {
        message = 'Выуверены, что хотите удалить пользователя?';
      } else {
        message = 'Are you sure, you want to delete user?';
      }

      var responseHandler = function responseHandler(response) {
        if (response.status === 200) {
          _this9.forceLogOut();
        } else if (response.status === 401) {
          _this9.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      var confirmFunction = function confirmFunction() {
        _this9.app.knockKnock('/user_delete', responseHandler);
      };

      this.app.showConfirmWindow(message, confirmFunction);
    }
  }, {
    key: "changePasswordWindow",
    value: function changePasswordWindow() {
      if (this.state.changePasswordWindowShowed === false) {
        this.showLoginWindow();
        this.setState({
          changePasswordWindowShowed: true,
          loginWindowShowed: false,
          registerWindowShowed: false,
          changePasswordWindowCancelButtonDisabled: false,
          changePasswordWindowSubmitButtonDisabled: false
        });
      } else {
        this.hideLoginWindow();
        this.setState({
          changePasswordWindowShowed: false,
          changePasswordWindowCancelButtonDisabled: true,
          changePasswordWindowSubmitButtonDisabled: true
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
      var _this10 = this;

      e.preventDefault();
      this.app.removeChildren(this.changePasswordFormInfo.current);
      var oldPassword = e.target['change_password_form_old_password'].value;
      var newPassword = e.target['change_password_form_new_password'].value;
      var newPasswordConfirm = e.target['change_password_form_new_password_confirm'].value;

      var responseHandler = function responseHandler(response) {
        if (response.status === 200 && response.data['ok'] === true) {
          _this10.changePasswordWindow();

          showInfoWindow('Password is changed!');
        } else if (response.status === 401) {
          _this10.forceLogOut();

          showInfoWindow('Authorisation problem!');
        } else {
          _this10.changePasswordFormInfo.current.appendChild(document.createTextNode(response.data['error_message']));
        }
      };

      if (oldPassword && newPassword && newPasswordConfirm) {
        if (newPassword === newPasswordConfirm) {
          var sendData = {
            'oldPassword': oldPassword,
            'newPassword': newPassword
          };
          this.app.knockKnock('change_password', responseHandler, sendData);
          e.target.reset();
        } else {
          this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_match_passwords_warning']));
        }
      } else if (!oldPassword) {
        this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_old_password_warning']));
      } else if (!newPassword) {
        this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_new_password_warning']));
      } else if (!newPasswordConfirm) {
        this.changePasswordFormInfo.current.appendChild(document.createTextNode(localisation['change_password_window']['no_new_password_confirm_warning']));
      }
    }
    /**
     * POST: json =  {"newUserName": "string",  "password": "string"}
     * GET: answer = json = {'ok': 'boolean', 'error_code': 'number' or null, 'error_message': 'string' or null}
     */

  }, {
    key: "userRegister",
    value: function userRegister(e) {
      var _this11 = this;

      e.preventDefault();
      this.app.removeChildren(this.registerFormInfo.current);
      var userName = e.target['register_form_username'].value;
      var password = e.target['register_form_password'].value;
      var confirmPassword = e.target['register_form_password_confirm'].value;
      var agreementCheckbox = e.target['agreement_checkbox'];

      var handleResponse = function handleResponse(response) {
        if (response.status === 200) {
          if (response.data['ok'] === true) {
            _this11.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['register_confirm_pref'] + ' ' + userName + ' ' + localisation['register_window']['register_confirm_suf']));
          } else if (response.data['error_code'] === 1062) {
            _this11.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['user_exists_warning']));
          }
        }
      }; // if (userName && password && confirmPassword && agreementCheckbox.checked) {
      //     if (password === confirmPassword) {
      //         const sendData = {'newUserName': userName, 'password': password};
      //
      //         this.app.knockKnock('/user_register', handleResponse, sendData);
      //     }


      if (!userName) {
        this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_user_name_warning']));
      } else if (!password) {
        this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_password_warning']));
      } else if (!confirmPassword) {
        this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_confirm_password_warning']));
      } else if (password !== confirmPassword) {
        this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_match_passwords_warning']));
      } else if (!agreementCheckbox.checked) {
        this.registerFormInfo.current.appendChild(document.createTextNode(localisation['register_window']['no_agreement_check_warning']));
      } else if (userName && password && confirmPassword && agreementCheckbox.checked) {
        if (password === confirmPassword) {
          var sendData = {
            'newUserName': userName,
            'password': password
          };
          this.app.knockKnock('/user_register', handleResponse, sendData);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var authMenuStyle;
      var loginWindowStyle;
      var registerWindowStyle;
      var changePasswordWindowStyle;
      var menuStyle;
      var menuButtonsStyle;

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

      if (this.state.changePasswordWindowShowed) {
        changePasswordWindowStyle = 'change_password_window change_password_window_visible';
      } else {
        changePasswordWindowStyle = 'change_password_window change_password_window_hidden';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: 'main',
        id: 'main'
      }, /*#__PURE__*/React.createElement("div", {
        className: "header",
        id: 'header'
      }, /*#__PURE__*/React.createElement("div", {
        id: 'header_login_section',
        className: 'header_login_section'
      }, /*#__PURE__*/React.createElement("p", {
        className: "version"
      }, "Ver. 2.0 React"), /*#__PURE__*/React.createElement("a", {
        href: localisation['language_change']['link'],
        className: 'language_switch_button'
      }, /*#__PURE__*/React.createElement("img", {
        src: '/static/icons/' + localisation['language_change']['label'] + '_flag.png'
      })), /*#__PURE__*/React.createElement("p", {
        className: "user_name_field",
        id: 'user_name_field',
        ref: this.userNameField
      }), /*#__PURE__*/React.createElement(HeaderMenu, {
        login: this
      })), /*#__PURE__*/React.createElement("div", {
        id: 'input',
        className: 'input'
      })), /*#__PURE__*/React.createElement("div", {
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
        disabled: this.state.loginWindowSwitchButtonDisabled,
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
      }, "\xA0", localisation['register_window']['agreement_label'], "\xA0", /*#__PURE__*/React.createElement("a", {
        href: "/static/agreements/agreement_ru.html",
        target: "_blank"
      }, localisation['register_window']['agreement_link']))), /*#__PURE__*/React.createElement("button", {
        type: "submit",
        id: "register_form_button",
        className: "register_form_button"
      }, localisation['register_window']['create_button'])), /*#__PURE__*/React.createElement("p", {
        className: "register_window_info",
        id: "register_window_info",
        ref: this.registerFormInfo
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "switch_to_login_button",
        id: "switch_to_login_button",
        value: 'login',
        disabled: this.state.registerWindowSwitchButtonDisabled,
        onClick: this.switchLogin
      }, localisation['register_window']['switch_to_login_button'])), /*#__PURE__*/React.createElement("div", {
        id: "change_password_window",
        className: changePasswordWindowStyle
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        id: "change_password_window_cancel_button",
        className: "change_password_window_cancel_button",
        disabled: this.state.changePasswordWindowCancelButtonDisabled,
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
        disabled: this.state.changePasswordWindowSubmitButtonDisabled
      }, localisation['change_password_window']['change_password_button'])), /*#__PURE__*/React.createElement("p", {
        className: "change_password_window_info",
        id: "change_password_window_info",
        ref: this.changePasswordFormInfo
      }))), /*#__PURE__*/React.createElement("div", {
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
    var _this12;

    _classCallCheck(this, TaskListReact);

    _this12 = _super3.call(this, props);
    _this12.app = _this12.props.app;
    _this12.login = _this12.props.login;
    _this12.tasksFromServer = _this12.props.tasksFromServer;
    _this12.tasksTree = new Map();
    _this12.tasks = [];

    _this12.tasksFromServer.sort(function (a, b) {
      if (a['task_position'] && b['task_position']) {
        return a['task_position'] - b['task_position'];
      }

      return 0;
    });

    var _iterator = _createForOfIteratorHelper(_this12.tasksFromServer),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var task = _step.value;
        var taskId = task['task_id'];
        var taskText = task['task_text'];
        var taskStatus = task['task_status'];
        var taskParentId = task['parent_id'];
        var taskPosition = task['task_position'];

        _this12.tasksTree.set(taskId, new Task(taskId, taskText, taskPosition, taskParentId, taskStatus));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(_this12.tasksTree.values()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _task = _step2.value;

        if (_this12.tasksTree.has(_task.parentId)) {
          _this12.tasksTree.get(_task.parentId).subtasks.push(_task);
        } else {
          _this12.tasks.push(_task);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    console.log(_this12.tasksTree);
    console.log(_this12.tasks);
    _this12.state = {
      // linearTasksList: this.makeLinearList(this.tasks),
      linearTasksList: _this12.tasks
    }; // this.linearTasksList = this.makeLinearList(this.tasks);

    _this12.addTask = _this12.addTask.bind(_assertThisInitialized(_this12));
    _this12.addSubtask = _this12.addSubtask.bind(_assertThisInitialized(_this12));
    _this12.removeTask = _this12.removeTask.bind(_assertThisInitialized(_this12));
    return _this12;
  }

  _createClass(TaskListReact, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      registry.taskList = this;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      registry.taskList = null;
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
    value: function addTask(taskText) {
      var _this13 = this;

      var sendData = {
        'taskText': taskText,
        'parentId': null
      };

      var responseHandler = function responseHandler(answer) {
        if (answer.status === 200) {
          var taskId = answer.data['task_id'];
          var newTask = new Task(taskId, taskText);

          _this13.tasksTree.set(newTask.id, newTask);

          _this13.tasks.push(newTask);

          _this13.setState({
            // linearTasksList: this.makeLinearList(this.tasks),
            linearTasksList: _this13.tasks
          });
        } else if (answer.status === 401) {
          _this13.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/save_task', responseHandler, sendData);
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
      var _this14 = this;

      var sendData = {
        'taskText': subtaskText,
        'parentId': subtaskParentId
      };

      var add = function add(answer) {
        if (answer.status === 200) {
          var taskId = answer.data['task_id'];
          var newTask = new Task(taskId, subtaskText, subtaskParentId);

          _this14.tasksTree.set(taskId, newTask);

          _this14.tasksTree.get(subtaskParentId).subtasks.push(newTask);

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
      var _this15 = this;

      var sendData = {
        'taskId': task.id
      };

      var remove = function remove(answer) {
        if (answer.status === 200) {
          // if (this.tasksTree.has(task.parentId)) {
          //     let childrenList = this.tasksTree.get(task.parentId).subtasks;
          //     childrenList.splice(childrenList.indexOf(task), 1);
          // } else {
          //     this.tasks.splice(this.tasks.indexOf(task), 1);
          // }
          _this15.tasks.splice(findPosition(_this15.tasks, task.id), 1);

          _this15.tasksTree.delete(task.id);

          _this15.setState({
            // linearTasksList: this.makeLinearList(this.tasks),
            linearTasksList: _this15.tasks
          });
        } else if (answer.status === 401) {
          _this15.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/delete_task', remove, sendData);
    }
  }, {
    key: "render",
    value: function render() {
      var _this16 = this;

      return /*#__PURE__*/React.createElement("div", {
        className: 'main_window'
      }, /*#__PURE__*/React.createElement("div", {
        className: "main_tasks",
        id: 'main_tasks'
      }, this.state.linearTasksList.map(function (task) {
        return /*#__PURE__*/React.createElement(TaskReact, {
          key: task.id.toString(),
          app: _this16.app,
          login: _this16.login,
          taskInst: task,
          taskId: task.id,
          status: task.status,
          taskText: task.text,
          parentId: task.parentId // removeTaskFunc={this.removeTask}
          // addSubtaskFunc={this.addSubtask}

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
    var _this17;

    _classCallCheck(this, TaskReact);

    _this17 = _super4.call(this, props);
    _this17.app = _this17.props.app;
    _this17.login = _this17.props.login;
    _this17.taskInst = _this17.props.taskInst;
    _this17.taskId = _this17.props.taskId;
    _this17.state = {
      status: _this17.props.status,
      taskTextValue: _this17.props.taskText,
      taskTextShowed: true,
      subtaskDivShowed: false,
      addSubtaskDivShowed: false,
      removeTaskButtonShowed: true,
      removeTaskButtonDisabled: false,
      addSubtaskButtonShowed: false,
      addSubtaskButtonDisabled: true,
      editTaskDivShowed: false,
      saveEditButtonDisabled: true
    };
    _this17.finishTask = _this17.finishTask.bind(_assertThisInitialized(_this17));
    _this17.removeTask = _this17.removeTask.bind(_assertThisInitialized(_this17));
    _this17.showEditTaskField = _this17.showEditTaskField.bind(_assertThisInitialized(_this17));
    _this17.saveEdit = _this17.saveEdit.bind(_assertThisInitialized(_this17));
    _this17.showSubtaskField = _this17.showSubtaskField.bind(_assertThisInitialized(_this17));
    _this17.addSubtask = _this17.addSubtask.bind(_assertThisInitialized(_this17));
    _this17.addSubtaskByEnterKey = _this17.addSubtaskByEnterKey.bind(_assertThisInitialized(_this17));
    _this17.moveUp = _this17.moveUp.bind(_assertThisInitialized(_this17));
    _this17.moveDown = _this17.moveDown.bind(_assertThisInitialized(_this17));
    _this17.addSubtaskField = React.createRef();
    _this17.editTaskField = React.createRef();
    return _this17;
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
      var _this18 = this;

      var taskStatus = this.state.status === false;
      var sendData = {
        'taskId': this.taskId,
        'status': taskStatus
      };

      var finish = function finish(answer) {
        if (answer.status === 200) {
          _this18.setState({
            status: taskStatus
          });
        } else if (answer.status === 401) {
          _this18.login.forceLogOut();

          showInfoWindow('Authorisation problem!');
        }
      };

      this.app.knockKnock('/finish_task', finish, sendData);
    }
  }, {
    key: "removeTask",
    value: function removeTask() {
      registry.taskList.removeTask(this.taskInst);
    }
  }, {
    key: "showSubtaskField",
    value: function showSubtaskField() {
      if (this.state.addSubtaskDivShowed === false) {
        this.app.showShadowModal();
        this.setState({
          taskTextShowed: false,
          addSubtaskDivShowed: true,
          addSubtaskButtonDisabled: false,
          removeTaskButtonShowed: false,
          removeTaskButtonDisabled: true
        });
      } else {
        this.app.hideShadowModal();
        this.setState({
          taskTextShowed: true,
          addSubtaskDivShowed: false,
          addSubtaskButtonDisabled: true,
          removeTaskButtonShowed: true,
          removeTaskButtonDisabled: false
        });
        this.addSubtaskField.current.value = '';
      }
    }
  }, {
    key: "addSubtask",
    value: function addSubtask() {
      if (this.addSubtaskField.current.value) {
        var subtaskText = this.addSubtaskField.current.value;
        this.addSubtaskField.current.value = '';
        this.showSubtaskField();
        registry.taskList.addSubtask(this.taskId, subtaskText);
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
      var _this19 = this;

      if (this.state.editTaskDivShowed === false) {
        this.app.showShadowModal();
        this.setState({
          taskTextShowed: false,
          editTaskDivShowed: true,
          saveEditButtonDisabled: false,
          removeTaskButtonShowed: false,
          removeTaskButtonDisabled: true
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
              _this19.setState({
                taskTextValue: _this19.editTaskField.current.value
              });
            } else if (answer.status === 401) {
              _this19.login.forceLogOut();

              showInfoWindow('Authorisation problem!');
            }
          };

          this.app.knockKnock('/save_edit_task', saveEdit, sendData);
        }

        this.app.hideShadowModal();
        this.setState({
          taskTextShowed: true,
          editTaskDivShowed: false,
          saveEditButtonDisabled: true,
          removeTaskButtonShowed: true,
          removeTaskButtonDisabled: false
        });
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
    key: "moveUp",
    value: function moveUp() {
      var _this20 = this;

      //TODO need to make one function for moving up/down!
      var taskList;

      if (!this.taskInst.parentId) {
        taskList = registry.taskList.state.linearTasksList;
      } else {
        taskList = registry.taskList.tasksTree.get(this.taskInst.parentId);
      }

      var currentTaskIndex = findPosition(taskList, this.taskInst.id);

      if (currentTaskIndex > 0) {
        var taskToSwapIndex = currentTaskIndex - 1;
        var currentTaskId = this.taskInst.id;
        var currentTaskPosition = this.taskInst.position;

        if (!currentTaskPosition) {
          currentTaskPosition = currentTaskId;
        }

        var taskToSwap = taskList[taskToSwapIndex];
        var taskToSwapId = taskToSwap.id;
        var taskToSwapPosition = taskToSwap.position;

        if (!taskToSwapPosition) {
          taskToSwapPosition = taskToSwapId;
        }

        var sendData = {
          'currentTaskId': currentTaskId,
          'currentTaskPosition': currentTaskPosition,
          'taskToSwapId': taskToSwapId,
          'taskToSwapPosition': taskToSwapPosition
        };

        var responseHandler = function responseHandler(response) {
          if (response.status === 200 && response.data['ok'] === true) {
            console.log('Moving up!');
            _this20.taskInst.position = taskToSwapPosition;
            taskToSwap.position = currentTaskPosition;
            registry.taskList.setState({
              linearTasksList: taskList.swap(currentTaskIndex, taskToSwapIndex)
            });
          }
        };

        registry.app.knockKnock('/change_position', responseHandler, sendData);
      } else {
        console.log('I am the first already!');
      }
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      var _this21 = this;

      var taskList = registry.taskList.state.linearTasksList;
      var currentTaskIndex = findPosition(taskList, this.taskInst.id);

      if (currentTaskIndex < taskList.length - 1 && currentTaskIndex !== -1) {
        var taskToSwapIndex = currentTaskIndex + 1;
        var currentTaskId = this.taskInst.id;
        var currentTaskPosition = this.taskInst.position;

        if (!currentTaskPosition) {
          currentTaskPosition = currentTaskId;
        }

        var taskToSwap = taskList[taskToSwapIndex];
        var taskToSwapId = taskToSwap.id;
        var taskToSwapPosition = taskToSwap.position;

        if (!taskToSwapPosition) {
          taskToSwapPosition = taskToSwapId;
        }

        var sendData = {
          'currentTaskId': currentTaskId,
          'currentTaskPosition': currentTaskPosition,
          'taskToSwapId': taskToSwapId,
          'taskToSwapPosition': taskToSwapPosition
        };

        var responseHandler = function responseHandler(response) {
          if (response.status === 200 && response.data['ok'] === true) {
            console.log('Moving down!');
            _this21.taskInst.position = taskToSwapPosition;
            taskToSwap.position = currentTaskPosition;
            registry.taskList.setState({
              linearTasksList: taskList.swap(currentTaskIndex, taskToSwapIndex)
            });
          }
        };

        registry.app.knockKnock('/change_position', responseHandler, sendData);
      } else {
        console.log('I am the last already!');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var addSubtaskDivStyle;
      var showSubtaskDivButtonStyle;
      var addSubtaskTextFieldStyle;
      var addSubtaskButtonStyle;
      var taskTextStyle;
      var removeTaskButtonStyle;
      var editTaskDivStyle;
      var editTaskTextFieldStyle;
      var saveEditButtonStyle;

      if (this.state.addSubtaskDivShowed) {
        addSubtaskDivStyle = 'subtask_div';
        showSubtaskDivButtonStyle = 'show_subtask_div_button';
        addSubtaskTextFieldStyle = 'add_subtask_text_field';
        addSubtaskButtonStyle = 'add_subtask_button';
      } else {
        addSubtaskDivStyle = 'subtask_div subtask_div_hidden';
        showSubtaskDivButtonStyle = 'show_subtask_div_button show_subtask_div_button_hidden';
        addSubtaskTextFieldStyle = 'add_subtask_text_field add_subtask_text_field_hidden';
        addSubtaskButtonStyle = 'add_subtask_button add_subtask_button_hidden';
      }

      if (this.state.editTaskDivShowed) {
        editTaskDivStyle = 'edit_task_div';
        editTaskTextFieldStyle = 'edit_task_text_field';
        saveEditButtonStyle = 'save_edit_button';
      } else {
        editTaskDivStyle = 'edit_task_div edit_task_div_hidden';
        editTaskTextFieldStyle = 'edit_task_text_field edit_task_text_field_hidden';
        saveEditButtonStyle = 'save_edit_button save_edit_button_hidden';
      }

      if (this.state.taskTextShowed) {
        taskTextStyle = 'task_text';
      } else {
        taskTextStyle = 'task_text task_text_hidden';
      }

      if (this.state.removeTaskButtonShowed) {
        removeTaskButtonStyle = 'remove_task_button';
      } else {
        removeTaskButtonStyle = 'remove_task_button remove_task_button_hidden';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: 'task'
      }, /*#__PURE__*/React.createElement("button", {
        className: 'task_moving_buttons',
        type: 'button',
        onClick: this.moveUp
      }, "\uD83E\uDC41\uD83E\uDC41\uD83E\uDC41"), /*#__PURE__*/React.createElement("div", {
        className: this.state.status === false ? 'task_div_content' : 'task_div_content finished_task'
      }, /*#__PURE__*/React.createElement("button", {
        className: 'task_finish_button',
        type: 'button',
        onClick: this.finishTask
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/check.svg",
        alt: "V"
      })), /*#__PURE__*/React.createElement("button", {
        className: showSubtaskDivButtonStyle,
        onClick: this.showSubtaskField,
        disabled: true
      }, "+"), /*#__PURE__*/React.createElement("p", {
        className: taskTextStyle,
        onClick: this.showEditTaskField
      }, this.state.taskTextValue), /*#__PURE__*/React.createElement("button", {
        className: removeTaskButtonStyle,
        type: 'button',
        onClick: this.removeTask,
        disabled: this.state.removeTaskButtonDisabled
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/delete.svg",
        alt: ""
      })), /*#__PURE__*/React.createElement("div", {
        className: addSubtaskDivStyle
      }, /*#__PURE__*/React.createElement("input", {
        className: addSubtaskTextFieldStyle,
        type: "text",
        onKeyDown: this.addSubtaskByEnterKey,
        ref: this.addSubtaskField
      }), /*#__PURE__*/React.createElement("button", {
        className: addSubtaskButtonStyle,
        type: 'button',
        disabled: this.state.addSubtaskButtonDisabled,
        onClick: this.addSubtask
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/add_sub.svg",
        alt: "+"
      }))), /*#__PURE__*/React.createElement("div", {
        className: editTaskDivStyle
      }, /*#__PURE__*/React.createElement("textarea", {
        className: editTaskTextFieldStyle,
        type: 'text',
        ref: this.editTaskField,
        onKeyDown: this.saveEdit
      }), /*#__PURE__*/React.createElement("button", {
        className: saveEditButtonStyle,
        type: 'button',
        onClick: this.showEditTaskField,
        disabled: this.state.saveEditButtonDisabled
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/edit.svg",
        alt: "+"
      })))), /*#__PURE__*/React.createElement("button", {
        className: 'task_moving_buttons',
        type: 'button',
        onClick: this.moveDown
      }, "\uD83E\uDC43\uD83E\uDC43\uD83E\uDC43"));
    }
  }]);

  return TaskReact;
}(React.Component);

var HeaderMenu = /*#__PURE__*/function (_React$Component5) {
  _inherits(HeaderMenu, _React$Component5);

  var _super5 = _createSuper(HeaderMenu);

  function HeaderMenu(props) {
    var _this22;

    _classCallCheck(this, HeaderMenu);

    _this22 = _super5.call(this, props);
    _this22.login = _this22.props.login;
    _this22.state = {
      menuDisabled: true,
      menuShowed: false,
      userLogOutButtonDisabled: true,
      userDeleteButtonDisabled: true,
      changePasswordButtonDisabled: true
    };
    _this22.showHeaderMenu = _this22.showHeaderMenu.bind(_assertThisInitialized(_this22));
    _this22.logOut = _this22.logOut.bind(_assertThisInitialized(_this22));
    _this22.userDelete = _this22.userDelete.bind(_assertThisInitialized(_this22));
    _this22.changePassword = _this22.changePassword.bind(_assertThisInitialized(_this22));
    return _this22;
  }

  _createClass(HeaderMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      registry.headerMenu = this;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      registry.headerMenu = null;
    }
  }, {
    key: "showHeaderMenu",
    value: function showHeaderMenu() {
      if (this.state.menuShowed) {
        this.setState({
          menuShowed: false,
          userLogOutButtonDisabled: true,
          userDeleteButtonDisabled: true,
          changePasswordButtonDisabled: true
        });
      } else {
        this.setState({
          menuShowed: true,
          userLogOutButtonDisabled: false,
          userDeleteButtonDisabled: false,
          changePasswordButtonDisabled: false
        });
      }
    }
  }, {
    key: "logOut",
    value: function logOut() {
      this.setState({
        menuShowed: false
      });
      this.login.logOut();
    }
  }, {
    key: "userDelete",
    value: function userDelete() {
      this.setState({
        menuShowed: false
      });
      this.login.userDelete();
    }
  }, {
    key: "changePassword",
    value: function changePassword() {
      this.setState({
        menuShowed: false
      });
      this.login.changePasswordWindow();
    }
  }, {
    key: "render",
    value: function render() {
      var headerMenuListStyle;
      var headerMenuListButtonsStyle;
      var burgerButtonStyle;
      var menuButtonFunction;

      if (this.state.menuDisabled === false) {
        menuButtonFunction = this.showHeaderMenu;
      } else {
        menuButtonFunction = null;
      }

      if (this.state.menuShowed === false) {
        headerMenuListStyle = 'header_menu_list';
        headerMenuListButtonsStyle = 'header_menu_list_buttons';
        burgerButtonStyle = 'burger_button';
      } else {
        headerMenuListStyle = 'header_menu_list header_menu_list_visible';
        headerMenuListButtonsStyle = 'header_menu_list_buttons' + ' header_menu_list_buttons_visible';
        burgerButtonStyle = 'burger_button burger_button_clicked';
      }

      return /*#__PURE__*/React.createElement("div", {
        id: 'header_menu',
        className: 'header_menu'
      }, /*#__PURE__*/React.createElement("div", {
        id: 'header_menu_list',
        className: headerMenuListStyle
      }, /*#__PURE__*/React.createElement("input", {
        type: "button",
        className: headerMenuListButtonsStyle,
        id: "user_logout_button",
        value: localisation['buttons']['logout'],
        disabled: this.state.userLogOutButtonDisabled,
        onClick: this.logOut
      }), /*#__PURE__*/React.createElement("input", {
        type: "button",
        className: headerMenuListButtonsStyle,
        id: "change_password_button",
        value: localisation['buttons']['change_password'],
        disabled: this.state.changePasswordButtonDisabled,
        onClick: this.changePassword
      }), /*#__PURE__*/React.createElement("input", {
        type: "button",
        className: headerMenuListButtonsStyle,
        id: "user_delete_button",
        value: localisation['buttons']['delete_user'],
        disabled: this.state.userDeleteButtonDisabled,
        onClick: this.userDelete
      })), /*#__PURE__*/React.createElement("div", {
        id: 'burger_button',
        className: burgerButtonStyle,
        onClick: menuButtonFunction
      }, /*#__PURE__*/React.createElement("div", {
        id: 'burger_button_stick',
        className: 'burger_button_stick'
      }), /*#__PURE__*/React.createElement("div", {
        id: 'burger_button_stick',
        className: 'burger_button_stick'
      }), /*#__PURE__*/React.createElement("div", {
        id: 'burger_button_stick',
        className: 'burger_button_stick'
      })));
    }
  }]);

  return HeaderMenu;
}(React.Component);

var TaskInput = /*#__PURE__*/function (_React$Component6) {
  _inherits(TaskInput, _React$Component6);

  var _super6 = _createSuper(TaskInput);

  function TaskInput(props) {
    var _this23;

    _classCallCheck(this, TaskInput);

    _this23 = _super6.call(this, props);
    _this23.taskList = _this23.props.taskList;
    _this23.state = {
      taskInputDisabled: false
    };
    _this23.addTask = _this23.addTask.bind(_assertThisInitialized(_this23));
    return _this23;
  }

  _createClass(TaskInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      registry.taskInput = this;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      registry.taskInput = null;
    }
  }, {
    key: "addTask",
    value: function addTask(e) {
      e.preventDefault();
      var taskText = e.target['task_input_field'].value;

      if (taskText) {
        this.taskList.addTask(taskText);
      }

      e.target.reset();
    }
  }, {
    key: "render",
    value: function render() {
      var taskInputSubmitFunction;
      var taskInputFieldDisabled;
      var taskInputButtonDisabled;

      if (this.state.taskInputDisabled === true) {
        taskInputSubmitFunction = null;
        taskInputFieldDisabled = true;
        taskInputButtonDisabled = true;
      } else {
        taskInputSubmitFunction = this.addTask;
        taskInputFieldDisabled = false;
        taskInputButtonDisabled = false;
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "task_input"
      }, /*#__PURE__*/React.createElement("form", {
        onSubmit: taskInputSubmitFunction
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: 'task_input_field'
      }), /*#__PURE__*/React.createElement("input", {
        type: 'text',
        name: 'task_input_field',
        className: 'task_input_field',
        autoComplete: 'off',
        disabled: taskInputFieldDisabled
      }), /*#__PURE__*/React.createElement("button", {
        type: 'submit',
        className: 'task_input_button',
        disabled: taskInputButtonDisabled
      }, /*#__PURE__*/React.createElement("img", {
        src: "/static/icons/add_sub.svg",
        alt: "+"
      }))));
    }
  }]);

  return TaskInput;
}(React.Component);

var LoadingWindowReact = /*#__PURE__*/function (_React$Component7) {
  _inherits(LoadingWindowReact, _React$Component7);

  var _super7 = _createSuper(LoadingWindowReact);

  function LoadingWindowReact() {
    var _this24;

    _classCallCheck(this, LoadingWindowReact);

    _this24 = _super7.call(this);
    _this24.isAlive = false;
    _this24.reqCount = 0;
    _this24.timerShow = null;
    _this24.timerHide = null;
    _this24.startTime = null;
    _this24.stopTime = null;
    _this24.state = {
      visibility: 'hidden'
    };
    _this24.showWindow = _this24.showWindow.bind(_assertThisInitialized(_this24));
    _this24.hideWindow = _this24.hideWindow.bind(_assertThisInitialized(_this24));
    return _this24;
  }

  _createClass(LoadingWindowReact, [{
    key: "showWindow",
    value: function showWindow() {
      var _this25 = this;

      this.reqCount++;

      if (this.reqCount === 1) {
        this.timerHide = clearTimeout(this.timerHide);
        this.timerShow = setTimeout(function () {
          _this25.setState({
            visibility: 'visible'
          });

          _this25.startTime = Date.now();
          _this25.isAlive = true;
        }, 200);
      }
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      var _this26 = this;

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
              _this26.setState({
                visibility: 'hidden'
              });

              _this26.isAlive = false;
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
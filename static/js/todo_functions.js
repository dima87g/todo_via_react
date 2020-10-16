'use strict';

function events() {

    // function noEnterRefreshTaskInput(event) {
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         document.getElementById("task_input_button").click();
    //     }
    // }

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

    let loginForm = document.forms['login_form'];
    loginForm.addEventListener("keydown", noEnterRefreshLogin, false);

    let registerForm = document.forms['register_form'];
    registerForm.addEventListener("keydown", noEnterRefreshRegister, false);

    // let taskInputField = document.getElementById("task_input_field");
    // taskInputField.addEventListener("keydown", noEnterRefreshTaskInput, false);
}

function knock_knock(path, func, sendData = undefined) {
    let loadingWindow = document.getElementById("loading_window");
    showLoading.showWindow(loadingWindow);
    if (window.fetch) {
        let init = {method: 'POST',
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: JSON.stringify(sendData)}

        fetch(path, init)
            .then((answer) => {
                if (answer.ok && answer.headers.get('Content-Type') === 'application/json') {
                    return answer.json();
                } else {
                    return Promise.reject({"ok": false});
                }
            })
            .then((answer) => {
                showLoading.hideWindow(loadingWindow);
                func(answer);
            }, (error) => {
                showLoading.hideWindow(loadingWindow);
                func(error);
            });
    } else {
        let req = new XMLHttpRequest();
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
        }
    }
}

function showConfirmWindow(func, message) {
    let confirmWindow = document.getElementById("confirm_window");
    let confirmWindowMessage = document.getElementById("confirm_window_message");
    let okButton = document.getElementById("confirm_window_ok_button");
    let cancelButton = document.getElementById("confirm_window_cancel_button");

    showShadow();
    confirmWindowMessage.appendChild(document.createTextNode(message));
    confirmWindow.style.visibility = 'visible';
    confirmWindow.style.opacity = '1';

    okButton.onclick = click;
    cancelButton.onclick = click;

    function click() {
        if (this.value === "OK") {
            func();
        }
        hideShadow();
        confirmWindow.style.opacity = '0';
        setTimeout(function () {
            confirmWindow.style.visibility = 'hidden';
            confirmWindowMessage.removeChild(confirmWindowMessage.firstChild);
        }, 500);
    }
}

function showInfoWindow(message) {

    let infoWindow = document.getElementById("info_window");
    let infoWindowMessage = document.getElementById("info_window_message");

    removeChildren(infoWindowMessage);

    infoWindowMessage.appendChild(document.createTextNode(message));
    infoWindow.style.visibility = 'visible';

    setTimeout(function() {
        infoWindow.style.visibility = 'hidden';
    }, 3000)
}

function removeChildren(field) {
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
}

function showCookiesAlertWindow() {
    let userLanguage = window.navigator.language;
    let cookiesAlertWindow = document.getElementById('cookies_alert_window');
    let cookiesAlertWindowText = document.getElementById('cookies_alert_window_text');
    let cookiesAlertWindowConfirmButton = document.getElementById('cookies_alert_confirm_button');

    if (userLanguage === 'en-US' || userLanguage === 'en') {
        cookiesAlertWindowText.appendChild(document.createTextNode(
            'By continuing to use our site, you consent to the processing of' +
            ' cookies, which ensure the correct operation of the site.'));
    } else if (userLanguage === 'ru-RU' || userLanguage === 'ru') {
        cookiesAlertWindowText.appendChild(document.createTextNode(
            'Продолжая использовать наш сайт, вы даете согласие на обработку' +
            '  файлов cookie, которые обеспечивают правильную работу сайта.'));
    }

    cookiesAlertWindowConfirmButton.onclick = function() {
        cookiesAlertWindow.style.opacity = '0';

        setTimeout(function() {
            cookiesAlertWindow.style.display = 'none';
        }, 500);
    }
    cookiesAlertWindow.style.display = 'block';
}

function showShadow() {
    let shadow = document.getElementById('shadow');

    shadow.style.visibility = 'visible';
    shadow.style.opacity = '0.5';
}

function hideShadow() {
    let shadow = document.getElementById('shadow');

    shadow.style.opacity = '0';

    setTimeout(function() {
        shadow.style.visibility = 'hidden';
    }, 500);
}

function shadow() {
    let showed = false;
    let hideTimer = null;
    let shadow = document.getElementById('shadow');
    return function() {
        if (showed === false) {
            showed = true;
            hideTimer = clearTimeout(hideTimer);
            shadow.style.visibility = 'visible';
            shadow.style.opacity = '0.5';
        } else {
            showed = false;
            shadow.style.opacity = '0';

            hideTimer = setTimeout(() => {
                shadow.style.visibility = 'hidden';
            }, 500);
        }
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function authCheck(mainLogin) {
    const check = (answer) => {
        if (answer["ok"] === true) {
            mainLogin.hideLoginWindow();
            mainLogin.onLoad();
        } else {
            showCookiesAlertWindow();
        }
    }
    knock_knock("/auth_check", check);
}


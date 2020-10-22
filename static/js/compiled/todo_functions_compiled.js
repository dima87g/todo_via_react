'use strict';

function showInfoWindow(message) {
  var infoWindow = document.getElementById("info_window");
  var infoWindowMessage = document.getElementById("info_window_message");
  removeChildren(infoWindowMessage);
  infoWindowMessage.appendChild(document.createTextNode(message));
  infoWindow.style.visibility = 'visible';
  setTimeout(function () {
    infoWindow.style.visibility = 'hidden';
  }, 3000);
}

function removeChildren(field) {
  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }
}

function showCookiesAlertWindow() {
  var userLanguage = getCookie('lang');
  var cookiesAlertWindow = document.getElementById('cookies_alert_window');
  var cookiesAlertWindowText = document.getElementById('cookies_alert_window_text');
  var cookiesAlertWindowConfirmButton = document.getElementById('cookies_alert_confirm_button');

  if (userLanguage === 'en') {
    cookiesAlertWindowText.appendChild(document.createTextNode('By continuing to use our site, you consent to the processing of' + ' cookies, which ensure the correct operation of the site.'));
  } else if (userLanguage === 'ru') {
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

function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

//# sourceMappingURL=todo_functions_compiled.js.map
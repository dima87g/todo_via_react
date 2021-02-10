'use strict';

export function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function swap(arr, currentTaskIndex, taskToSwapIndex) {
    let buff = arr[currentTaskIndex];
    arr[currentTaskIndex] = arr[taskToSwapIndex];
    arr[taskToSwapIndex] = buff;
    return arr;
}

export function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}


/**
 *
 * @param arr
 * @param object
 * @returns {number}
 */
//TODO rename function to .... eg to findTaskPosition
export function findPosition(arr, object) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === object) {
            return i;
        }
    }
    return -1;
}


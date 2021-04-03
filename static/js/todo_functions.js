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
    const newArr = [...arr];
    let buff = newArr[currentTaskIndex];
    newArr[currentTaskIndex] = newArr[taskToSwapIndex];
    newArr[taskToSwapIndex] = buff;
    return newArr;
}

export function moveToStart(arr, currentTaskIndex) {
    const newArr = [...arr];
    let taskToMove = newArr.splice(currentTaskIndex, 1);
    newArr.unshift(taskToMove[0]);
    return newArr;
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
export function findIndex(arr, object) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === object) {
            return i;
        }
    }
    return -1;
}


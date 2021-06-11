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

/**
 *
 * @param {Array} arr - Unsorted array of instances of Task class
 * @returns {Array} Array of instances of Task class sorted by position
 */
export function regularSort(arr) {
    arr.sort(function(a, b) {
        if (a['position'] && b['position']) {
            return a['position'] - b['position'];
        } else if (!a['position'] && !b['position']) {
            return a['id'] - b['id'];
        } else if (!a['position']) {
            return a['id'] - b['position'];
        } else if (!b['position']) {
            return a['position'] - b['id'];
        }
        return 0;
    });
    return arr
}

export function sortByStatus(arr) {
    arr.sort(function(a, b) {
        if (a['status'] === true && b['status'] === false) {
            return 1
        }
        if (a['status'] === false && b['status'] === true) {
            return -1
        }
        return 0
    })
    return arr
}

export function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}

/**
 *
 * @param {Array} taskList
 * @returns {number}
 */
export function getNewPosition(taskList) {
    let maxPosition = 0;
    for (let task of taskList) {
        if (task.position > maxPosition) {
            maxPosition = task.position;
        }
    }
    return maxPosition + 1;
}


/**
 *
 * @param {Array} arr - Array of instances of Task class
 * @param {Object} object - Instance of Task class
 * @returns {number} - Index of instance of Task class in provided array
 */
export function findIndex(arr, object) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === object) {
            return i;
        }
    }
    return -1;
}


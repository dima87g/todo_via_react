'use strict';

export class Task {
    constructor(id, text, position, parentId = null, status = false) {
        this.id = id;
        this.text = text;
        this.parentId = parentId;
        this.status = status;
        this.position = position;
        this.subtasks = [];
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SugoiError {
    constructor(message, code, data = []) {
        this.data = [];
        this.message = message;
        this.code = code;
        if (!Array.isArray(data)) {
            data = [data];
        }
        this.data.push.apply(this.data, data);
        this.stack = new Error(message).stack;
        this.printError();
    }
    getData() {
        return [...this.data];
    }
    getMessage() {
        return this.message;
    }
    getCode() {
        return this.code;
    }
    getStack() {
        return this.stack;
    }
    printStack() {
        console.error(this.stack);
    }
    printError() {
        const payloadData = typeof this.data === "object" ? JSON.stringify(this.data) : this.data;
        console.error(`Error: ${this.code} - ${this.message} - ${payloadData}`);
    }
}
exports.SugoiError = SugoiError;

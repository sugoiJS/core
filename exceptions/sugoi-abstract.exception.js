"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SugoiError = /** @class */ (function () {
    function SugoiError(message, code, data) {
        if (data === void 0) { data = []; }
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
    SugoiError.prototype.getMessage = function () {
        return this.message;
    };
    SugoiError.prototype.getCode = function () {
        return this.code;
    };
    SugoiError.prototype.getStack = function () {
        return this.stack;
    };
    SugoiError.prototype.printStack = function () {
        console.error(this.stack);
    };
    SugoiError.prototype.printError = function () {
        var payloadData = typeof this.data === "object" ? JSON.stringify(this.data) : this.data;
        console.error("Error: " + this.code + " - " + this.message + " - " + payloadData);
    };
    return SugoiError;
}());
exports.SugoiError = SugoiError;

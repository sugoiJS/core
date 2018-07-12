"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage = /** @class */ (function () {
    function ErrorMessage(status, message, timestamp) {
        if (timestamp === void 0) { timestamp = new Date(); }
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }
    return ErrorMessage;
}());
exports.ErrorMessage = ErrorMessage;

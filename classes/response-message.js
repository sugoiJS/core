"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseMessage {
    constructor(message, data = null, timestamp = new Date()) {
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }
}
exports.ResponseMessage = ResponseMessage;

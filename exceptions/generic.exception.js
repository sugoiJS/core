"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sugoi_abstract_exception_1 = require("./sugoi-abstract.exception");
class GenericException extends sugoi_abstract_exception_1.SugoiError {
    constructor(message, code, data = []) {
        super(message, code, data);
    }
}
exports.GenericException = GenericException;

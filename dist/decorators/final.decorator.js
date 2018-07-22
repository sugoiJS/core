"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Final = function () {
    return function (target, propertyKey, descriptor) {
        Object.seal(target);
    };
};
exports.Final = Final;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Iterable() {
    return function (targetClassConstructor) {
        return class extends targetClassConstructor {
            *[Symbol.iterator]() {
                for (let key in this) {
                    yield this[key];
                }
            }
        };
    };
}
exports.Iterable = Iterable;

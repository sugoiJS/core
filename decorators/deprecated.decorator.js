"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Deprecated(msg = "%s.%s is deprecated") {
    return function (target, name) {
        console.info(msg, target.constructor.name, name);
    };
}
exports.Deprecated = Deprecated;

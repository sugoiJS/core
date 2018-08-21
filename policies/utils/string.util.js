"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.generateGuid = function () {
        function uidGenerator() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return uidGenerator() + uidGenerator() + '-' + uidGenerator() + '-' + uidGenerator() + '-' +
            uidGenerator() + '-' + uidGenerator() + uidGenerator() + uidGenerator();
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;

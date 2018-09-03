"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sugoi_abstract_exception_1 = require("./sugoi-abstract.exception");
var GenericException = /** @class */ (function (_super) {
    __extends(GenericException, _super);
    function GenericException(message, code, data) {
        if (data === void 0) { data = []; }
        return _super.call(this, message, code, data) || this;
    }
    return GenericException;
}(sugoi_abstract_exception_1.SugoiError));
exports.GenericException = GenericException;

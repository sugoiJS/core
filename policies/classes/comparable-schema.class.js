"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComparableSchema = /** @class */ (function () {
    function ComparableSchema(valueType) {
        this.mandatory = false;
        this.arrayAllowed = false;
        this.valueType = valueType;
    }
    ComparableSchema.ofType = function (valueType) {
        return new ComparableSchema(valueType);
    };
    ComparableSchema.prototype.setMandatory = function (isMandatory) {
        this.mandatory = isMandatory;
        return this;
    };
    ComparableSchema.prototype.setRegex = function (regexString, regexFlag) {
        this.regex = regexString;
        this.regexFlag = regexFlag || "";
        return this;
    };
    ComparableSchema.prototype.setMin = function (min) {
        this.min = min;
        return this;
    };
    ComparableSchema.prototype.setExclusiveMin = function (min) {
        this.exclusiveMin = min;
        return this;
    };
    ComparableSchema.prototype.setExclusiveMax = function (max) {
        this.exclusiveMax = max;
        return this;
    };
    ComparableSchema.prototype.setArrayAllowed = function (isAllowed) {
        this.arrayAllowed = isAllowed;
        return this;
    };
    return ComparableSchema;
}());
exports.ComparableSchema = ComparableSchema;

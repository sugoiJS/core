"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ComparableSchema {
    constructor(valueType) {
        this.mandatory = false;
        this.arrayAllowed = false;
        this.valueType = valueType;
    }
    static ofType(valueType) {
        return new ComparableSchema(valueType);
    }
    setMandatory(isMandatory) {
        this.mandatory = isMandatory;
        return this;
    }
    setRegex(regexString, regexFlag) {
        this.regex = regexString;
        this.regexFlag = regexFlag || "";
        return this;
    }
    setMin(min) {
        this.min = min;
        return this;
    }
    setExclusiveMin(min) {
        this.exclusiveMin = min;
        return this;
    }
    setMax(max) {
        this.max = max;
        return this;
    }
    setExclusiveMax(max) {
        this.exclusiveMax = max;
        return this;
    }
    setArrayAllowed(isAllowed) {
        this.arrayAllowed = isAllowed;
        return this;
    }
}
exports.ComparableSchema = ComparableSchema;

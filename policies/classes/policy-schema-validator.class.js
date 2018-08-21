"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_types_enum_1 = require("../constants/schema-types.enum");
var PolicySchemaValidator = /** @class */ (function () {
    function PolicySchemaValidator(validateValue, schema) {
        this.validateValue = validateValue;
        this.schema = schema;
    }
    PolicySchemaValidator.prototype.validate = function () {
        var validationResult = {
            valid: true,
            invalidValue: null,
            expectedValue: null
        };
        this.check(this.validateValue, this.schema, validationResult);
        return validationResult;
    };
    PolicySchemaValidator.prototype.check = function (validateItem, schemaItem, validationResult) {
        var _this = this;
        if (validationResult === void 0) { validationResult = {
            valid: true,
            invalidValue: null,
            expectedValue: null
        }; }
        var schemaKeys = Object.keys(schemaItem);
        var _loop_1 = function (key) {
            if (validateItem[key] == undefined && schemaItem[key] && schemaItem[key].mandatory !== false) {
                validationResult.valid = false;
                return "break";
            }
            else if (Array.isArray(validateItem[key])) {
                if (!schemaItem[key].arrayAllowed) {
                    validationResult.valid = false;
                }
                else
                    validateItem[key].every(function (item) { return _this.check(item, schemaItem[key].valueType, validationResult).valid; });
            }
            else if (validateItem[key] && typeof validateItem[key] === "object") {
                this_1.check(validateItem[key], schemaItem[key].valueType, validationResult);
            }
            else {
                validationResult.valid = this_1.checkValue(validateItem[key], schemaItem[key]);
            }
            if (!validationResult.valid) {
                validationResult.invalidValue = validateItem[key];
                validationResult.expectedValue = schemaItem[key];
                return "break";
            }
        };
        var this_1 = this;
        for (var _i = 0, schemaKeys_1 = schemaKeys; _i < schemaKeys_1.length; _i++) {
            var key = schemaKeys_1[_i];
            var state_1 = _loop_1(key);
            if (state_1 === "break")
                break;
        }
        return validationResult;
    };
    PolicySchemaValidator.prototype.checkValue = function (value, schema) {
        if (!schema)
            return false;
        var valid = true;
        switch (schema.valueType.toLowerCase()) {
            case schema_types_enum_1.SchemaTypes.NUMBER:
                valid = PolicySchemaValidator.validateNumber(value, schema);
                break;
            case schema_types_enum_1.SchemaTypes.STRING:
                valid = PolicySchemaValidator.validateString(value, schema);
                break;
            case schema_types_enum_1.SchemaTypes.BOOLEAN:
                valid = PolicySchemaValidator.validateBoolean(value, schema);
                break;
        }
        return valid;
    };
    PolicySchemaValidator.validateNumber = function (value, schema) {
        var valid = !isNaN(value) && typeof value !== "boolean";
        value = parseInt(value);
        if (valid && schema.exclusiveMax != undefined) {
            valid = valid && value < schema.exclusiveMax;
        }
        if (valid && schema.max != undefined) {
            valid = valid && value <= schema.max;
        }
        if (valid && schema.exclusiveMin != undefined) {
            valid = valid && value > schema.exclusiveMin;
        }
        if (valid && schema.min != undefined) {
            valid = valid && value > schema.min;
        }
        return valid;
    };
    PolicySchemaValidator.validateString = function (value, schema) {
        var valid = typeof value === "string";
        if (!valid)
            return valid;
        var regex = new RegExp(schema.regex, schema.regexFlag || "");
        valid = valid && regex.test(value);
        return valid;
    };
    PolicySchemaValidator.validateBoolean = function (value, schema) {
        var valid;
        try {
            valid = typeof JSON.parse(value) === "boolean";
        }
        catch (e) {
            valid = false;
        }
        return valid;
    };
    return PolicySchemaValidator;
}());
exports.PolicySchemaValidator = PolicySchemaValidator;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_types_enum_1 = require("../constants/schema-types.enum");
const comparable_schema_class_1 = require("./comparable-schema.class");
class PolicySchemaValidator {
    constructor(validateValue, schema) {
        this.validateValue = validateValue;
        this.schema = schema;
    }
    validate() {
        let validationResult = {
            valid: true,
            invalidValue: null,
            expectedValue: null
        };
        this.check(this.validateValue, this.schema, validationResult);
        return validationResult;
    }
    check(validateItem, schemaItem, validationResult = {
        valid: true,
        invalidValue: null,
        expectedValue: null
    }) {
        validationResult.invalidValue = validateItem;
        validationResult.expectedValue = schemaItem;
        if (validateItem == undefined) {
            validationResult.valid = !schemaItem || schemaItem.mandatory === false;
        }
        else if (schemaItem instanceof comparable_schema_class_1.ComparableSchema) {
            if (typeof schemaItem.valueType !== "object")
                validationResult.valid = this.checkValue(validateItem, schemaItem);
            else
                validationResult = this.check(validateItem, schemaItem.valueType, validationResult);
            return validationResult;
        }
        else {
            Object.keys(schemaItem).every(key => {
                validationResult.invalidValue = validateItem[key];
                validationResult.expectedValue = schemaItem[key];
                if (Array.isArray(validateItem[key])) {
                    if (!schemaItem[key].arrayAllowed) {
                        validationResult.valid = false;
                    }
                    else {
                        validationResult.valid = validateItem[key].every(item => this.check(item, schemaItem[key], validationResult).valid);
                    }
                }
                else {
                    this.check(validateItem[key], schemaItem[key], validationResult);
                }
                return validationResult.valid;
            });
        }
        return validationResult;
    }
    checkValue(value, schema) {
        if (!schema)
            return false;
        let valid = true;
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
    }
    static validateNumber(value, schema) {
        let valid = !isNaN(value) && typeof value !== "boolean";
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
            valid = valid && value >= schema.min;
        }
        return valid;
    }
    static validateString(value, schema) {
        let valid = typeof value === "string";
        if (!valid)
            return valid;
        const regex = new RegExp(schema.regex, schema.regexFlag || "");
        valid = valid && regex.test(value);
        return valid;
    }
    static validateBoolean(value, schema) {
        let valid;
        try {
            valid = typeof JSON.parse(value) === "boolean";
        }
        catch (e) {
            valid = false;
        }
        return valid;
    }
}
exports.PolicySchemaValidator = PolicySchemaValidator;

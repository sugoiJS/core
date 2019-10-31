import {IPolicySchemaValidator, IValidationResult} from "../interfaces/policy-schema-validator.interface";
import {SchemaTypes,TComparableSchema} from "..";
import {IComparableValue} from "../interfaces/comparable-value.interface";
import {ComparableSchema} from "./comparable-schema.class";
let Joi;
try {
    Joi = require('@hapi/joi');
}catch (e) {}
export class PolicySchemaValidator<T=any> implements IPolicySchemaValidator {
    constructor(public validateValue: T,
                public schema: TComparableSchema) {
    }

    public validate(): IValidationResult {
        let validationResult = {
            valid: true,
            invalidValue: null,
            expectedValue: null
        };
        this.check(this.validateValue, this.schema, validationResult);
        return validationResult;
    }


    private check(validateItem: any, schemaItem: TComparableSchema, validationResult: IValidationResult = {
        valid: true,
        invalidValue: null,
        expectedValue: null
    }): IValidationResult {
        let name, valid;
        if(schemaItem && schemaItem.isJoi){
            name = 'joi';
        }else{
            name = schemaItem.name || schemaItem.constructor.name || '';
        }
        switch (name.toLowerCase()) {
            case 'ajv':
            case 'validate':
                valid = schemaItem(validateItem);
                Object.assign(validationResult,{valid: valid, invalidValue:validateItem, expectedValue: schemaItem.errors});
                break;
            case 'joi':
                valid = schemaItem.validate(validateItem);
                Object.assign(validationResult, {valid: !valid.error, invalidValue:validateItem, expectedValue: valid.error && valid.error.details});
                break;
            default:
                validationResult.invalidValue = validateItem;
                validationResult = this.applyComparableSchemaCheck(validateItem, schemaItem, validationResult);
                break;
        }
        return validationResult;
    }


    private checkValue(value: any, schema: IComparableValue, valueType: SchemaTypes) {
        if (!schema) return false;
        let valid = true;
        switch ((<string>valueType).toLowerCase()) {
            case SchemaTypes.NUMBER:
                valid = PolicySchemaValidator.validateNumber(value, schema);
                break;
            case SchemaTypes.STRING:
                valid = PolicySchemaValidator.validateString(value, schema);
                break;
            case SchemaTypes.BOOLEAN:
                valid = PolicySchemaValidator.validateBoolean(value, schema);
                break;
        }
        return valid;
    }

    private applyComparableSchemaCheck(validateItem: any, schemaItem: TComparableSchema, validationResult: IValidationResult){
        if (validateItem == null) {
            // no value allowed only if not set on the schema or not mandatory
            validationResult.valid = !schemaItem || (<ComparableSchema>schemaItem).mandatory !== true;
        }
        else if(schemaItem.forceArray){
            // check array values
            const isArray = Array.isArray(validateItem);
            const schemaClone = Object.assign({},schemaItem, {forceArray: false});
            validationResult.valid = isArray && validateItem.every(item => this.check(item,schemaClone).valid)
        }
        else if (schemaItem instanceof ComparableSchema) {
            // The comparable schema validation for each value type
            for(const valueType of schemaItem.valueType) {
                if (typeof valueType !== "object") {
                    validationResult.valid = this.checkValue(validateItem, schemaItem, valueType);
                }
                else {
                    validationResult = this.check(validateItem, valueType as { [prop: string]: ComparableSchema }, validationResult);
                }
                if(validationResult.valid){
                    break;
                }
            }
            validationResult.expectedValue = schemaItem;
            return validationResult;
        }
        else if (validateItem && typeof validateItem === 'object'){
            Object.keys(schemaItem).every(key=>{
                validationResult.invalidValue = validateItem[key];
                validationResult.expectedValue = schemaItem[key];
                const isArray = Array.isArray(validateItem[key]);
                if (isArray && (schemaItem[key].arrayAllowed || schemaItem[key].forceArray)) {
                    validationResult.valid = validateItem[key].every(item => this.check(item, schemaItem[key], validationResult).valid);
                }
                else if(!isArray && !schemaItem[key].forceArray){
                    this.check(validateItem[key], schemaItem[key], validationResult);
                }else{
                    validationResult.valid = false;
                }
                return validationResult.valid;
            });
        }
        return validationResult;

    }

    private static validateNumber(value, schema) {
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

    private static validateString(value, schema) {
        let valid = typeof value === "string";
        if (!valid)
            return valid;
        const regex = new RegExp(schema.regex, schema.regexFlag || "");
        valid = valid && regex.test(value);
        return valid;
    }

    private static validateBoolean(value, schema) {
        let valid;
        try {
            valid = typeof JSON.parse(value) === "boolean";
        } catch (e) {
            valid = false;
        }
        return valid;
    }


}


import {IPolicySchemaValidator, IValidationResult} from "../interfaces/policy-schema-validator.interface";
import {TComparableSchema} from "../interfaces/validate-schema-data.interface";
import {IComparableValue} from "../interfaces/comparable-value.interface";
import {SchemaTypes} from "../constants/schema-types.enum";
import {ComparableSchema} from "./comparable-schema.class";

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
        validationResult.invalidValue = validateItem;
        validationResult.expectedValue = schemaItem;
        if (validateItem == undefined) {
            validationResult.valid = !schemaItem || (<ComparableSchema>schemaItem).mandatory === false;
        }
        else if (schemaItem instanceof ComparableSchema) {
            if(typeof schemaItem.valueType !== "object")
                validationResult.valid = this.checkValue(validateItem, schemaItem);
            else
                validationResult = this.check(validateItem, schemaItem.valueType as {[prop:string]:ComparableSchema},validationResult);

            return validationResult;
        } else {
            Object.keys(schemaItem).every(key=>{
                validationResult.invalidValue = validateItem[key];
                validationResult.expectedValue = schemaItem[key];
                console.log(schemaItem[key])
                console.log(validateItem[key])
                if (Array.isArray(validateItem[key])) {
                    if (!schemaItem[key].arrayAllowed) {
                        validationResult.valid = false;
                    } else {
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


    private checkValue(value: any, schema: IComparableValue) {
        if (!schema) return false;
        let valid = true;
        switch ((<string>schema.valueType).toLowerCase()) {
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


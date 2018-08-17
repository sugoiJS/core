import {IPolicySchemaValidator, IValidationResult} from "../interfaces/policy-schema-validator.interface";
import {TComparableValue} from "../interfaces/compareable-value.interface";

export class PolicySchemaValidator<T=any> implements IPolicySchemaValidator {
    constructor(public validateValue: T,
                public schema: { [prop: string]: TComparableValue<T> }) {
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


    private check(validateItem: any, schemaItem: { [prop: string]: TComparableValue }, validationResult: IValidationResult = {
        valid: true,
        invalidValue: null,
        expectedValue: null
    }): IValidationResult {

        for (let key in schemaItem) {
            if (validateItem[key] == undefined && schemaItem[key] && schemaItem[key].mandatory) {
                validationResult.valid = false;
                break;
            }
            else if (Array.isArray(validateItem[key])) {
                if (!schemaItem[key].arrayAllowed) {
                    validationResult.valid = false;
                } else
                    validateItem[key].every(item => this.check(item, schemaItem[key].valueType, validationResult).valid)
            }
            else if (validateItem[key] && typeof validateItem[key] === "object") {
                this.check(validateItem[key], schemaItem[key].valueType, validationResult);
            }
            else {
                validationResult.valid = this.checkValue(validateItem[key], schemaItem[key]);
            }
            if (!validationResult.valid) {
                validationResult.invalidValue = validateItem[key];
                validationResult.expectedValue = schemaItem[key];
                break;
            }
        }
        return validationResult;
    }

    private checkValue(value: any, schema: TComparableValue) {
        if (!schema) return false;
        let valid = true;
        switch (schema.valueType as string) {
            case "number":
                valid = PolicySchemaValidator.validateNumber(value,schema);
                break;
            case "string":
                valid = PolicySchemaValidator.validateString(value,schema);
                break;
            case "boolean":
                valid = PolicySchemaValidator.validateBoolean(value,schema);
                break;
        }
        return valid;
    }

    private static validateNumber(value,schema){
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
            valid = valid && value > schema.min;
        }
        return valid;
    }
    private static validateString(value,schema){
        let valid  = typeof value === "string";
        if (!valid)
            return valid;
        const regex = new RegExp(schema.regex,schema.regexFlag || "");
        valid = valid && regex.test(value);
        return valid;
    }
    private static validateBoolean(value,schema){
        let valid;
        try {
            valid = typeof JSON.parse(value) === "boolean";
        } catch (e) {
            valid = false;
        }
        return valid;
    }


}


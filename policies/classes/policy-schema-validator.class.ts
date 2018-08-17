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
                validateItem[key].every(item => this.check(item, schemaItem[key].valueType,validationResult).valid)
            }
            else if (validateItem[key] && typeof validateItem[key] === "object") {
                this.check(validateItem[key], schemaItem[key].valueType,validationResult);
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
                valid = !isNaN(value) && typeof value !== "boolean";
                break;
            case "string":
                valid = typeof value === "string";
                break;
            case "boolean":
                try {
                    valid = typeof JSON.parse(value) === "boolean";
                } catch (e) {
                    valid = false;
                }
                break;
        }
        return valid;
    }


}


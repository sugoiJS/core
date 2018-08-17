import {TComparableValue} from "./compareable-value.interface";

export interface IPolicySchemaValidator<T=any> {
    validate(): IValidationResult;

    validateValue: T;
    schema: { [prop: string]: TComparableValue };
}

export interface IValidationResult {
    valid: boolean,
    invalidValue: any,
    expectedValue: any
}

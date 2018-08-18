
import {TComparableSchema} from "./validate-schema-data.interface";

export interface IPolicySchemaValidator<T=any> {
    validate(): IValidationResult;

    validateValue: T;
    schema: TComparableSchema;
}

export interface IValidationResult {
    valid: boolean,
    invalidValue: any,
    expectedValue: any
}

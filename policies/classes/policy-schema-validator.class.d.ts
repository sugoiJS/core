import { IPolicySchemaValidator, IValidationResult } from "../interfaces/policy-schema-validator.interface";
import { TComparableSchema } from "../interfaces/validate-schema-data.interface";
export declare class PolicySchemaValidator<T = any> implements IPolicySchemaValidator {
    validateValue: T;
    schema: TComparableSchema;
    constructor(validateValue: T, schema: TComparableSchema);
    validate(): IValidationResult;
    private check;
    private checkValue;
    private static validateNumber;
    private static validateString;
    private static validateBoolean;
}

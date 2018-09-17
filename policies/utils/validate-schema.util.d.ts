import { TComparableSchema, TValidateSchemaData } from "../interfaces/validate-schema-data.interface";
import { IValidationResult } from "../interfaces/policy-schema-validator.interface";
export declare class ValidateSchemaUtil {
    static ValidateArgs(policyData: TValidateSchemaData): boolean;
    static ValidateSchema(value: any, schema: TComparableSchema): IValidationResult;
}
declare const ValidateArgs: typeof ValidateSchemaUtil.ValidateArgs;
export { ValidateArgs };

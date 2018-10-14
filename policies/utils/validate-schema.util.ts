import {PolicySchemaValidator} from "../classes/policy-schema-validator.class";
import {TComparableSchema, TValidateSchemaData} from "../interfaces/validate-schema-data.interface";
import {IValidationResult} from "../interfaces/policy-schema-validator.interface";
import {Policy} from "../decorators/policy.decorator";

export class ValidateSchemaUtil {

    @Policy()
    static ValidateArgs(policyData: TValidateSchemaData): boolean | IValidationResult {
        let validationResult;
        for (let meta of policyData.policyMeta) {
            const index: number = meta.hasOwnProperty('argIndex') ? (<number>meta.argIndex) : 0;
            let value = policyData.functionArgs && policyData.functionArgs.length > index
                ? policyData.functionArgs[index]
                : null;
            if (meta.keyInArg) {
                value = value && value[meta.keyInArg] ? value[meta.keyInArg] : null;
            }
            validationResult = ValidateSchemaUtil.ValidateSchema(value, meta.schema);
            if (!validationResult.valid) {
                break;
            }

        }
        return validationResult.valid ? true : validationResult;
    }

    static ValidateSchema(value: any, schema: TComparableSchema): IValidationResult {
        const validator = new PolicySchemaValidator(value, schema);
        return validator.validate();

    }
}

const ValidateArgs = ValidateSchemaUtil.ValidateArgs;
export {ValidateArgs};
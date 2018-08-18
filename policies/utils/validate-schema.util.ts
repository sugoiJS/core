import {PolicySchemaValidator} from "../classes/policy-schema-validator.class";
import {TComparableSchema, TValidateSchemaData} from "../interfaces/validate-schema-data.interface";
import {IValidationResult} from "../interfaces/policy-schema-validator.interface";
import {Policy} from "../decorators/policy.decorator";

export class ValidateSchemaUtil {

    @Policy()
    static ValidateArgs(policyData: TValidateSchemaData): boolean {
        let validationResult;
        for (let meta of policyData.policyMeta) {
            const index = meta.hasOwnProperty('argIndex') ? meta.argIndex : 0;
            let value = policyData.functionArgs[index];
            if (meta.keyInArg) {
                value = value && value[meta.keyInArg]
            }
            validationResult = ValidateSchemaUtil.ValidateSchema(value,meta.schema);
            if (!validationResult.valid) {
                break;
            }

        }
        return validationResult.valid ? true : validationResult;
    }
    @Policy()
    static ValidateSchema(value:any,schema: TComparableSchema): IValidationResult {
        const validator = new PolicySchemaValidator(value, schema);
        return validator.validate();

    }
}

const ValidateArgs = ValidateSchemaUtil.ValidateArgs;
export {ValidateArgs};
import {PolicySchemaValidator} from "../classes/policy-schema-validator.class";
import {TValidateSchemaData} from "../interfaces/validate-schema-data.interface";
import {Policy} from "../decorators/policy.decorator";

export class ValidateSchemaUtil {

    @Policy("ValidateSchemaUtil.ValidateSchema")
    static ValidateSchema(policyData: TValidateSchemaData): boolean {
        let validationResult;
        for (let meta of policyData.policyMeta) {
            let value = policyData.functionArgs[meta.argIndex];
            if (meta.keyInArg) {
                value = value && value[meta.keyInArg]
            }
            let validator = new PolicySchemaValidator(value, meta.schema);
            validationResult = validator.validate();
            if (!validationResult.valid) {
                break;
            }
        }
        return validationResult.valid ? true : validationResult;
    }
}

const ValidateSchema = ValidateSchemaUtil.ValidateSchema;
export {ValidateSchema};
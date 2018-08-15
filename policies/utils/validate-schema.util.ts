import {Policy} from "../decorators/policy.decorator";
import {PolicySchemaValidator} from "../classes/policy-schema-validator.class";
import {TValidateSchemaData} from "../interfaces/validate-schema-data.interface";

export class ValidateSchemaUtil {
    @Policy("ValidateSchema")
    static ValidateSchema(policyData: TValidateSchemaData) {
        let valid = true;
        for (let meta of policyData.policyMeta) {
            let value = policyData.functionArgs[meta.index];
            if (meta.key) {
                value = value[meta.key]
            }
            let validator = new PolicySchemaValidator(value, meta.schema);
            if (!validator.validate()) {
                valid = false;
                break;
            }
        }
    }
}

const ValidateSchema = ValidateSchemaUtil.ValidateSchema;
export {ValidateSchema};
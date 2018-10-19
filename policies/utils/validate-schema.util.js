"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const policy_schema_validator_class_1 = require("../classes/policy-schema-validator.class");
const policy_decorator_1 = require("../decorators/policy.decorator");
class ValidateSchemaUtil {
    static ValidateArgs(policyData) {
        let validationResult;
        for (let meta of policyData.policyMeta) {
            const index = meta.hasOwnProperty('argIndex') ? meta.argIndex : 0;
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
    static ValidateSchema(value, schema) {
        const validator = new policy_schema_validator_class_1.PolicySchemaValidator(value, schema);
        return validator.validate();
    }
}
__decorate([
    policy_decorator_1.Policy(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ValidateSchemaUtil, "ValidateArgs", null);
exports.ValidateSchemaUtil = ValidateSchemaUtil;
const ValidateArgs = ValidateSchemaUtil.ValidateArgs;
exports.ValidateArgs = ValidateArgs;

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
var policy_schema_validator_class_1 = require("../classes/policy-schema-validator.class");
var policy_decorator_1 = require("../decorators/policy.decorator");
var ValidateSchemaUtil = /** @class */ (function () {
    function ValidateSchemaUtil() {
    }
    ValidateSchemaUtil.ValidateArgs = function (policyData) {
        var validationResult;
        for (var _i = 0, _a = policyData.policyMeta; _i < _a.length; _i++) {
            var meta = _a[_i];
            var index = meta.hasOwnProperty('argIndex') ? meta.argIndex : 0;
            var value = policyData.functionArgs[index];
            if (meta.keyInArg) {
                value = value && value[meta.keyInArg];
            }
            validationResult = ValidateSchemaUtil.ValidateSchema(value, meta.schema);
            if (!validationResult.valid) {
                break;
            }
        }
        return validationResult.valid ? true : validationResult;
    };
    ValidateSchemaUtil.ValidateSchema = function (value, schema) {
        var validator = new policy_schema_validator_class_1.PolicySchemaValidator(value, schema);
        return validator.validate();
    };
    __decorate([
        policy_decorator_1.Policy(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Boolean)
    ], ValidateSchemaUtil, "ValidateArgs", null);
    __decorate([
        policy_decorator_1.Policy(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Object)
    ], ValidateSchemaUtil, "ValidateSchema", null);
    return ValidateSchemaUtil;
}());
exports.ValidateSchemaUtil = ValidateSchemaUtil;
var ValidateArgs = ValidateSchemaUtil.ValidateArgs;
exports.ValidateArgs = ValidateArgs;

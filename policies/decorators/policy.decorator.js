"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var policy_item_class_1 = require("../classes/policy-item.class");
var exceptions_constant_1 = require("../../constants/exceptions.constant");
var policy_error_exception_1 = require("../exceptions/policy-error.exception");
var string_util_1 = require("../utils/string.util");
exports.POLICY_META_KEY = "POLICY_META";
exports.POLICY_KEY = "POLICY";
/**
 * Register function as policy
 * @param {string} policyId - optional, if not set {class name}.{function name} will be use
 * @returns {(policyClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
var Policy = function (policyId) {
    return function (policyClass, propertyKey, descriptor) {
        if (typeof descriptor.value !== "function") {
            throw new policy_error_exception_1.SugoiPolicyError(exceptions_constant_1.EXCEPTIONS.INVALID_POLICY.message, exceptions_constant_1.EXCEPTIONS.INVALID_POLICY.code, propertyKey);
        }
        policyId = policyId || policyClass.name + "." + propertyKey;
        policy_item_class_1.PolicyItem.add(new policy_item_class_1.PolicyItem(descriptor.value.bind(policyClass), policyId));
    };
};
exports.Policy = Policy;
/**
 * Apply policy on decorated function.
 * The policy got selected by the policyId
 *
 * @param {string|Function} policy
 * @param {number} failedResponseCode
 * @param policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
var UsePolicy = function (policy, failedResponseCode) {
    if (failedResponseCode === void 0) { failedResponseCode = 400; }
    var policyMeta = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        policyMeta[_i - 2] = arguments[_i];
    }
    var policyId;
    if (typeof policy === "function") {
        policyId = policy.name || string_util_1.StringUtils.generateGuid();
        if (!policy_item_class_1.PolicyItem.has(policyId))
            policy_item_class_1.PolicyItem.add(new policy_item_class_1.PolicyItem(policy, policyId));
    }
    else {
        policyId = policy;
    }
    return function (contextClass, propertyKey, descriptor) {
        propertyKey = !!propertyKey ? propertyKey : null;
        var policies = [];
        var contextPolicies = Reflect.getMetadata(exports.POLICY_KEY, contextClass, propertyKey) || [];
        var isOverridden = contextPolicies.length > 0;
        contextPolicies.push(policyId);
        policies.push.apply(policies, contextPolicies);
        Reflect.defineMetadata(exports.POLICY_KEY, policies, contextClass, propertyKey);
        Reflect.defineMetadata(exports.POLICY_META_KEY, policyMeta, contextClass, propertyKey + "_" + policyId);
        if (!isOverridden) {
            var next = descriptor.value;
            descriptor.value.apply = policy_item_class_1.PolicyItem.setPolicyDescriptor(contextClass, propertyKey, next, failedResponseCode);
        }
    };
};
exports.UsePolicy = UsePolicy;
/**
 *  Predefined policy which check the arguments schema
 *
 * @param {number} failedResponseCode
 * @param {TValidateSchemaData} policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
var ValidateSchemaPolicy = function (failedResponseCode) {
    if (failedResponseCode === void 0) { failedResponseCode = 400; }
    var policyMeta = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        policyMeta[_i - 1] = arguments[_i];
    }
    return UsePolicy.apply(void 0, ['ValidateSchemaUtil.ValidateArgs', failedResponseCode].concat(policyMeta));
};
exports.ValidateSchemaPolicy = ValidateSchemaPolicy;

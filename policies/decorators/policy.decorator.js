"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const policy_item_class_1 = require("../classes/policy-item.class");
const exceptions_constant_1 = require("../../constants/exceptions.constant");
const policy_error_exception_1 = require("../exceptions/policy-error.exception");
const string_util_1 = require("../utils/string.util");
exports.POLICY_META_KEY = "POLICY_META";
exports.POLICY_KEY = "POLICY";
exports.sugPolicyDelimiter = "|_S_|";
/**
 * Register function as policy
 * @param {string} policyId - optional, if not set {class name}.{function name} will be use
 * @returns {(policyClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
const Policy = function (policyId) {
    return function (policyClass, propertyKey, descriptor) {
        if (typeof descriptor.value !== "function") {
            throw new policy_error_exception_1.SugoiPolicyError(exceptions_constant_1.EXCEPTIONS.INVALID_POLICY.message, exceptions_constant_1.EXCEPTIONS.INVALID_POLICY.code, propertyKey);
        }
        policyId = policyId || `${policyClass.name}.${propertyKey}`;
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
const UsePolicy = function (policy, failedResponseCode = 400, ...policyMeta) {
    let policyId;
    const policyMetaObject = { policyMeta, id: string_util_1.StringUtils.generateGuid() };
    if (typeof policy === "function") {
        policyId = policy.name || string_util_1.StringUtils.generateGuid();
        if (!policy_item_class_1.PolicyItem.has(policyId))
            policy_item_class_1.PolicyItem.add(new policy_item_class_1.PolicyItem(policy, policyId));
    }
    else {
        policyId = policy;
    }
    return function (contextClass, propertyKey, descriptor) {
        if (propertyKey && descriptor) {
            applyPolicy(policyId, contextClass, propertyKey, descriptor, policyMetaObject, failedResponseCode);
        }
        else {
            applyPolicyForClassLevel(policyId, contextClass, policyMetaObject, failedResponseCode);
        }
    };
};
exports.UsePolicy = UsePolicy;
function applyPolicyForClassLevel(policyId, contextClass, policyMeta, failedResponseCode) {
    const functions = [];
    functions.push.apply(functions, Object.getOwnPropertyNames(contextClass));
    functions.forEach((functionName) => {
        if (functionName === "constructor" || functionName === "prototype")
            return;
        const descriptor = Object.getOwnPropertyDescriptor(contextClass, functionName);
        if (descriptor && typeof descriptor.value == 'function') {
            applyPolicy(policyId, contextClass, functionName, descriptor, policyMeta, failedResponseCode);
            Object.defineProperty(contextClass, functionName, descriptor);
        }
    });
    if (contextClass.prototype) {
        applyPolicyForClassLevel(policyId, contextClass.prototype, policyMeta, failedResponseCode);
    }
}
function applyPolicy(policyId, contextClass, propertyKey, descriptor, policyMeta, failedResponseCode) {
    propertyKey = !!propertyKey ? propertyKey : null;
    const policies = [];
    const contextPolicies = Reflect.getMetadata(exports.POLICY_KEY, contextClass, propertyKey) || [];
    const isOverridden = contextPolicies.length > 0;
    contextPolicies.push(`${policyId}${exports.sugPolicyDelimiter}${policyMeta.id}`);
    policies.push.apply(policies, contextPolicies);
    Reflect.defineMetadata(exports.POLICY_KEY, policies, contextClass, propertyKey);
    Reflect.defineMetadata(exports.POLICY_META_KEY, policyMeta.policyMeta, contextClass, `${propertyKey}_${policyId}_${policyMeta.id}`);
    if (!isOverridden) {
        const next = descriptor.value;
        descriptor.value = policy_item_class_1.PolicyItem.setPolicyDescriptor(contextClass, propertyKey, next, failedResponseCode);
    }
}
/**
 *  Predefined policy which check the arguments schema
 *
 * @param {number} failedResponseCode
 * @param {TValidateSchemaData} policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
const ValidateSchemaPolicy = function (failedResponseCode = 400, ...policyMeta) {
    return UsePolicy('ValidateSchemaUtil.ValidateArgs', failedResponseCode, ...policyMeta);
};
exports.ValidateSchemaPolicy = ValidateSchemaPolicy;

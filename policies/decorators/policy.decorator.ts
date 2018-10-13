'use strict'
import {PolicyItem, TPolicy} from "../classes/policy-item.class";
import {EXCEPTIONS} from "../../constants/exceptions.constant";
import {SugoiPolicyError} from "../exceptions/policy-error.exception";
import {TValidateSchemaData, TValidateSchemaMeta} from "../interfaces/validate-schema-data.interface";
import {ValidateSchemaUtil} from "../utils/validate-schema.util";
import {StringUtils} from "../utils/string.util";
import getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

export const POLICY_META_KEY = "POLICY_META";
export const POLICY_KEY = "POLICY";

/**
 * Register function as policy
 * @param {string} policyId - optional, if not set {class name}.{function name} will be use
 * @returns {(policyClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
const Policy = function (policyId?: string) {
    return function (policyClass: any,
                     propertyKey: string,
                     descriptor: PropertyDescriptor) {
        if (typeof descriptor.value !== "function") {
            throw new SugoiPolicyError(EXCEPTIONS.INVALID_POLICY.message, EXCEPTIONS.INVALID_POLICY.code, propertyKey);
        }
        policyId = policyId || `${policyClass.name}.${propertyKey}`;
        PolicyItem.add(new PolicyItem(descriptor.value.bind(policyClass), policyId));
    }
};

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
const UsePolicy = function (policy: TPolicy | string, failedResponseCode: number = 400, ...policyMeta: any[]) {
    let policyId;
    if (typeof policy === "function") {
        policyId = policy.name || StringUtils.generateGuid();
        if (!PolicyItem.has(policyId))
            PolicyItem.add(new PolicyItem(policy, policyId));
    } else {
        policyId = policy;
    }

    return function (contextClass: any,
                     propertyKey?: string,
                     descriptor?: PropertyDescriptor) {
        if (propertyKey && descriptor) {
            applyPolicy(policyId, contextClass, propertyKey, descriptor, policyMeta, failedResponseCode)
        } else {
            applyPolicyForClassLevel(policyId, contextClass, policyMeta, failedResponseCode);
        }
    }
};

function applyPolicyForClassLevel(policyId, contextClass, policyMeta, failedResponseCode) {
    const functions = [];
    functions.push.apply(functions, Object.getOwnPropertyNames(contextClass));
    functions.forEach((functionName) => {
        if (functionName === "constructor" || functionName === "prototype") return;
        const descriptor = Object.getOwnPropertyDescriptor(contextClass, functionName);
        if (descriptor && typeof descriptor.value == 'function') {
            applyPolicy(policyId, contextClass, functionName, descriptor, policyMeta, failedResponseCode);
        }
    });
    if (contextClass.prototype) {
        applyPolicyForClassLevel(policyId, contextClass.prototype, policyMeta, failedResponseCode)
    }

}

function applyPolicy(policyId, contextClass, propertyKey: string, descriptor: PropertyDescriptor, policyMeta, failedResponseCode) {
    propertyKey = !!propertyKey ? propertyKey : null;


    const policies = [];
    const contextPolicies = Reflect.getMetadata(POLICY_KEY, contextClass, propertyKey) || [];
    const isOverridden = contextPolicies.length > 0;
    contextPolicies.push(policyId);
    policies.push.apply(policies, contextPolicies);
    Reflect.defineMetadata(POLICY_KEY, policies, contextClass, propertyKey);
    Reflect.defineMetadata(POLICY_META_KEY, policyMeta, contextClass, `${propertyKey}_${policyId}`);

    if (!isOverridden) {
        const next = descriptor.value;
        descriptor.value.apply = PolicyItem.setPolicyDescriptor(contextClass, propertyKey, next, failedResponseCode);
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
const ValidateSchemaPolicy = function (failedResponseCode: number = 400, ...policyMeta: TValidateSchemaMeta[]) {
    return UsePolicy('ValidateSchemaUtil.ValidateArgs', failedResponseCode, ...policyMeta);
};


export {Policy, UsePolicy, ValidateSchemaPolicy}
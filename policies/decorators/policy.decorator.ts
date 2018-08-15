import {PolicyItem} from "../classes/policy-item.class";
import {EXCEPTIONS} from "../../constants/exceptions.constant";
import {SugoiPolicyError} from "../exceptions/policy-error.exception";
import {TValidateSchemaData, TValidateSchemaMeta} from "../interfaces/validate-schema-data.interface";

export const POLICY_META_KEY = "POLICY";

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
        policyId = policyId || `${policyClass.constructor.name}.${propertyKey}`;
        PolicyItem.add(new PolicyItem(descriptor.value.bind(policyClass), policyId));
    }
};

/**
 * Apply policy on decorated function.
 * The policy got selected by the policyId
 *
 * @param {string} policyId
 * @param {number} failedResponseCode
 * @param policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
const UsePolicy = function (policyId: string, failedResponseCode: number = 400, ...policyMeta: any[]) {
    return function (contextClass: any,
                     propertyKey: string,
                     descriptor: PropertyDescriptor) {
        propertyKey = !!propertyKey ? propertyKey : null;

        const policies = [];
        const next = descriptor.value;

        const contextPolicies = Reflect.getMetadata(POLICY_META_KEY, contextClass, propertyKey) || [];
        contextPolicies.push(policyId);
        policies.push.apply(policies, Array.from(new Set(contextPolicies)));
        Reflect.defineMetadata(POLICY_META_KEY, policies, contextClass, propertyKey);

        descriptor.value = PolicyItem.setPolicyDescriptor(contextClass, propertyKey, next, failedResponseCode, ...policyMeta);

    }
};

/**
 *  Predefined policy which check the arguments schema
 *
 * @param {number} failedResponseCode
 * @param {TValidateSchemaData} policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
const ValidateSchemaPolicy = function (failedResponseCode: number = 400, ...policyMeta: TValidateSchemaMeta[]) {
    return UsePolicy("ValidateSchema",failedResponseCode,...policyMeta);
};


export {Policy, UsePolicy, ValidateSchemaPolicy}